import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('파티')
        .setDescription('여기 파티에서 모집 짜줄거에요')
        .addStringOption(option =>
        option
            .setName('title') 
            .setDescription('제목을 입력해줘여..') 
            .setRequired(true) 
        ).addIntegerOption(option =>
        option
            .setName('max_party')
            .setDescription('최대 파티 인원 수를 입력해주세요(최대 파티 인원 수를 넘어가도, 기록은 됩니다')
            .setRequired(true)
        ).addIntegerOption(option =>
        option
            .setName('finish_time')
            .setDescription('만료할 시간을 알려줘요(단위는 분입니다)')
            .setRequired(true)
        ),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        let title = interaction.options.getString('title');
        let maxParty = interaction.options.getInteger('max_party');
        let finishTime = interaction.options.getInteger('finish_time');

        let count = 1;
        let member = [interaction.user.id];
        let result = `파티를 모집합니다!!\n모집명 : ${title}\n현재 인원수 : ${count}/${maxParty}\n파티원 모집 시간 : ${finishTime}분\n참가자: ${member.map(id => `<@${id}>`).join(', ')}\n`;

        await interaction.reply({ content: result, fetchReply: true });
        const message = await interaction.fetchReply();

        // 봇이 직접 게시글에 기본 반응(이모지) 달아두기
        await message.react('🖐️');

        const filter = (reaction, user) => {
            return reaction.emoji.name === '🖐️' && !user.bot; // 이모지를 제대로 클릭한 봇이 아닌 사람인가요?
        };


        const collector = message.createReactionCollector({ filter, time: 60000 * finishTime }); // 유효 시간: finishTime분

        collector.on('collect', async (reaction, user) => {
            if (!member.includes(user.id)) {
                member.push(user.id);
            }
            count++;

            // 게시글 내용 수정
            result = `파티를 모집합니다!!\n모집명 : ${title}\n현재 인원수 : ${count}/${maxParty}\n파티원 모집 시간 : ${finishTime}분\n참가자: ${member.map(id => `<@${id}>`).join(', ')}\n`;
            await message.edit(result);

        });

        collector.on('end', () => {
            
        });
    },
};
