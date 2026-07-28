import config from '../config.json' with { type: "json" };

export async function useOllamaAI(prompt, systemPrompt, onLine) {
    const res = await fetch(config.OLLAMAUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: config.OLLAMA_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            stream: true,
            options: {
                num_gpu: 999,
                num_ctx: 4096,
                temperature: 0.7
            }
        })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let jsonBuffer = "";
    let textBuffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        jsonBuffer += decoder.decode(value, { stream: true });

        const lines = jsonBuffer.split("\n");
        jsonBuffer = lines.pop(); // incomplete JSON 유지

        for (const line of lines) {
            if (!line.trim()) continue;

            const chunk = JSON.parse(line);

            if (chunk.message?.content) {
                textBuffer += chunk.message.content;

                let idx;
                while ((idx = textBuffer.indexOf("\n")) !== -1) {
                    const lineStr = textBuffer.slice(0, idx);
                    
                    // 완성된 한 줄을 콜백 함수로 전달
                    if (onLine) {
                        await onLine(lineStr);
                    }

                    textBuffer = textBuffer.slice(idx + 1);
                }
            }

            if (chunk.done) {
                // 잔여 텍스트 처리
                if (textBuffer.length) {
                    if (onLine) {
                        await onLine(textBuffer);
                    }
                    textBuffer = "";
                }
            }
        }
    }
}