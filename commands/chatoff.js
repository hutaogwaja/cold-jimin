import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('채팅끄기')
        .setDescription('저랑 하던 대화를 그만할 수 있어여.. 다시 "/채팅"을 하거나, 멘션으로 채팅을 시작할 수 있데여...'),

    async execute(interaction) {
        interaction.client.recentUsers.delete(interaction.user.id);

        await interaction.reply("ㅅ.. 수고하셧ㅓ여..!!");
    }
};