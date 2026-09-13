import OpenAI from 'openai';
import config from '../config.json' with { type: "json" };
import { exportTalkData } from '../modules/database.js';


// OpenAI 클라이언트 초기화 (LM Studio, Ollama, vLLM 등 로컬 API 호환 서버 주소)
const openai = new OpenAI({
    baseURL: config.baseURL, 
    apiKey: config.apiKey, 
});

/**
 * OpenAI 호환 로컬 AI로부터 응답을 줄(Line) 단위 스트리밍으로 받는 함수
 */
export async function useOpenAI(prompt, systemPrompt, message, onLine) {

    // 지금까지 유저와 했던 데이터 추출
    let talkData = await exportTalkData(message.author.id);
    const talkDataRefine = talkData.map(item => `${item.dialogDate}
            사용자 질문내용 : ${item.dialogQuestion}
            인공지민 답변내용 : ${item.dialogAnswer}
            `).join('\n ');


    systemPrompt = `질문자의 성명은 ${message.author.globalName}
    
        여기는 답변하면서 지켜야할 규칙이야
        ${systemPrompt}
        
        아래 내용은 지금까지 질문자랑 대화한 내역들을 가져왔으니 기억하면서 연산하면 돼
        꼭 기억해야해
        ${talkDataRefine}
    `;

    // 1. stream: true 옵션 추가
    const stream = await openai.chat.completions.create({
        model: "gpt-5.6-luna", //"local-model",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ],
        reasoning_effort: "medium", 
        store: true,
        stream: true
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
// inputData
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
