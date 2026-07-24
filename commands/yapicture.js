import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('야짤')
        .setDescription('여러분들이 원하는 으흐흐한 짤들을 줍니다'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`되겠냐고요!`);
    },
};