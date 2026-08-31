import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('음악')
        .setDescription('유튜브 노래를 재생합니다!')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('재생할 노래 제목 또는 유튜브 링크를 입력하세요')
                .setRequired(true)
        ),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        // 1. 유저가 음성 채널에 들어와 있는지 확인
        if (!voiceChannel) {
            return interaction.reply({ content: '❌ 먼저 음성 채널에 들어가 있어야 해요!', ephemeral: true });
        }

        const query = interaction.options.getString('query');

        await interaction.reply(`🔍 음악을 찾는 중입니다: \`${query}\``);

        try {
            // 2. DisTube를 이용해 음악 재생 (채널 자동 접속 및 재생)
            await interaction.client.distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member,
            });

            await interaction.editReply(`🎶 음악을 성공적으로 불러왔어요!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ 음악을 재생하는 중 에러가 발생했어요: ${error.message}`);
        }
    }
};