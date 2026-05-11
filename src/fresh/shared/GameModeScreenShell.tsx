import React, { type ComponentProps, type ReactNode } from 'react';
import { View } from 'react-native';
import { WizardOfOzJackpotOverlay } from '../../components/game/WizardOfOzJackpotOverlay';
import { FreshGameArea } from './FreshGameArea';

type Props = {
  gameAreaProps: ComponentProps<typeof FreshGameArea>;
  jackpotVisible?: boolean;
  children?: ReactNode;
};

export function GameModeScreenShell({ gameAreaProps, jackpotVisible = false, children }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <FreshGameArea {...gameAreaProps} />
      {children}
      <WizardOfOzJackpotOverlay visible={jackpotVisible} />
    </View>
  );
}

