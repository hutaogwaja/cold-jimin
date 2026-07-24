import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('핑')
        .setDescription('봇의 응답 속도와 상태를 확인합니다.'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`🏓 다시 받아칠게요!! (지연 시간: ${interaction.client.ws.ping}ms)`);
    },
};