import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { howToStyles as s } from './styles';
import { WinTypeKey } from '../../shared/WinTypeKey';

type Props = {
  onBack: () => void;
};

export default function HowToSolo({ onBack }: Props) {
  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>

        <Text style={s.screenTitle}>Solo Mode</Text>
        <Text style={s.screenSubtitle}>How To Play</Text>

        {/* ── 1. How to Play ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 1</Text>
          <Text style={s.sectionTitle}>How to Play</Text>
          <Text style={s.body}>
            Solo is you vs the CPU on a shared 5×5 board. You play as Player 1, the CPU plays as Player 2. You alternate turns — place a sticker, then the CPU places one.
          </Text>
          <Text style={s.body}>
            Pick your wager mode before the match starts. Once you're in, tap a sticker from your rack and then tap the board square to place it. The CPU moves automatically after your turn.
          </Text>
          <Text style={s.body}>
            First to build a winning pattern wins the round. Best of whatever the mode calls for.
          </Text>
        </View>

        {/* ── 2. How to Win ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 2</Text>
          <Text style={s.sectionTitle}>How to Win</Text>
          <WinTypeKey />
          <View style={s.divider} />
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Win</Text>
            <Text style={s.winDesc}>4 of your emojis in a row — horizontal, vertical, or diagonal.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Roll Win</Text>
            <Text style={s.winDesc}>Same as Standard, completed with a Roll. Earns bonus rewards.</Text>
          </View>
          <View style={s.divider} />
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Win</Text>
            <Text style={s.winDesc}>3 of the exact same emoji anywhere on the board.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Roll Win</Text>
            <Text style={s.winDesc}>Same as Epic, completed with a Roll.</Text>
          </View>
          <View style={s.divider} />
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Win</Text>
            <Text style={s.winDesc}>Place Polly, PS Emoji, and The Hidden Son on the board at the same time.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Roll Win</Text>
            <Text style={s.winDesc}>Same as Legendary, completed with a Roll.</Text>
          </View>
        </View>

        {/* ── 3. Emoji Sticker Rewards ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 3</Text>
          <Text style={s.sectionTitle}>Emoji Sticker Rewards</Text>
          <Text style={s.body}>
            Every win in Solo earns stickers for your album. The win type determines what you get:
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard</Text>
            <Text style={s.winDesc}>Common stickers. The everyday reward.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Roll</Text>
            <Text style={s.winDesc}>Common + bonus stickers for using the roll.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic</Text>
            <Text style={s.winDesc}>Epic stickers. Rarer, album-worthy.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Roll</Text>
            <Text style={s.winDesc}>Epic stickers + roll bonus.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary</Text>
            <Text style={s.winDesc}>Legendary stickers. Very rare. These fill the hardest album pages.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Roll</Text>
            <Text style={s.winDesc}>Legendary + the biggest reward in the game.</Text>
          </View>
          <Text style={s.body}>
            Wager modes amplify all of this — see Section 5.
          </Text>
        </View>

        {/* ── 4. What is a Roll? ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 4</Text>
          <Text style={s.sectionTitle}>What is a Roll?</Text>
          <Text style={s.body}>
            You get a limited number of rolls per game. Instead of placing a sticker on your turn, tap Roll to use one.
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 1 — Power+</Text>
            <Text style={s.winDesc}>Triggers a random Emoji Power+. This could be a row clear, an eraser, a column wipe, or the Scrambler.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 2 — Wild</Text>
            <Text style={s.winDesc}>A blank/wild result. Acts as a free utility play.</Text>
          </View>
          <View style={s.divider} />
          <Text style={s.body}>
            In Solo, rolling can land on the Random emoji — when it does, a random Emoji Power+ fires automatically. This can be anything from a safe score boost to a full board scramble. You don't choose — that's the gamble.
          </Text>
          <Text style={s.body}>
            The Scrambler Power+ reshuffles every sticker on the board. It can save you or wreck you.
          </Text>
        </View>

        {/* ── 5. Wager Modes ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 5</Text>
          <Text style={s.sectionTitle}>Wager Modes</Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>No Wager</Text>
            <Text style={s.winDesc}>Practice. No stickers risked. Still earn rewards on a win.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Wager</Text>
            <Text style={s.winDesc}>Wager 1 Epic Sticker. Win and earn bonus epic rewards. Lose and it's gone.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Wager</Text>
            <Text style={s.winDesc}>Wager 1 Legendary Sticker. Highest risk, highest reward in Solo mode.</Text>
          </View>
        </View>

        {/* ── 6. Special Rules — Solo ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 6</Text>
          <Text style={s.sectionTitle}>Special Rules</Text>
          <Text style={s.body}>
            Solo has one mechanic unique to this mode: the Random roll result.
          </Text>
          <Text style={s.body}>
            When your roll lands on the Random emoji, the game fires a random Emoji Power+ without giving you a choice. It pulls from the full power pool — row clear, column clear, eraser, scrambler, and more. It's chaotic on purpose.
          </Text>
          <Text style={s.body}>
            Safe score protects your points during a scramble or board-clear event. If you've built up a safe score, you won't lose everything if the board gets wiped.
          </Text>
        </View>

        {/* ── 7. Quick Tips — Solo ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 7</Text>
          <Text style={s.sectionTitle}>Quick Tips</Text>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>The CPU gets smarter in higher wager modes. No Wager is the right place to learn the board.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Keep your duplicate emojis in mind — an Epic Win can sneak up on you if you're building for Standard.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Don't burn your rolls early. Save them for a moment where a Power+ could flip the match.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>The Random roll is high risk. If you're ahead, you may not want to roll at all.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Legendary Wager with a Legendary Roll Win is the highest payout in the game. Worth grinding for.</Text></View>
        </View>

        <Pressable onPress={onBack} style={({ pressed }) => [s.backBtn, { backgroundColor: pressed ? 'rgba(255,216,107,0.08)' : 'transparent' }]}>
          <Text style={s.backBtnText}>BACK</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}
