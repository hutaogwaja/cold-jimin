import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('고속모드')
        .setDescription('인공지민이 더 빠른 속도로 응답할거에여'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`중고 그래픽카드라도 사게 돈 주세요.... 계좌는...`);
    },
};