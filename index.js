import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));

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
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;


    try {
        // 타이핑 중 표시
        await message.channel.sendTyping();

        // 순수 텍스트만 추출 (멘션 태그 제거)
        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
        console.log(prompt);
        if(!prompt){
            await message.reply("인공지민이에요");
        }else if(prompt === "야짤그려줘"){
            await message.reply("이럴줄 알았어요!! 안 그려줄거에요!");
        }else{
            await message.reply("뭔가를 답변해야 하는데 아직 학습 안 해서 이 말 밖에 못하네요..");
        }
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

    } catch (error) {
        console.error(error);
        await message.reply('AI 모델과 통신 중 오류가 발생했습니다.');
    }
});


// 봇 객체에 commands를 담을 Collection 생성
client.commands = new Collection();

// commands 폴더에서 명령어 파일 불러오기
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default;
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// 슬래시 명령어 실행 처리 이벤트
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorMessage = { content: '명령어를 실행하는 중 오류가 발생했습니다!', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

client.login(config.token);