import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('팀')
        .setDescription('짜야할 팀의 수와, 인원을 적어주면 랜덤으로 팀을 짜줘여'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`🏓 다시 받아칠게요!! (지연 시간: ${interaction.client.ws.ping}ms)`);
    },
};