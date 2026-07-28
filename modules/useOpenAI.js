import OpenAI from 'openai';
import config from '../config.json' with { type: "json" };

// OpenAI 클라이언트 초기화 (LM Studio, Ollama, vLLM 등 로컬 API 호환 서버 주소)
const openai = new OpenAI({
    baseURL: config.baseURL, 
    apiKey: config.apiKey, 
});

/**
 * OpenAI 호환 로컬 AI로부터 응답을 줄(Line) 단위 스트리밍으로 받는 함수
 */
export async function useOpenAI(prompt, systemPrompt, onLine) {

    console.log(openai.baseURL)
    // 1. stream: true 옵션 추가
    const stream = await openai.chat.completions.create({
        model: "local-model",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
        stream: true, 
    });

    let textBuffer = "";

    // 2. OpenAI SDK 스트리밍 순회
    for await (const chunk of stream) {
        // 조각(Chunk) 단위로 들어오는 텍스트 추출
        const content = chunk.choices[0]?.delta?.content || "";
        textBuffer += content;

        // 3. 줄바꿈(\n)이 있을 때마다 잘라서 처리
        let idx;
        while ((idx = textBuffer.indexOf("\n")) !== -1) {
            const lineStr = textBuffer.slice(0, idx);

            // 콜백 함수를 실행해서 줄 단위로 메인 파일에 전달
            if (onLine) {
                await onLine(lineStr);
            }

            textBuffer = textBuffer.slice(idx + 1);
        }
    }

    // 4. 마지막 남은 잔여 텍스트 처리
    if (textBuffer.length > 0) {
        if (onLine) {
            await onLine(textBuffer);
        }
    }
}