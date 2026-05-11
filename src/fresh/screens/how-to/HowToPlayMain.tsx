import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { howToStyles as s } from './styles';

type Props = {
  onBack: () => void;
};

export default function HowToPlayMain({ onBack }: Props) {
  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>

        <Text style={s.screenTitle}>How To Play</Text>
        <Text style={s.screenSubtitle}>Emoji Royale</Text>

        {/* ── 1. How to Play ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 1</Text>
          <Text style={s.sectionTitle}>How to Play</Text>
          <Text style={s.body}>
            Emoji Royale is a turn-based strategy game played on a 5×5 board. Each player has a rack of emoji stickers — place them on the board to build winning patterns before your opponent does.
          </Text>
          <Text style={s.body}>
            On your turn, tap a sticker from your rack, then tap the board square where you want to place it. Empty squares only. Once placed, it stays — unless a power removes it.
          </Text>
          <Text style={s.body}>
            The goal is simple: get the right emojis in the right spots before time or turns run out.
          </Text>
        </View>

        {/* ── 2. How to Win ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 2</Text>
          <Text style={s.sectionTitle}>How to Win</Text>
          <Text style={s.body}>There are 6 ways to win:</Text>

          <View style={s.divider} />
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Win</Text>
            <Text style={s.winDesc}>Get 4 of your emojis in a row — horizontal, vertical, or diagonal.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Roll Win</Text>
            <Text style={s.winDesc}>Same as Standard, but the winning move was completed using a Roll.</Text>
          </View>
          <View style={s.divider} />
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Win</Text>
            <Text style={s.winDesc}>Place 3 of the exact same emoji anywhere on the board.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Roll Win</Text>
            <Text style={s.winDesc}>Same as Epic, but completed with a Roll.</Text>
          </View>
          <View style={s.divider} />
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Win</Text>
            <Text style={s.winDesc}>Place all 3 of the legendary trio on the board — Polly, PS Emoji, and The Hidden Son.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Roll Win</Text>
            <Text style={s.winDesc}>Same as Legendary, but completed with a Roll.</Text>
          </View>
        </View>

        {/* ── 3. Emoji Sticker Rewards ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 3</Text>
          <Text style={s.sectionTitle}>Emoji Sticker Rewards</Text>
          <Text style={s.body}>
            Win sticker rewards that go straight into your album. The bigger the win, the rarer the reward.
          </Text>
          <Text style={s.body}>
            Sticker rarities from lowest to highest:
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Common</Text>
            <Text style={s.winDesc}>Earned frequently — the foundation of your album.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic</Text>
            <Text style={s.winDesc}>Earned from Epic wins and higher. Rarer, more valuable.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary</Text>
            <Text style={s.winDesc}>Only from Legendary wins. Very rare.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Platinum</Text>
            <Text style={s.winDesc}>Special tier for top-level rewards.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Power</Text>
            <Text style={s.winDesc}>Stickers tied to powers — earned through specific wins.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Power+</Text>
            <Text style={s.winDesc}>The rarest class. Only from the biggest moments in the game.</Text>
          </View>
        </View>

        {/* ── 4. What is a Roll? ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 4</Text>
          <Text style={s.sectionTitle}>What is a Roll?</Text>
          <Text style={s.body}>
            A Roll is a 2-sided die you can use on your turn instead of placing a sticker. You get a limited number of rolls per game.
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 1</Text>
            <Text style={s.winDesc}>Activates a random Emoji Power+ — could be anything from a row clear to a board scramble.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 2</Text>
            <Text style={s.winDesc}>Blank / Wild Card — acts as a free play or boosts a placement.</Text>
          </View>
          <Text style={s.body}>
            The Scrambler Power+ is the most chaotic — it shuffles every sticker on the entire board. Use it wisely.
          </Text>
          <Text style={s.body}>
            If a Roll completes a winning pattern, it upgrades that win to a Roll Win, which pays out bonus rewards.
          </Text>
        </View>

        {/* ── 5. Wager Modes ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 5</Text>
          <Text style={s.sectionTitle}>Wager Modes</Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>No Wager</Text>
            <Text style={s.winDesc}>Practice mode. No stickers are risked. Still earn basic rewards on a win.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Epic Wager</Text>
            <Text style={s.winDesc}>Put 1 Epic Sticker on the line. Win and you earn bonus epic rewards. Lose and it's gone.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Legendary Wager</Text>
            <Text style={s.winDesc}>Put 1 Legendary Sticker on the line. Highest risk, highest reward.</Text>
          </View>
        </View>

        {/* ── 6. Special Rules ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 6</Text>
          <Text style={s.sectionTitle}>Special Rules</Text>
          <Text style={s.body}>
            Each mode has its own special rules. Open that mode's How To for the full details.
          </Text>
          <Text style={s.body}>
            The Golden Phoenix is a special title held by one player on this device at a time. Earn it by winning a Legendary match against the current holder. Only one person holds it at a time — and it can be taken.
          </Text>
        </View>

        {/* ── 7. Quick Tips ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 7</Text>
          <Text style={s.sectionTitle}>Quick Tips</Text>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Watch the board for both your patterns and your opponent's — blocking is just as important as building.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Save your rolls for critical moments. A well-timed Roll Win pays out far more than a standard win.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Epic wins are easier to set up than you think — keep duplicate emojis in mind when placing.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Wager when your album is stacked. Risking a sticker you have 10 of is smart play.</Text></View>
        </View>

        <Pressable onPress={onBack} style={({ pressed }) => [s.backBtn, { backgroundColor: pressed ? 'rgba(255,216,107,0.08)' : 'transparent' }]}>
          <Text style={s.backBtnText}>BACK</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}
