import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('모델')
        .setDescription('해당 봇에 사용한 LLM을 보여준데여..'),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`내 안에 뭐가 있더라?`)
        //await interaction.reply(`여기있어요!\n[LG AI팀에서 만든 EXAONE 3.5버전이에요](//https://huggingface.co/LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct)`);
    },
};



