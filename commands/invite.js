import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('초대')
        .setDescription('인공지민 초대코드입니다'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`[이거를 누르면 초대할 수 있어요!](https://discord.com/oauth2/authorize?client_id=1529896046380187719&permissions=8&integration_type=0&scope=bot)`);
    },
};