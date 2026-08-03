import { SlashCommandBuilder } from 'discord.js';
import { exec } from 'node:child_process';
import config from '../config.json' with { type: "json" };
import { checkAdmin } from '../modules/database.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('종료')
        .setDescription('이제 종료해야할거 같아여....'),

    async execute(interaction) {
        if(await checkAdmin(interaction.user.id)){
            await interaction.reply("잘가세여.. 다음에 또 봐요...");
            
            // PM2로 종료
            exec("pm2 delete cold-jimin", (error, stdout, stderr) => {
                if (error) {
                    console.error(`종료 실패: ${error.message}`);
                }
            });
        }else{
            await interaction.reply("으아아아아!!! 선생님은!! 저를 종료할 권한이 없자나여!!!");
        }
    }
};