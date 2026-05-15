import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { WinTypeKey } from '../../shared/WinTypeKey';
import { useAudioContext } from '../../audio/AudioContext';
import { howToStyles as s } from './styles';

export type HowToRow = {
  label: string;
  description: string;
};

type LayoutProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
};

export function HowToLayout({ title, subtitle, onBack, children }: LayoutProps) {
  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.screenTitle}>{title}</Text>
        <Text style={s.screenSubtitle}>{subtitle}</Text>
        {children}
        <HowToBackButton onBack={onBack} />
      </ScrollView>
    </View>
  );
}

type SectionProps = {
  number: number;
  title: string;
  children: React.ReactNode;
};

export function HowToSection({ number, title, children }: SectionProps) {
  return (
    <View style={s.card}>
      <Text style={s.sectionNumber}>Section {number}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function HowToBody({ children, bold = false }: { children: React.ReactNode; bold?: boolean }) {
  return <Text style={[s.body, bold && s.bold]}>{children}</Text>;
}

export function HowToDivider() {
  return <View style={s.divider} />;
}

export function HowToRows({ rows }: { rows: HowToRow[] }) {
  return (
    <>
      {rows.map((row) => (
        <View key={`${row.label}-${row.description}`} style={s.winRow}>
          <Text style={s.winLabel}>{row.label}</Text>
          <Text style={s.winDesc}>{row.description}</Text>
        </View>
      ))}
    </>
  );
}

export function HowToTips({ tips }: { tips: string[] }) {
  return (
    <>
      {tips.map((tip) => (
        <View key={tip} style={s.tipRow}>
          <Text style={s.tipBullet}>›</Text>
          <Text style={s.tipText}>{tip}</Text>
        </View>
      ))}
    </>
  );
}

export function HowToWinRows({
  intro,
  standardRollDescription = 'Same as Standard, completed with a Roll. Earns bonus rewards.',
  legendaryDescription = 'Place Polly, PS Emoji, and The Hidden Son on the board at the same time.',
  legendaryRollDescription = 'Same as Legendary, completed with a Roll.',
}: {
  intro?: string;
  standardRollDescription?: string;
  legendaryDescription?: string;
  legendaryRollDescription?: string;
}) {
  return (
    <>
      {intro ? <HowToBody>{intro}</HowToBody> : null}
      <WinTypeKey />
      <HowToDivider />
      <HowToRows
        rows={[
          { label: 'Standard Win', description: '4 of your emojis in a row — horizontal, vertical, or diagonal.' },
          { label: 'Standard Roll Win', description: standardRollDescription },
        ]}
      />
      <HowToDivider />
      <HowToRows
        rows={[
          { label: 'Epic Win', description: '3 of the exact same emoji anywhere on the board.' },
          { label: 'Epic Roll Win', description: 'Same as Epic, completed with a Roll.' },
        ]}
      />
      <HowToDivider />
      <HowToRows
        rows={[
          { label: 'Legendary Win', description: legendaryDescription },
          { label: 'Legendary Roll Win', description: legendaryRollDescription },
        ]}
      />
    </>
  );
}

export function HowToBackButton({ onBack }: { onBack: () => void }) {
  const { playSound } = useAudioContext();

  return (
    <Pressable
      onPress={() => {
        playSound('button');
        onBack();
      }}
      style={({ pressed }) => [s.backBtn, { backgroundColor: pressed ? 'rgba(255,216,107,0.08)' : 'transparent' }]}
    >
      <Text style={s.backBtnText}>BACK</Text>
    </Pressable>
  );
}
