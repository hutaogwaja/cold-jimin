import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {randomSortArray} from '../modules/randomArray.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('매치')
        .setDescription('1:1로 매칭을 해줘여')
        .addStringOption(option =>
        option
            .setName('teammate')
            .setDescription('여기에 배치해야할 팀원들을 반점 단위로 써줘여')
            .setRequired(true)
        ),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        let crewMate = interaction.options.getString('teammate').split(',');
        let matchCrewMate = interaction.options.getString('teammate').split(',');
        matchCrewMate = await randomSortArray(matchCrewMate);

        console.log(crewMate, matchCrewMate);

        let result = "";
        for(var i=0; i<crewMate.length; i++){
            result += `${crewMate[i]} -> ${matchCrewMate[i]}\n`;
        }

        const requesterImage = interaction.member.avatar ? `https://cdn.discordapp.com/guilds/${interaction.guildId}/users/${interaction.user.id}/avatars/${interaction.member.avatar}.webp?size=1024&animated=true` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp?size=1024&animated=true`;

        const resultEmbed = new EmbedBuilder()
            .setColor(0xFFFFF)
            .setTitle('지정된 사람들을 1대1로 짜봤어여!!')
            .setAuthor({ name: `요청자 : ${interaction.user.globalName} (${interaction.user.tag})`, iconURL: requesterImage})
            .setDescription(result)
            .setTimestamp()
            .setFooter({ text: interaction.client.user.username, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 })}` }); // 하단 푸터

        await interaction.reply({ embeds: [resultEmbed] });
        
    }
};

// 1. 임베드 객체 생성하기

/***나중에 쓸거임
// 2. 메시지나 슬래시 명령어 응답으로 전송하기
// (일반 메시지 전송 시)
await message.reply({ embeds: [exampleEmbed] });

// (슬래시 명령어 interaction 응답 시)
// await interaction.reply({ embeds: [exampleEmbed] });



const resultEmbed = new EmbedBuilder()
            .setColor(0x0099FF) // 왼쪽 테두리 색상 (HEX 코드 또는 색상 이름)
            .setTitle('팀을 랜덤으로 짜봤어여!!') // 제목
            .setURL('https://discord.js.org') // 제목을 클릭했을 때 이동할 링크
            .setAuthor({ name: '작성자 이름', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' }) // 상단 작성자 정보
            .setDescription('여기는 임베드의 본문(설명)이 들어가는 자리입니다. 마크다운(`**굵게**` 등)도 사용 가능합니다!') // 본문
            .setThumbnail('https://i.imgur.com/AfFp7pu.png') // 우측 상단에 작게 들어가는 썸네일 이미지
            .addFields(
                { name: '일반 필드 1', value: '여기는 필드 내용입니다.' },
                { name: '인라인 필드 2', value: 'inline을 true로 주면 옆으로 나란히 배치됩니다.', inline: true },
                { name: '인라인 필드 3', value: '이것도 옆에 붙습니다.', inline: true },
            )
            .setImage('https://i.imgur.com/AfFp7pu.png') // 메시지 하단에 크게 들어가는 메인 이미지
            .setTimestamp() // 현재 시간 자동 표시
            .setFooter({ text: '하단에 들어가는 푸터 텍스트', iconURL: 'https://i.imgur.com/AfFp7pu.png' }); // 하단 푸터
 */