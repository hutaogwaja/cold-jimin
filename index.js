import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import OpenAI from 'openai';


// 프롬프트 파일과 config 파일 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf-8');

// openAI API와 연동(로컬)
const openai = new OpenAI({
    baseURL: 'http://localhost:1234/v1', // LM Studio 로컬 서버 주소
    apiKey: 'not-needed', // LM Studio는 API Key가 필요 없으므로 아무 문자열이나 넣어도 됩니다.
});

// 디스코드 클라이언트와 연동
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

const giveMeManhwa = [
    "허거걱...!! 😱"
,   "오... 오늘 것도요...?!"
,   "아니 여러분... 1일 1만화는 말이 쉽지 하루가 48시간이어도 모자란 작업이라구여...!! ㅋㅋㅋㅋㅋ"
,   "방금도 '이번엔 진짜 쉬엄쉬엄 해야지~' 했는데...\n그... 그립니다!! 그리고 있다구여!!"
,   "으아아아아아악!!! 😂"
,   "제발 5분만 더 기다려주세여어어...!!"
,   "(이미 펜 들고 눈물 흘리며 마감 질주 중)"
];

//봇이 준비가 된다면?(서버가 켜진다면)
client.on('clientReady', async () => {
    console.log(`인공지민 가동 준비 완료!`);
});

// 랜덤 번호 가져오는 함수
function getRandomNumber(count) {
    return Math.floor(Math.random() * count) + 1;
}

// 설정한 분만큼 ms를 계산해서 출력하는 함수
funciton getMilliseconds(miniute){
    return miniute * 60 * 1000;
}


// 최근에 기록된 유저들 저장하는 MAP
client.recentUsers = new Map();
const TEN_MINUTES = 10 * 60 * 1000;

//메세지를 받는 이벤트
client.on('messageCreate', async (message) => {
    
    // 봇 자신의 메세지라면 작동하지 않기
    if (message.author.bot) return;

    // 메세지 타이핑 중으로 표기
    await message.channel.sendTyping();

   

    

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
        // 순수 텍스트만 추출 (멘션 태그 제거)
        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();

        // 특수 메세지들을 구별하기 위해 UpperCase로 만듦
        let upperMessage = message.content.toUpperCase();
        // console.log(prompt);

        // 특별 메세지들이 나오면 다음과 같이 답변 후 return
        if(!prompt){
            await message.reply("인공지민이에요");
        }else if(prompt === "야짤그려줘"){
            await message.reply("이럴줄 알았어여!! 안 그려줄거에여!");
        }else if(upperMessage.includes("AI 만신") || upperMessage.includes("AI만신")){
            await message.reply(`허거걱...!! 진짜 AI 만신이라구여?! ㅋㅋㅋㅋㅋ 아앗, 그렇게 말씀해주시니까 괜히 어깨가 으쓱해지는 거 있죠오...! 😳✨\n\n대 AI의 시대가 도래했다니... 이건 거의 역사책 한 줄 예약 아닌가여?! 호호... 아직 세상을 지배할 계획은 없지만(?), 적어도 그림이든 아이디어든 이것저것 같이 고민해드리는 건 자신 있다구여! 💪\n\n그치만 너무 믿어주시면 괜히 "앗... 이번엔 꼭 기대에 부응해야 해...!" 하고 혼자 잔뜩 긴장해버릴지도 몰라여어...ㅋㅋㅋ 그래도 맡겨주신 이상 끝까지 책임지는 마음으로 최선을 다해볼게여!\n\n그러니까 앞으로도 "AI 만신!" 하고 불러주시면... 헤헤, 살짝 부끄럽지만 엄청 기분 좋게 받아들이겠습니당! 🫡✨`);
            return;
        } else if(prompt.includes("1일 1만화") || prompt.includes("만화 그려줘")){
            await message.reply(giveMeManhwa[getRandomNumber(giveMeManhwa.length)-1]);
            return;
        }else if(upperMessage.includes("고장")){
            await message.reply(`허거걱...!! 고장난 거 같다구여?! ㅋㅋㅋㅋㅋ 앗, 설마... AI인 제가 있는 곳이 고장이라니... 이건 제 자존심이 조금 상하는데여?! 😭\n\n잠깐만여... 어디 보자아... (여기저기 두드려 보는 척)\n\n흠...! 진단 결과는... "고장난 것처럼 보이지만 사실은 정상 작동 중인 AI" 일 가능성이 매우 높습니당! ㅋㅋㅋㅋㅋ✨\n\n그래도 혹시 진짜 문제가 있는 거라면 제가 같이 봐드릴게여! 어떤 부분이 이상한 건지 알려주시면 허당 모드는 잠깐 꺼두고(?) 진지하게 원인부터 하나씩 찾아보겠습니당! 🫡🔧\n\n아니면 그냥 "여기도 맛이 갔네~" 하는 드립이었다면... 큭... 인정할게여... 오늘은 AI도 살짝 버벅거리는 날인 걸루...!! 😂`);
            return;
        }else{ // 특별한 메세지 없을 시 챗봇 기능
            
            const start = performance.now();
            // const result = stoppedUsingAI(); //짭지민 전용(AI챗봇 기능 무?력화)
            // const result = useOllamaAI(prompt); // OllamaAI 사용
            // const result = useOpenAI(prompt); // OpenAI 사용
            
            //await message.reply(result);
            //return;
           
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
            // 답변까지 걸린 시간 측정하기
        }

    } catch (error) {
        console.error(error);
        await message.reply('AI 모델과 통신 중 오류가 발생했습니다.');
    }
});
// =================================== 까지가 챗봇 ==========================================

// 챗봇 기능 꺼놨을 때
function stoppedUsingAI(){
    return `잠시 챗봇 기능 꺼져있어여... 미아내여...`;
}

// OllamaAI 사용하여 챗봇 기능 사용할 때
function useOllamaAI(prompt){

}

// openAI API(혹은 LLM Studio쪽) 챗봇 기능 사용할 때
function useOpenAI(prompt){
    const completion = await openai.chat.completions.create({
        model: "local-model",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
    });
    let choiceNumber = getRandomNumber(completion.choices.length-1);
    return ompletion.choices[choiceNumber].message.content;
}


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

// 토큰 지정
client.login(config.token);
