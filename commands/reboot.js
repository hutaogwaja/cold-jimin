import { SlashCommandBuilder } from 'discord.js';
import { exec } from 'node:child_process';
import config from '../config.json' with { type: "json" };
import { checkAdmin } from '../modules/database.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('재기동')
        .setDescription('재기동 어디서 들어본거 같은데여..'),

    async execute(interaction) {
        if(await checkAdmin(config.authorID)) {
            await interaction.reply("잠시만 기다려봐여.... 재기동 중이에여... 🔄");
            
            // PM2로 재기동
            exec("pm2 restart \"cold-jimin\" --update-env", (error, stdout, stderr) => {
                if (error) {
                    console.error(`재기동 실패: ${error.message}`);
                }
            });
        }else{
            await interaction.reply("으아아아아!!! 선생님은!! 저를 재기동할 권한이 없자나여!!!");
        }
    }
};