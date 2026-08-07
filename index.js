import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection, EmbedBuilder } from 'discord.js';
import { exec } from 'node:child_process';
import { useOllamaAI } from './modules/useOllamaAI.js';
import { useOpenAI } from './modules/useOpenAI.js';
import { pool } from './modules/database.js';

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

// 랜덤 번호 가져오는 함수
function getRandomNumber(count) {
    return Math.floor(Math.random() * count) + 1;
}

// 설정한 분만큼 ms를 계산해서 출력하는 함수
function getMilliseconds(miniute){
    return miniute * 60 * 1000;
}

// 이모지 분기 처리 패턴 체크
async function divideEmoji(line, message){
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

/*
// 폴더 내 피알 개수 가져오기
async function getFileCount(folderPath) {
    try {
        const files = await fs.readdir(folderPath);
        console.log(files.length)
        return files.length;
    } catch (error) {
        console.error('폴더를 읽는 중 에러가 발생했습니다:', error.message);
        return 0;
    }
}
*/

// 깃 버전 확인
async function getGitStatus(){
    try{ 
        exec('git fetch', (fetchError) => {
        if (fetchError) {
            return "Git fetch 실패 : " + fetchError.message;
        }

        exec('git status -uno', (statusError, stdout) => {
            if (statusError) {
                return "상태값 조회 실패 : " + statusError.message;
            }else{
                // 결과 분석
                if (stdout.includes('Your branch is up to date')) {
                    return "최신 버전이에요!!";
                } else if (stdout.includes('Your branch is behind')) {
                    return "최신 버전이 아니에여... 업데이트 필요해여...";
                } else {
                    // 로컬에서 임의로 수정한 파일이 있는 경우 등
                    return "따로 여기에서 수정한거 같은데여...";
                }
            }
        });
    });
    }catch(error){
        await channel.send('깃 버전 확인하는데 문제가 발생했어여!!:', error);
    }
}


//봇이 준비가 된다면?(서버가 켜진다면)
client.on('clientReady', async (client) => {
    
    const channelId = config.LogChannel;
    const channel = await client.channels.fetch(channelId);

    let DatabaseStatus = "기능 정지";
    let gitStatus = "아직 제작 중";

    console.log(`인공지민 가동 준비 완료!`);

    // DB 연결
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        DatabaseStatus = "연결 성공했어여!!";
    } catch (error) {
        console.error('[DB 연결 실패] MySQL 설정이나 서버 상태를 확인해줘여!!', error.message);
        DatabaseStatus = "연결 실패했어여... 설정이나 서버 상태를 확인해줘여!!";
    }

    // gitStatus = getGitStatus();
    console.log(gitStatus);

    // 지정된 채널에 상태값 보내기
    try {
        if (channel) {
            const chatBotStatus = config.chatbotSettings.chatBotType !== 'N' ? `${config.chatbotSettings.chatBotType}을 토대로 연결됐어여!!`: "연결 안했어여...";
            const dividedEmoji = config.chatbotSettings.divideEmoji === 'Y' ? `대화랑, 이모지가 메세지 단위로 나눠서 나와여!`: "대화랑 이모지가 붙어서 나와여!!";
            //const fileCount = await getFileCount(path.join(__dirname, 'commands'));
            
            // await channel.send(fileCount);

            const resultEmbed = new EmbedBuilder()
                .setColor(0xFFFFF)
                .setTitle('인공지민 가동완료!!')
                .setDescription("새 슬래시 코드 추가 후 가동 시, 디스코드를 껐다 켜야 슬래시 커맨드가 반영됩니다")
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
                .addFields(
                    //{ name: '슬래시 명령어 개수', value: `${fileCount}` },
                    { name: '데이터베이스', value: `${DatabaseStatus}` },
                    { name: '버전 확인', value: `${gitStatus}`, inline: true},
                    { name: '챗봇 기능 현황', value: `${chatBotStatus}`},
                    { name: '이모지 분리 여부', value: `${dividedEmoji}`},
                )
                .setTimestamp() // 현재 시간 자동 표시
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL({ dynamic: true, size: 1024 })}` }); // 하단 푸터

            await channel.send({ embeds: [resultEmbed] });

            // await channel.send(`# 인공지민 가동완료!!\n\n[인공지민 상태값]\n- DB 상태: ${DatabaseStatus}\n- 깃 버전 상태: ${gitStatus}\n- 챗봇 상태: ${config.chatbotSettings.chatBotType}\n- 이모지 분기 처리: ${config.chatbotSettings.divideEmoji}`);
            
        }
    } catch (error) {
        await channel.send('표기하는데에 문제가 발생했어여!!:', error);
    }
});

// 최근에 기록된 유저들 저장하는 MAP
client.recentUsers = new Map();
const TEN_MINUTES = 10 * 60 * 1000;

async function getSpecificComment(prompt, message) {
    const [rows] = await pool.query(`SELECT easteregg_content AS easterEggContent FROM EasterEgg WHERE 1=1 AND bot_type = 'cold-jimin' AND IF(easteregg_pinned = '1', easteregg_input = ?, INSTR(?, easteregg_input) > 0) ORDER BY rand()`, [prompt, prompt]);
    if (rows.length > 0) {
        console.log(`${rows[0].easterEggContent.replace(/\\n/g, '\n')}`);
        return rows[0].easterEggContent.replace(/\\n/g, '\n');
    }

    return false; 
}

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
        const promptNoSpace = prompt.replace(/\s/g, ''); 
        
        const specificComment = await getSpecificComment(promptNoSpace);
        // console.log(prompt);

        // 특별 메세지들이 나오면 다음과 같이 답변 후 return
        if(!prompt){
            await message.reply("인공지민이에요");
        }else if(specificComment){ //DB에서 조회때림
            await message.reply(specificComment, message);
            return;
        }else{ // 특별한 메세지 없을 시 챗봇 기능
            const start = performance.now();

            // config값에 따라 챗봇 여부 결정
            switch(config.chatbotSettings.chatBotType){
                case "N": // AI 사용 안할 시에
                    await message.reply(`저는 지금 챗봇 기능아 안되여... 미아내여...`);
                    return;
                case "openAI" : // openAI API 사용시
                    await useOpenAI(prompt, SYSTEM_PROMPT, async (line) => {
                        console.log(line);
                        
                        if(config.chatbotSettings.divideEmoji === "Y"){
                            await divideEmoji(line, message);
                        }else{
                            await message.channel.send(line);
                        }
                    });
                    break;
                case "ollamaAI" : // Ollama AI 사용 시
                    await useOllamaAI(prompt, SYSTEM_PROMPT, async (line) => {
                        console.log(line);
                        
                        if(config.chatbotSettings.divideEmoji === "Y"){
                            await divideEmoji(line, message);
                        }else{
                            await message.channel.send(line);
                        }
                    });
                    break;
                default:
                    await message.reply(`설정이 잘못된거 같아여!!`);
                    return;
            }

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

// 토큰 지정
client.login(config.token);
