import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {randomSortArray} from '../modules/randomArray.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('프로필 정보 표기는 해주는데 아직 안 만듦')
        .addStringOption(option =>
        option
            .setName('user') // 옵션 키 (코드에서 이 이름으로 값을 꺼냅니다)
            .setDescription('프로필을 확인할 사용자를 맨션해줘요') // 사용자에게 보일 설명
            .setRequired(false) // 필수 입력 여부 (true: 반드시 입력해야 함)
        ),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        await interaction.reply(`이거를 검색하다니... 아직 안 만든 상태인데....`);
        /*
        console.log(interaction);
        const channel = interaction.channel;
        let user = interaction.options.getString('user') || interaction.user;

        crewMate = randomSortArray(crewMate);

        let teamResult = [];
        for (let i=0; i<teamCount; i++){
            let row = [];
            for (let j=0; j<crewMate.length; j++){
                if(j % teamCount === i){
                    row.push(crewMate[j])
                }
            }
            teamResult.push(row);
        }

        console.log(teamResult);
        let result = "";
        result += "ㅌ... 팀이여?? 제가 랜덤으로 짜드릴게여...\n";
        for(var i=0; i<teamResult.length; i++){
            result += `팀${i+1} : ${teamResult[i]}\n`;
        }
        result += `이렇게 짜봤어여!`;

        
        const resultEmbed = new EmbedBuilder()
            .setColor(0xFFFFF) // 왼쪽 테두리 색상 (HEX 코드 또는 색상 이름)
            .setTitle('팀을 랜덤으로 짜봤어여!!') // 제목
            .setAuthor({ name: '작성자 이름', iconURL: 'https://i.imgur.com/AfFp7pu.png'}) // 상단 작성자 정보
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

        await interaction.reply({ embeds: [resultEmbed] });
        */
    }
};


/*
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