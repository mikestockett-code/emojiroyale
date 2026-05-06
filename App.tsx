import React, { useEffect } from 'react';
import AppShell from './src/fresh/app/AppShell';
import { setupAudioMode } from './src/lib/audio';

export default function App() {
  useEffect(() => {
    void setupAudioMode();
  }, []);

  return <AppShell />;
}
