import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {randomSortArray} from '../modules/randomArray.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('랜덤배치')
        .setDescription('인원들을 적어주면 랜덤으로 짜줄거에여!!')
        .addStringOption(option =>
        option
            .setName('list')
            .setDescription('여기에 명단을 반점 단위로 넣어주세여!!')
            .setRequired(true)
        ),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        let crewMate = interaction.options.getString('list').split(',');

        crewMate = await randomSortArray(crewMate);

        let result = `순서 결과 : ${crewMate}`;
        
        await interaction.reply(result);


        const requesterImage = interaction.member.avatar ? `https://cdn.discordapp.com/guilds/${interaction.guildId}/users/${interaction.user.id}/avatars/${interaction.member.avatar}.webp?size=1024&animated=true` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp?size=1024&animated=true`;

        /*
        const resultEmbed = new EmbedBuilder()
            .setColor(0xFFFFF) // 왼쪽 테두리 색상 (HEX 코드 또는 색상 이름)
            .setTitle('팀을 랜덤으로 짜봤어여!!') // 제목
            .setAuthor({ name: `요청자 : ${interaction.user.globalName} (${interaction.user.tag})`, iconURL: requesterImage }) // 상단 작성자 정보
            .setDescription(result) // 본문
            .setTimestamp() // 현재 시간 자동 표시
            .setFooter({ text: interaction.client.user.username, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 })}` }); // 하단 푸터

        await interaction.reply({ embeds: [resultEmbed] });
        */
    }
};