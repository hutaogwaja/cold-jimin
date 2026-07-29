import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {randomSortArray} from '../modules/randomArray.js';

export default {
    // 슬래시 명령어 메타데이터 정의
    data: new SlashCommandBuilder()
        .setName('프사')
        .setDescription('내가 억울해서 프사 가져오기 기능 만든다. 이거 짜겠다고 1시간 썼다')
        .addStringOption(option =>
        option
            .setName('nickname')
            .setDescription('프사를 가져올 사람을 맨션하세요/입력하지 않는다면 본인 프로필을 가져옵니다')
            .setRequired(false)
        ).addBooleanOption(option =>
        option
            .setName('setting')
            .setDescription('true값이면 서버 프사, false면 디코 기본 프사/입력하지 않으면 false로 처리')
            .setRequired(false)
        ),

    // 명령어가 실행되었을 때 동작
    async execute(interaction) {
        
        let nickname = interaction.options.getString('nickname');
        let setting = interaction.options.getBoolean('setting');

        const requesterImage = interaction.member.avatar ? `https://cdn.discordapp.com/guilds/${interaction.guildId}/users/${interaction.user.id}/avatars/${interaction.member.avatar}.webp?size=1024&animated=true` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp?size=1024&animated=true`;
        
        console.log(nickname, setting);

        try{
            if(nickname){
                nickname = nickname.replace(/<@!?(\d+)>/, '$1'); // 맨션에서 ID 추출
            }else{
                nickname = interaction.user.id; // 입력이 없으면 본인 ID 사용
            }
            const targetUser = await interaction.guild.members.fetch(nickname);

            const profileImage = setting && targetUser.avatar ? `https://cdn.discordapp.com/guilds/${interaction.guildId}/users/${targetUser.user.id}/avatars/${targetUser.avatar}.webp?size=1024&animated=true` : `https://cdn.discordapp.com/avatars/${targetUser.user.id}/${targetUser.user.avatar}.webp?size=1024&animated=true`;

            const resultEmbed = new EmbedBuilder()
                .setColor(0xFFFFF) // 왼쪽 테두리 색상 (HEX 코드 또는 색상 이름)
                .setAuthor({ name: `요청자 : ${interaction.user.globalName} (${interaction.user.tag})`, iconURL: requesterImage })
                .setTitle('요청하신 이미지에여!!') // 제목
                .setImage(profileImage) // 이미지
                .setTimestamp() // 현재 시간 자동 표시
                .setFooter({ text: interaction.client.user.username, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 })}` }); // 하단 푸터

            await interaction.reply({ embeds: [resultEmbed] });

        }catch(error){
            console.error(error);
            await interaction.reply(`으아아아아!!! 오류가 발생했어여... 미아내여... 😭\n 대충 에러가 이렇게 되여..\n\n${error}`);
        }
    }
};