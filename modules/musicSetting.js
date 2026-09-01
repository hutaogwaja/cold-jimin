import {client, SlashCommandBuilder } from '../discord.js';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';

export function setupMusic(client) {
    const distube = new DisTube(client, {
        emitNewSongOnly: true,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        plugins: [new YtDlpPlugin()]
    });

    // 이벤트 리스너 (노래가 시작될 때 등의 안내)
    distube
        .on('playSong', (queue, song) => 
            queue.textChannel?.send(`🎶 지금 재생 중: **${song.name}** \`${song.formattedDuration}\``)
        )
        .on('addSong', (queue, song) => 
            queue.textChannel?.send(`✅ 대기열에 추가됨: **${song.name}**`)
        )
        .on('empty', queue => queue.textChannel?.send(`🎤 음성 채널이 비어서 나갑니다!`))
        .on('finish', queue => queue.textChannel?.send(`🎵 모든 노래가 끝났습니다!`));

    return distube;
}