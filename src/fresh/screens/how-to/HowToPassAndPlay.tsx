import React from 'react';
import {
  HowToBody,
  HowToDivider,
  HowToLayout,
  HowToRows,
  HowToSection,
  HowToTips,
  HowToWinRows,
} from './HowToParts';

type Props = {
  onBack: () => void;
};

export default function HowToPassAndPlay({ onBack }: Props) {
  return (
    <HowToLayout title="Pass & Play" subtitle="How To Play" onBack={onBack}>
      <HowToSection number={1} title="How to Play">
        <HowToBody>
          Pass & Play is a two-player hotseat mode on one device. Player 1 takes their turn, then hands the phone to Player 2. You share the same 5×5 board — one rack each.
        </HowToBody>
        <HowToBody>
          When it's your turn, place a sticker from your rack onto an empty board square. Then pass the phone. Simple, competitive, no CPU involved — just two people going head to head.
        </HowToBody>
        <HowToBody>A handoff screen appears between turns so neither player sees the other's rack accidentally.</HowToBody>
      </HowToSection>

      <HowToSection number={2} title="How to Win">
        <HowToWinRows standardRollDescription="Same as Standard, completed using a Roll. Earns bonus rewards." />
      </HowToSection>

      <HowToSection number={3} title="Emoji Sticker Rewards">
        <HowToBody>The winning player earns sticker rewards based on their win type. Rewards go to their profile — not the other player's.</HowToBody>
        <HowToRows
          rows={[
            { label: 'Standard', description: 'Common stickers for the winner.' },
            { label: 'Standard Roll', description: 'Common stickers + roll bonus.' },
            { label: 'Epic', description: 'Epic stickers for the winner.' },
            { label: 'Epic Roll', description: 'Epic stickers + roll bonus.' },
            { label: 'Legendary', description: 'Legendary stickers for the winner — the best in the game.' },
            { label: 'Legendary Roll', description: 'Legendary stickers + maximum roll bonus.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={4} title="What is a Roll?">
        <HowToBody>Each player gets a limited number of rolls per game. On your turn, instead of placing a sticker you can roll — the die has two sides:</HowToBody>
        <HowToRows
          rows={[
            { label: 'Side 1 — Power+', description: 'Triggers a random Emoji Power+. Could be a row clear, eraser, column wipe, or Scrambler.' },
            { label: 'Side 2 — Wild', description: 'Blank result. Acts as a utility play — no sticker placed, no power fired.' },
          ]}
        />
        <HowToBody>The Scrambler Power+ shuffles all stickers on the board — it affects both players equally. A risky move that can completely flip a match.</HowToBody>
        <HowToBody>If a roll completes your winning pattern, it becomes a Roll Win — worth more rewards.</HowToBody>
      </HowToSection>

      <HowToSection number={5} title="Wager Modes">
        <HowToRows
          rows={[
            { label: 'No Wager', description: 'Casual play. No stickers at risk. Winner still earns basic rewards.' },
            { label: 'Epic Wager', description: 'Both players put 1 Epic Sticker in. Winner takes the pot plus bonus rewards.' },
            { label: 'Legendary Wager', description: 'Both players put 1 Legendary Sticker in. Highest stakes in Pass & Play.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={6} title="Special Rules">
        <HowToBody>Pass & Play has two exclusive systems you won't find in other modes:</HowToBody>
        <HowToBody bold>Hotseat Handoff</HowToBody>
        <HowToBody>
          A screen appears between every turn so you can safely pass the device. Neither player sees the other's rack during a handoff. Tap the screen to confirm the handoff and reveal the board.
        </HowToBody>
        <HowToDivider />
        <HowToBody bold>The Golden Phoenix</HowToBody>
        <HowToBody>There is only one Golden Phoenix on this device at any time. It's a title — carried by the player who earned it last.</HowToBody>
        <HowToBody>
          To win the Golden Phoenix, challenge the current holder to a Legendary Wager match and beat them. If you win, the Golden Phoenix transfers to you. If you lose, they keep it.
        </HowToBody>
        <HowToBody>If nobody on this device holds the Golden Phoenix yet, the first player to win a Legendary match claims it.</HowToBody>
      </HowToSection>

      <HowToSection number={7} title="Quick Tips">
        <HowToTips
          tips={[
            "Watch the handoff screen — don't peek at the other player's rack before they hand you the phone.",
            "The Scrambler is a double-edged sword. Only roll if you're losing — it could flip the game or make it worse.",
            'The Golden Phoenix is the ultimate bragging right. Play Legendary Wager to go for it.',
            'Track what your opponent is placing. You can see the full board on your turn — use that information.',
            'An Epic Win can come out of nowhere. Keep duplicate emojis in mind even when building for Standard.',
          ]}
        />
      </HowToSection>
    </HowToLayout>
  );
}
