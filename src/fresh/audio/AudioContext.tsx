import React, { createContext, useContext, useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import type { AudioSourceKey } from '../../lib/audio';

type AudioContextValue = {
  playSound: (key: AudioSourceKey, volume?: number) => void;
  stopResultAudio: () => void;
  duckMusic: () => void;
  unduckMusic: () => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const AudioContext = createContext<AudioContextValue>({
  playSound: () => {},
  stopResultAudio: () => {},
  duckMusic: () => {},
  unduckMusic: () => {},
  isMuted: false,
  toggleMute: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const { playSound, stopResultAudio, duckMusic, unduckMusic } = useAudio(isMuted);

  return (
    <AudioContext.Provider value={{
      playSound,
      stopResultAudio,
      duckMusic,
      unduckMusic,
      isMuted,
      toggleMute: () => setIsMuted(v => !v),
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  return useContext(AudioContext);
}
