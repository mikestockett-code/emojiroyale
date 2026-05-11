import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { howToStyles as s } from './styles';

type Props = {
  onBack: () => void;
};

export default function HowToBattle({ onBack }: Props) {
  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>

        <Text style={s.screenTitle}>Battle Mode</Text>
        <Text style={s.screenSubtitle}>How To Play</Text>

        {/* ── 1. How to Play ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 1</Text>
          <Text style={s.sectionTitle}>How to Play</Text>
          <Text style={s.body}>
            Battle Mode is a timed war against a CPU alter ego. You have 2 minutes per round to out-play your opponent on the board. Place stickers, use powers, manage the clock — whoever builds the winning pattern first takes the round.
          </Text>
          <Text style={s.body}>
            Rounds are best-of-series. Win enough rounds to reach 2,000 battle points and you clear the stage. Lose too many and you're sent back to try again.
          </Text>
          <Text style={s.body}>
            Each stage features a different CPU alter ego with its own personality, difficulty, and special moves. Start with Todd and work your way up.
          </Text>
        </View>

        {/* ── 2. How to Win ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 2</Text>
          <Text style={s.sectionTitle}>How to Win</Text>
          <Text style={s.body}>Win a round by hitting any of the 6 win types:</Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Win</Text>
            <Text style={s.winDesc}>4 of your emojis in a row — horizontal, vertical, or diagonal.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Standard Roll Win</Text>
            <Text style={s.winDesc}>Same as Standard, completed with a Roll. Earns bonus battle points.</Text>
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
            <Text style={s.winDesc}>Same as Legendary, completed with a Roll. Maximum battle points.</Text>
          </View>
          <View style={s.divider} />
          <Text style={s.body}>
            Win rounds to earn battle points. Reach 2,000 points and you win the stage. If time runs out, the round is a draw — no points for either side.
          </Text>
        </View>

        {/* ── 3. Emoji Sticker Rewards ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 3</Text>
          <Text style={s.sectionTitle}>Emoji Sticker Rewards</Text>
          <Text style={s.body}>
            Battle Mode rewards stickers and album puzzle pieces — not just for winning the stage, but for every round you take.
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Round Win</Text>
            <Text style={s.winDesc}>Common or Epic stickers depending on how you won.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Stage Clear</Text>
            <Text style={s.winDesc}>Bonus reward drop including rarer stickers and album puzzle pieces.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Puzzle Pieces</Text>
            <Text style={s.winDesc}>Unique to Battle Mode. Collect pieces to unlock full album pages in the Battle book.</Text>
          </View>
          <Text style={s.body}>
            The harder the stage, the better the reward pool. Pushing deep into the journey pays off.
          </Text>
        </View>

        {/* ── 4. What is a Roll? ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 4</Text>
          <Text style={s.sectionTitle}>What is a Roll?</Text>
          <Text style={s.body}>
            In Battle Mode, you have a limited number of rolls for the round. Use them carefully — they don't carry over.
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 1 — Power+</Text>
            <Text style={s.winDesc}>Triggers a random Emoji Power+. Could flip the board or clear a row.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Side 2 — Wild</Text>
            <Text style={s.winDesc}>Blank result — no power fires but the roll is still consumed.</Text>
          </View>
          <View style={s.divider} />
          <Text style={s.body}>
            Battle Mode also gives you Power Slots — special abilities you can activate on your turn:
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>+10 Seconds</Text>
            <Text style={s.winDesc}>Adds 10 seconds back to the clock. Use when time is running low.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Clock Freeze</Text>
            <Text style={s.winDesc}>Stops the timer completely for a short period. Gives you breathing room.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Reverse Time</Text>
            <Text style={s.winDesc}>Resets the clock back to full. Powerful — use it when you need a full reset.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Rerack</Text>
            <Text style={s.winDesc}>Shuffles your current rack and gives you a fresh set of emojis.</Text>
          </View>
        </View>

        {/* ── 5. Wager Modes ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 5</Text>
          <Text style={s.sectionTitle}>Wager Modes</Text>
          <Text style={s.body}>
            Battle Mode uses its own progression system rather than traditional wagers. Stages scale in difficulty — the further you go, the higher the stakes and the better the rewards.
          </Text>
          <Text style={s.body}>
            Clearing a stage unlocks the next one. Failing sends you back to retry. No sticker is wagered — but you earn more by pushing further.
          </Text>
        </View>

        {/* ── 6. Special Rules — Battle ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 6</Text>
          <Text style={s.sectionTitle}>Special Rules</Text>

          <Text style={[s.body, s.bold]}>The CPU Alter Egos</Text>
          <Text style={s.body}>
            Each Battle stage has a unique CPU character with their own personality and attack style. Todd is the first — nervous under pressure, capable of dirty tricks. Nico and others follow, each harder and more unpredictable.
          </Text>

          <View style={s.divider} />
          <Text style={[s.body, s.bold]}>Todd's Epi Powers</Text>
          <Text style={s.body}>
            Todd has two moves he can use against you during the match:
          </Text>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Time Warp</Text>
            <Text style={s.winDesc}>Todd steals 30 seconds from your clock. Watch for the flash — your time just got shorter.</Text>
          </View>
          <View style={s.winRow}>
            <Text style={s.winLabel}>Clear Row</Text>
            <Text style={s.winDesc}>Todd clears your strongest row off the board. Wipes out your progress in that line.</Text>
          </View>
          <Text style={s.body}>
            Todd is more likely to use his powers right after you use one of yours. He responds to pressure.
          </Text>

          <View style={s.divider} />
          <Text style={[s.body, s.bold]}>The Timer</Text>
          <Text style={s.body}>
            Each round runs 2 minutes. If nobody wins before the clock hits zero, the round ends with no points scored. Your timer does not reset between rounds — manage it across the match, not just one round.
          </Text>

          <View style={s.divider} />
          <Text style={[s.body, s.bold]}>The Battle Album</Text>
          <Text style={s.body}>
            Battle Mode has its own album section. Pages unlock as you collect puzzle pieces earned from clearing stages. Some pages reveal full-art illustrations of the CPU alter egos and story fragments from the Emoji Royale world.
          </Text>
        </View>

        {/* ── 7. Quick Tips — Battle ── */}
        <View style={s.card}>
          <Text style={s.sectionNumber}>Section 7</Text>
          <Text style={s.sectionTitle}>Quick Tips</Text>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipBullet} /></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Save Clock Freeze for when Todd uses Time Warp — getting hit for 30 seconds right before you freeze is devastating for him.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Reverse Time is best used early in a round, not when you're already at 10 seconds. Reset from strength.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Todd gets nervous when you use a power. That's when he's most likely to make a mistake — press your advantage.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Don't spend all your rolls early. A Roll Win at the end of a round earns significantly more battle points.</Text></View>
          <View style={s.tipRow}><Text style={s.tipBullet}>›</Text><Text style={s.tipText}>Clear Row hits your best line — not a random one. Build your strongest pattern somewhere else while keeping a decoy row active.</Text></View>
        </View>

        <Pressable onPress={onBack} style={({ pressed }) => [s.backBtn, { backgroundColor: pressed ? 'rgba(255,216,107,0.08)' : 'transparent' }]}>
          <Text style={s.backBtnText}>BACK</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}
