import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { REST, Routes } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));

const commands = [];
const commandsPath = path.join(__dirname, 'commands'); // 여기에 디렉터리 이름을 넣기
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default;
    
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[경고] ${filePath} 파일에 필수 'data' 또는 'execute' 속성이 없습니다.`);
    }
}

const rest = new REST().setToken(config.token);

(async () => {
    try {
        console.log(`[시작] ${commands.length}개의 슬래시 명령어 등록을 시작합니다.`);

        // 특정 서버에만 빠르게 등록하려면 Routes.applicationGuildCommands(clientID, GUILD_ID) 사용
        // 전역 등록은 Routes.applicationCommands(clientID) 사용
        const data = await rest.put(
            Routes.applicationCommands(config.clientID), // config.json에 봇의 clientID 추가 필요
            { body: commands },
        );

        console.log(`[완료] 총 ${data.length}개의 슬래시 명령어가 성공적으로 등록되었습니다.`);
    } catch (error) {
        console.error(error);
    }
})();