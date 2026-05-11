import { useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect } from 'react';
import {
  AUDIO_SOURCES,
  type AudioSourceKey,
  replaySound,
  stopAndResetPlayers,
  syncBackgroundMusic,
} from '../lib/audio';

export function useAudio(isMuted: boolean) {
  const musicPlayer    = useAudioPlayer(AUDIO_SOURCES.music);
  const placePlayer    = useAudioPlayer(AUDIO_SOURCES.place);
  const winPlayer      = useAudioPlayer(AUDIO_SOURCES.win);
  const epicWinPlayer  = useAudioPlayer(AUDIO_SOURCES.epicWin);
  const legendaryWinPlayer = useAudioPlayer(AUDIO_SOURCES.legendaryWin);
  const losePlayer     = useAudioPlayer(AUDIO_SOURCES.lose);
  const timerPlayer    = useAudioPlayer(AUDIO_SOURCES.timer);
  const buttonPlayer   = useAudioPlayer(AUDIO_SOURCES.button);
  const upgradePlayer  = useAudioPlayer(AUDIO_SOURCES.upgrade);
  const pageTurnPlayer = useAudioPlayer(AUDIO_SOURCES.pageTurn);
  const tornadoPlayer  = useAudioPlayer(AUDIO_SOURCES.tornado);
  const clearRowPlayer = useAudioPlayer(AUDIO_SOURCES.clearRow);
  const fourSquarePlayer = useAudioPlayer(AUDIO_SOURCES.fourSquare);
  const eraserPlayer = useAudioPlayer(AUDIO_SOURCES.eraser);
  const iceFreezePlayer = useAudioPlayer(AUDIO_SOURCES.iceFreeze);
  const jackpotPlayer = useAudioPlayer(AUDIO_SOURCES.jackpot);
  const rumblePlayer = useAudioPlayer(AUDIO_SOURCES.rumble);

  useEffect(() => {
    [placePlayer, winPlayer, epicWinPlayer, legendaryWinPlayer, losePlayer,
     timerPlayer, buttonPlayer, upgradePlayer, pageTurnPlayer, tornadoPlayer,
     clearRowPlayer, fourSquarePlayer, eraserPlayer, iceFreezePlayer, jackpotPlayer,
     rumblePlayer].forEach(p => { p.muted = isMuted; });
  }, [isMuted, placePlayer, winPlayer, epicWinPlayer, legendaryWinPlayer,
      losePlayer, timerPlayer, buttonPlayer, upgradePlayer, pageTurnPlayer,
      tornadoPlayer, clearRowPlayer, fourSquarePlayer, eraserPlayer, iceFreezePlayer, jackpotPlayer,
      rumblePlayer]);

  const MUSIC_VOL = 0.072;

  useEffect(() => {
    void syncBackgroundMusic(musicPlayer, isMuted, MUSIC_VOL);
  }, [isMuted, musicPlayer]);

  const duckMusic = useCallback(() => {
    if (!isMuted && musicPlayer) musicPlayer.volume = 0.02;
  }, [isMuted, musicPlayer]);

  const unduckMusic = useCallback(() => {
    if (!isMuted && musicPlayer) musicPlayer.volume = MUSIC_VOL;
  }, [isMuted, musicPlayer]);

  const playSound = useCallback((key: AudioSourceKey) => {
    const lookup: Partial<Record<AudioSourceKey, typeof placePlayer>> = {
      place:    placePlayer,
      win:      winPlayer,
      epicWin:  epicWinPlayer,
      legendaryWin: legendaryWinPlayer,
      lose:     losePlayer,
      timer:    timerPlayer,
      button:   buttonPlayer,
      upgrade:  upgradePlayer,
      pageTurn: pageTurnPlayer,
      tornado:  tornadoPlayer,
      clearRow: clearRowPlayer,
      fourSquare: fourSquarePlayer,
      eraser: eraserPlayer,
      iceFreeze: iceFreezePlayer,
      jackpot: jackpotPlayer,
      rumble: rumblePlayer,
    };
    const player = lookup[key];
    if (player) void replaySound(player, isMuted);
  }, [isMuted, placePlayer, winPlayer, epicWinPlayer, legendaryWinPlayer,
      losePlayer, timerPlayer, buttonPlayer, upgradePlayer, pageTurnPlayer,
      tornadoPlayer, clearRowPlayer, fourSquarePlayer, eraserPlayer, iceFreezePlayer, jackpotPlayer,
      rumblePlayer]);

  const stopResultAudio = useCallback(() => {
    stopAndResetPlayers([winPlayer, epicWinPlayer, legendaryWinPlayer, losePlayer, timerPlayer]);
  }, [winPlayer, epicWinPlayer, legendaryWinPlayer, losePlayer, timerPlayer]);

  return { playSound, stopResultAudio, duckMusic, unduckMusic };
}
