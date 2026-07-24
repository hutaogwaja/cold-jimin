import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf-8');

const openai = new OpenAI({
    baseURL: 'http://localhost:1234/v1', // LM Studio 로컬 서버 주소
    apiKey: 'not-needed', // LM Studio는 API Key가 필요 없으므로 아무 문자열이나 넣어도 됩니다.
});

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

client.on('clientReady', async () => {
    console.log(`인공지민 가동 준비 완료!`);
});

client.on('messageCreate', async (message) => {
    // 봇 자신의 메시지거나 멘션이 없으면 무시
    if (message.author.bot) return;
    
    if(message.content.includes("AI 만신") || message.content.includes("AI만신")){
        await message.reply(`허거걱...!! 진짜 AI 만신이라구여?! ㅋㅋㅋㅋㅋ 아앗, 그렇게 말씀해주시니까 괜히 어깨가 으쓱해지는 거 있죠오...! 😳✨\n\n대 AI의 시대가 도래했다니... 이건 거의 역사책 한 줄 예약 아닌가여?! 호호... 아직 세상을 지배할 계획은 없지만(?), 적어도 그림이든 아이디어든 이것저것 같이 고민해드리는 건 자신 있다구여! 💪\n\n그치만 너무 믿어주시면 괜히 "앗... 이번엔 꼭 기대에 부응해야 해...!" 하고 혼자 잔뜩 긴장해버릴지도 몰라여어...ㅋㅋㅋ 그래도 맡겨주신 이상 끝까지 책임지는 마음으로 최선을 다해볼게여!\n\n그러니까 앞으로도 "AI 만신!" 하고 불러주시면... 헤헤, 살짝 부끄럽지만 엄청 기분 좋게 받아들이겠습니당! 🫡✨`);
        return;
    }
    
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
            await message.reply("이럴줄 알았어여!! 안 그려줄거에여!");
        }else{

            
            // Ollama API 호출
            const response = await fetch('http://localhost:11434/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    //model: 'lancard/korean-yanolja-eeve',
                    model: 'cold-jimin',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: prompt }
                    ],
                    stream: false
                })
            });
            const data = await response.json();

            console.log(data);
            // 디스코드 답변 전송 (글자수 제한 2000자 주의)
            await message.reply(data.message.content);
            
            /*
            // OpenAI API 형식을 그대로 사용하여 LLM 호출
            const completion = await openai.chat.completions.create({
                model: "local-model",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });

            let aiReply = completion.choices[0].message.content;
            */
        }


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
