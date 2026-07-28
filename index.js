import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { useOllamaAI } from './modules/useOllamaAI.js';
import { useOpenAI } from './modules/useOpenAI.js';

// 프롬프트 파일과 config 파일 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf-8');

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


// 랜덤 번호 가져오는 함수
function getRandomNumber(count) {
    return Math.floor(Math.random() * count) + 1;
}

// 설정한 분만큼 ms를 계산해서 출력하는 함수
function getMilliseconds(miniute){
    return miniute * 60 * 1000;
}

async function divideEmoji(line, message){
    // 이모지 분기 처리 패턴 체크
    const match = line.match(/^(.*?)(<a?:\w+:\d+>|(?:\p{Extended_Pictographic}(?:\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?)*)+)\s*$/u);

    if (match) {
        const text = match[1].trimEnd();
        const emoji = match[2];

        if (text) await message.channel.send(text);
        await message.channel.send(emoji);
    } else {
        await message.channel.send(line);
    }
}

//봇이 준비가 된다면?(서버가 켜진다면)
client.on('clientReady', async () => {
    console.log(`인공지민 가동 준비 완료!`);
});

// 최근에 기록된 유저들 저장하는 MAP
client.recentUsers = new Map();
const TEN_MINUTES = 10 * 60 * 1000;

//메세지를 받는 이벤트
client.on('messageCreate', async (message) => {
    
    // 봇 자신의 메세지라면 작동하지 않기
    if (message.author.bot) return;

    // 특수 메세지들을 구별하기 위해 UpperCase로 만듦
    let upperMessage = message.content.toUpperCase();
    
    // AI만신(AI 만신) 언급 시 해당 단어 소환
    if(upperMessage.includes("AI 만신") || upperMessage.includes("AI만신")){
        await message.reply(`허거걱...!! 진짜 AI 만신이라구여?! ㅋㅋㅋㅋㅋ 아앗, 그렇게 말씀해주시니까 괜히 어깨가 으쓱해지는 거 있죠오...! 😳✨\n\n대 AI의 시대가 도래했다니... 이건 거의 역사책 한 줄 예약 아닌가여?! 호호... 아직 세상을 지배할 계획은 없지만(?), 적어도 그림이든 아이디어든 이것저것 같이 고민해드리는 건 자신 있다구여! 💪\n\n그치만 너무 믿어주시면 괜히 "앗... 이번엔 꼭 기대에 부응해야 해...!" 하고 혼자 잔뜩 긴장해버릴지도 몰라여어...ㅋㅋㅋ 그래도 맡겨주신 이상 끝까지 책임지는 마음으로 최선을 다해볼게여!\n\n그러니까 앞으로도 "AI 만신!" 하고 불러주시면... 헤헤, 살짝 부끄럽지만 엄청 기분 좋게 받아들이겠습니당! 🫡✨`);
        return;
    } 

    // 맨션 여부 확인(만약 채팅기능 작동 중이라면 그냥 패스하도록)
    const mentioned = message.mentions.has(client.user);
    
    const now = Date.now();
    const recentUsers = client.recentUsers;
    const lastMention = recentUsers.get(message.author.id); //유저의 가장 마지막 맨션시간 구하기

    // 가장 최근 맨션이 10분 전일 때(아직 자동 채팅 기능이 작동 중일때)
    const recentlyMentioned = lastMention && (now - lastMention) < TEN_MINUTES;   
    
    // 채팅 기능 작동 안하거나 맨션 안했으면
    if (!mentioned && !recentlyMentioned) return; 

    // 채팅을 했다면 10분으로 다시 리셋하기
    if (mentioned && recentlyMentioned) { 
        recentUsers.set(message.author.id, now); 
    }

    
    // 메세지 타이핑 중으로 표기
    await message.channel.sendTyping();


    try {
        // 순수 텍스트만 추출 (멘션 태그 제거)
        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
        // console.log(prompt);

        // 특별 메세지들이 나오면 다음과 같이 답변 후 return
        if(!prompt){
            await message.reply("인공지민이에요");
        }else if(prompt === "야짤그려줘"){
            await message.reply("이럴줄 알았어여!! 안 그려줄거에여!");
        }else if(prompt.includes("1일 1만화") || prompt.includes("만화 그려줘")){
            await message.reply(giveMeManhwa[getRandomNumber(giveMeManhwa.length)-1]);
            return;
        }else if(prompt.includes("고장")){
            await message.reply(`허거걱...!! 고장난 거 같다구여?! ㅋㅋㅋㅋㅋ 앗, 설마... AI인 제가 있는 곳이 고장이라니... 이건 제 자존심이 조금 상하는데여?! 😭\n\n잠깐만여... 어디 보자아... (여기저기 두드려 보는 척)\n\n흠...! 진단 결과는... "고장난 것처럼 보이지만 사실은 정상 작동 중인 AI" 일 가능성이 매우 높습니당! ㅋㅋㅋㅋㅋ✨\n\n그래도 혹시 진짜 문제가 있는 거라면 제가 같이 봐드릴게여! 어떤 부분이 이상한 건지 알려주시면 허당 모드는 잠깐 꺼두고(?) 진지하게 원인부터 하나씩 찾아보겠습니당! 🫡🔧\n\n아니면 그냥 "여기도 맛이 갔네~" 하는 드립이었다면... 큭... 인정할게여... 오늘은 AI도 살짝 버벅거리는 날인 걸루...!! 😂`);
            return;
        }else if(prompt.includes("자기소개")){
            await message.reply("저는 인공지민이고, 갈비만두가 최애에요, 그리고 전문하사를 해서 휴머를 빛낼거에요!!\n\n아, 그리고 저는 AI에요!!");
        }else{ // 특별한 메세지 없을 시 챗봇 기능
            
            const start = performance.now();
            
            // AI 사용 안할 시에
            await message.channel.send(`저는 지금 챗봇 기능아 안되여... 미아내여...`);
            
            /*
            // openAI API 사용시
            await useOpenAI(prompt, SYSTEM_PROMPT, async (line) => {
                console.log(line);
                
                await message.channel.send(line);
                //이모지랑 채팅 분활하는 코드 
                //await divideEmoji(line, message);
            });
            */

            /*
            // Ollama AI 사용 시
            await useOllamaAI(prompt, SYSTEM_PROMPT, async (line) => {
                console.log(line);

                await message.channel.send(line);
                //이모지랑 채팅 분활하는 코드 
                //await divideEmoji(line, message);
            });
            */
           
            

            //console.log(data);
            

            
            // 답변까지 걸린 시간 측정하기
            const elapsed = performance.now() - start;
            console.log(`Done! - took:${(elapsed / 1000).toFixed(2)}s`)
            
            return;
        }

    } catch (error) {
        console.error(error);
        await message.reply(`으아아아아!!! 오류가 발생했어여... 미아내여... 😭\n 대충 에러가 이렇게 되여..\n\n${error}`);
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

// 토큰 지정
client.login(config.token);
