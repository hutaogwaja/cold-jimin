import { Client, GatewayIntentBits } from 'discord.js';
import config from './config.json' with { type: 'json' };



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,

        // 아래는 DM용 인텐드
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
    ],
});

client.on('ready', () => {
    console.log(`인공지민 가동 준비 완료!`);
});

client.on('messageCreate', async (message) => {
    // 봇 자신의 메시지거나 멘션이 없으면 무시
    
    console.log(message);

    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;


    try {
        // 타이핑 중 표시
        await message.channel.sendTyping();

        // 순수 텍스트만 추출 (멘션 태그 제거)
        const prompt = message.content.replace(`<@!${client.user.id}>`, '').trim();
/*
        // Ollama API 호출
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma2:9b', // 사용할 모델 이름
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();

        // 디스코드 답변 전송 (글자수 제한 2000자 주의)
        await message.reply(data.response);
*/

        await message.reply("인공지민이에요");
    } catch (error) {
        console.error(error);
        await message.reply('AI 모델과 통신 중 오류가 발생했습니다.');
    }
});

//client.login(process.env.token);
client.login(config.token);