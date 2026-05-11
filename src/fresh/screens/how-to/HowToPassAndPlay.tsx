import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { howToStyles as s } from './styles';

type Props = {
  onBack: () => void;
};

export default function HowToPassAndPlay({ onBack }: Props) {
  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>

        <Text style={s.screenTitle}>Pass & Play</Text>
        <Text style={s.screenSubtitle}>How To Play</Text>

        {/* ── 1. How to Play ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 1</Text>
          <Text style={s.sectionTitle}>How to Play</Text>
          <Text style={s.body}>
            Pass & Play is a two-player hotseat mode on one device. Player 1 takes their turn, then hands the phone to Player 2. You share the same 5×5 board — one rack each.
          </Text>
          <Text style={s.body}>
            When it's your turn, place a sticker from your rack onto an empty board square. Then pass the phone. Simple, competitive, no CPU involved — just two people going head to head.
          </Text>
          <Text style={s.body}>
            A handoff screen appears between turns so neither player sees the other's rack accidentally.
          </Text>
        </View>

        {/* ── 2. How to Win ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 2</Text>
          <Text style={s.sectionTitle}>How to Win</Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Win</Text>
            <Text style={s.winDesc}>4 of your emojis in a row — horizontal, vertical, or diagonal.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Roll Win</Text>
            <Text style={s.winDesc}>Same as Standard, completed using a Roll. Earns bonus rewards.</Text>
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
            The winning player earns sticker rewards based on their win type. Rewards go to their profile — not the other player's.
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard</Text>
            <Text style={s.winDesc}>Common stickers for the winner.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Roll</Text>
            <Text style={s.winDesc}>Common stickers + roll bonus.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic</Text>
            <Text style={s.winDesc}>Epic stickers for the winner.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Roll</Text>
            <Text style={s.winDesc}>Epic stickers + roll bonus.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary</Text>
            <Text style={s.winDesc}>Legendary stickers for the winner — the best in the game.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Roll</Text>
            <Text style={s.winDesc}>Legendary stickers + maximum roll bonus.</Text>
          </View>
        </View>

        {/* ── 4. What is a Roll? ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 4</Text>
          <Text style={s.sectionTitle}>What is a Roll?</Text>
          <Text style={s.body}>
            Each player gets a limited number of rolls per game. On your turn, instead of placing a sticker you can roll — the die has two sides:
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 1 — Power+</Text>
            <Text style={s.winDesc}>Triggers a random Emoji Power+. Could be a row clear, eraser, column wipe, or Scrambler.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 2 — Wild</Text>
            <Text style={s.winDesc}>Blank result. Acts as a utility play — no sticker placed, no power fired.</Text>
          </View>
          <Text style={s.body}>
            The Scrambler Power+ shuffles all stickers on the board — it affects both players equally. A risky move that can completely flip a match.
          </Text>
          <Text style={s.body}>
            If a roll completes your winning pattern, it becomes a Roll Win — worth more rewards.
          </Text>
        </View>

        {/* ── 5. Wager Modes ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 5</Text>
          <Text style={s.sectionTitle}>Wager Modes</Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>No Wager</Text>
            <Text style={s.winDesc}>Casual play. No stickers at risk. Winner still earns basic rewards.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Wager</Text>
            <Text style={s.winDesc}>Both players put 1 Epic Sticker in. Winner takes the pot plus bonus rewards.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Wager</Text>
            <Text style={s.winDesc}>Both players put 1 Legendary Sticker in. Highest stakes in Pass & Play.</Text>
          </View>
        </View>

        {/* ── 6. Special Rules — Pass & Play ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 6</Text>
          <Text style={s.sectionTitle}>Special Rules</Text>
          <Text style={s.body}>
            Pass & Play has two exclusive systems you won't find in other modes:
          </Text>
          <Text style={[s.body, s.bold]}>Hotseat Handoff</Text>
          <Text style={s.body}>
            A screen appears between every turn so you can safely pass the device. Neither player sees the other's rack during a handoff. Tap the screen to confirm the handoff and reveal the board.
          </Text>
          <View style={s.divider} />
          <Text style={[s.body, s.bold]}>The Golden Phoenix</Text>
          <Text style={s.body}>
            There is only one Golden Phoenix on this device at any time. It's a title — carried by the player who earned it last.
          </Text>
          <Text style={s.body}>
            To win the Golden Phoenix, challenge the current holder to a Legendary Wager match and beat them. If you win, the Golden Phoenix transfers to you. If you lose, they keep it.
          </Text>
          <Text style={s.body}>
            If nobody on this device holds the Golden Phoenix yet, the first player to win a Legendary match claims it.
          </Text>
        </View>

        {/* ── 7. Quick Tips — Pass & Play ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 7</Text>
          <Text style={s.sectionTitle}>Quick Tips</Text>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Watch the handoff screen — don't peek at the other player's rack before they hand you the phone.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>The Scrambler is a double-edged sword. Only roll if you're losing — it could flip the game or make it worse.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>The Golden Phoenix is the ultimate bragging right. Play Legendary Wager to go for it.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Track what your opponent is placing. You can see the full board on your turn — use that information.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>An Epic Win can come out of nowhere. Keep duplicate emojis in mind even when building for Standard.</Text></View>
        </View>

        <Pressable onPress={onBack} style={({ pressed }) => [s.backBtn, { backgroundColor: pressed ? 'rgba(255,216,107,0.08)' : 'transparent' }]}>
          <Text style={s.backBtnText}>BACK</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}
