import { SlashCommandBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('채팅')
        .setDescription('가장 최근의 채팅간의 간격이 10분 이내일시 지속하여 채팅을 합니다'),

    async execute(interaction) {
        interaction.client.recentUsers.set(
            interaction.user.id,
            Date.now()
        );

        await interaction.reply("반갑습니다! 인공지민이에여..!!");
    }
};