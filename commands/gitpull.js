import { SlashCommandBuilder } from 'discord.js';
import { exec } from 'node:child_process';
import config from '../config.json' with { type: "json" };
import { checkAdmin } from '../modules/database.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('깃풀')
        .setDescription('Git 저장소에서 최신 변경 사항을 가져올거에여!!!.'),

    async execute(interaction) {
        if(await checkAdmin(interaction.user.id)){
            await interaction.reply("Git 저장소에서 수정 사항을 가져올거에여....");
            
            // PM2로 종료
            exec("git pull origin main", (error, stdout, stderr) => {
                if (error) {
                    console.error(`종료 실패: ${error.message}`);
                }
            });
        }else{
            await interaction.reply("으아아아아!!! 선생님은!! 저의 코드를 가져올 권한이 없자나여!!!");
        }
    }
};