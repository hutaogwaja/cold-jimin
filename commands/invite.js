import fs from 'node:fs';
import path from 'node:path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('초대')
        .setDescription('인공지민 초대코드입니다'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`[이거를 누르면 초대할 수 있어요!](https://discord.com/oauth2/authorize?client_id=${config.clientID}&permissions=8&integration_type=0&scope=bot)`);
    },
};