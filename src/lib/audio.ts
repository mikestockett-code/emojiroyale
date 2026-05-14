import type { AudioPlayer } from 'expo-audio';
import { setAudioModeAsync } from 'expo-audio';
import { getWinnerSound } from './roundResult';

// Call once at app startup — unlocks audio on iOS without requiring a user tap
export async function setupAudioMode() {
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // ignore — non-fatal if device doesn't support it
  }
}

export const AUDIO_SOURCES = {
  music:    require('../../assets/sounds/music.mp3'),
  place:    require('../../assets/sounds/place.mp3'),

  win:          require('../../assets/sounds/win.mp3'),
  epicWin:      require('../../assets/sounds/epic.m4a'),
  legendaryWin: require('../../assets/sounds/legendary_win.m4a'),
  upgrade:      require('../../assets/sounds/woo.mp3'),
  lose:         require('../../assets/sounds/you-lose.mp3'),
  reward:   require('../../assets/sounds/woo.mp3'),
  timer:    require('../../assets/sounds/timer.mp3'),
  heartbeat: require('../../assets/sounds/heartbeat.mp3'),
  stageClear: require('../../assets/sounds/stage_clear.mp3'),
  button:   require('../../assets/sounds/place.mp3'),
  pageTurn: require('../../assets/sounds/pageturn.mp3'),
  tornado:  require('../../assets/sounds/tornado.mp3'),
  clearRow: require('../../assets/sounds/clear_row.mp3'),
  fourSquare: require('../../assets/sounds/4square.mp3'),
  eraser: require('../../assets/sounds/eraser.mp3'),
  iceFreeze: require('../../assets/sounds/icefreeze.mp3'),
  warpSpeed: require('../../assets/sounds/warp_speed.mp3'),
  jackpot: require('../../assets/sounds/yeah.mp3'),
  rumble: require('../../assets/sounds/rumble.mp3'),
  nicoPretty: require('../../assets/sounds/pretty.mp3'),
  nicoThatIsMySpot: require('../../assets/sounds/that_is_my_spot..mp3'),
  nicoStopWait: require('../../assets/sounds/stop_wait.mp3'),
} as const;

export type AudioSourceKey = keyof typeof AUDIO_SOURCES;

export function getWinSound(type: string, isWinner: boolean): AudioSourceKey {
  return getWinnerSound(type, isWinner);
}

// Play a one-shot sound effect — safe to call from any user action
export async function replaySound(
  player: AudioPlayer | null,
  isMuted: boolean,
  volume?: number,
) {
  if (!player || isMuted) return;
  try {
    await Promise.resolve(player.pause());
    await Promise.resolve(player.seekTo(0));
    if (volume !== undefined) player.volume = volume;
    void Promise.resolve(player.play()).catch(() => {});
  } catch {
    // ignore — player may not be ready yet
  }
}

export function stopAndResetPlayer(player: AudioPlayer | null) {
  if (!player) return;
  try {
    player.pause();
    player.seekTo(0);
  } catch {}
}

export function stopAndResetPlayers(players: (AudioPlayer | null)[]) {
  players.forEach(stopAndResetPlayer);
}

// Background music — no hasInteracted gate, relies on setupAudioMode() being
// called at app startup to unlock audio on iOS
export async function syncBackgroundMusic(
  player: AudioPlayer | null,
  isMuted: boolean,
  volume = 0.5,
) {
  if (!player) return;
  try {
    if (isMuted) {
      player.pause();
    } else {
      player.volume = volume;
      player.loop   = true;
      void Promise.resolve(player.play()).catch(() => {});
    }
  } catch {}
}
