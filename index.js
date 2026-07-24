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

client.recentUsers = new Map();
const TEN_MINUTES = 10 * 60 * 1000;


client.on('messageCreate', async (message) => {
    // 봇 자신의 메시지거나 멘션이 없으면 무시
    if (message.author.bot) return;

    await message.channel.sendTyping();

    //예외
    let upperMessage = message.content.toUpperCase();
    if(upperMessage.includes("AI 만신") || upperMessage.includes("AI만신")){
        await message.reply(`허거걱...!! 진짜 AI 만신이라구여?! ㅋㅋㅋㅋㅋ 아앗, 그렇게 말씀해주시니까 괜히 어깨가 으쓱해지는 거 있죠오...! 😳✨\n\n대 AI의 시대가 도래했다니... 이건 거의 역사책 한 줄 예약 아닌가여?! 호호... 아직 세상을 지배할 계획은 없지만(?), 적어도 그림이든 아이디어든 이것저것 같이 고민해드리는 건 자신 있다구여! 💪\n\n그치만 너무 믿어주시면 괜히 "앗... 이번엔 꼭 기대에 부응해야 해...!" 하고 혼자 잔뜩 긴장해버릴지도 몰라여어...ㅋㅋㅋ 그래도 맡겨주신 이상 끝까지 책임지는 마음으로 최선을 다해볼게여!\n\n그러니까 앞으로도 "AI 만신!" 하고 불러주시면... 헤헤, 살짝 부끄럽지만 엄청 기분 좋게 받아들이겠습니당! 🫡✨`);
        return;
    }

    

    // 10분간 대화 active
    const now = Date.now();
    const recentUsers = client.recentUsers;
    const lastMention = recentUsers.get(message.author.id);

    const mentioned = message.mentions.has(client.user);
    const recentlyMentioned = lastMention && (now - lastMention) < TEN_MINUTES;

    if (!mentioned && !recentlyMentioned) return;

    if (mentioned && recentlyMentioned) {
        recentUsers.set(message.author.id, now);
    }


    try {
        // 타이핑 중 표시

        // 순수 텍스트만 추출 (멘션 태그 제거)
        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
        console.log(prompt);
        if(!prompt){
            await message.reply("인공지민이에요");
        }else if(prompt === "야짤그려줘"){
            await message.reply("이럴줄 알았어여!! 안 그려줄거에여!");
        }else if(upperMessage.includes("고장")){
            await message.reply(`허거걱...!! 고장난 거 같다구여?! ㅋㅋㅋㅋㅋ 앗, 설마... AI인 제가 있는 곳이 고장이라니... 이건 제 자존심이 조금 상하는데여?! 😭\n\n잠깐만여... 어디 보자아... (여기저기 두드려 보는 척)\n\n흠...! 진단 결과는... "고장난 것처럼 보이지만 사실은 정상 작동 중인 AI" 일 가능성이 매우 높습니당! ㅋㅋㅋㅋㅋ✨\n\n그래도 혹시 진짜 문제가 있는 거라면 제가 같이 봐드릴게여! 어떤 부분이 이상한 건지 알려주시면 허당 모드는 잠깐 꺼두고(?) 진지하게 원인부터 하나씩 찾아보겠습니당! 🫡🔧\n\n아니면 그냥 "여기도 맛이 갔네~" 하는 드립이었다면... 큭... 인정할게여... 오늘은 AI도 살짝 버벅거리는 날인 걸루...!! 😂`);
            return;
        }else{
            await message.reply(`잠시 챗봇 기능 꺼져있어여... 미아내여...`);
            return;
            /*
            const start = performance.now();
            console.log("Writing...")
            // Ollama API 호출
            const response = await fetch('http://localhost:11434/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'qwen3:8b',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
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
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let jsonBuffer = "";
            let textBuffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                jsonBuffer += decoder.decode(value, { stream: true });

                const lines = jsonBuffer.split("\n");
                jsonBuffer = lines.pop(); // keep incomplete JSON

                for (const line of lines) {
                    if (!line.trim()) continue;

                    const chunk = JSON.parse(line);

                    if (chunk.message?.content) {
                        textBuffer += chunk.message.content;

                        let idx;
                        while ((idx = textBuffer.indexOf("\n")) !== -1) {
                            const line = textBuffer.slice(0, idx)
                            console.log(line);
                            const match = line.match(/^(.*?)(<a?:\w+:\d+>|(?:\p{Extended_Pictographic}(?:\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?)*)+)\s*$/u);
                            if (match) {
                                const text = match[1].trimEnd();
                                const emoji = match[2];

                                if (text) await message.channel.send(text);
                                await message.channel.send(emoji);
                            } else {
                                await message.channel.send(line);
                            }
                            textBuffer = textBuffer.slice(idx + 1);
                        }
                    }

                    if (chunk.done) {
                        // Print any remaining text
                        if (textBuffer.length) {
                            console.log(textBuffer);
                            await message.channel.send(textBuffer);
                            textBuffer = "";
                        }
                    }
                }
            }

            //console.log(data);
            const elapsed = performance.now() - start;
            console.log(`Done! - took:${(elapsed / 1000).toFixed(2)}s`)
            
            
            /*
            // 💡 OpenAI API 형식을 그대로 사용하여 LLM 호출
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