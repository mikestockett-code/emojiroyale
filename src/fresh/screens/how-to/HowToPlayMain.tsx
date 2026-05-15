import React from 'react';
import { HowToBody, HowToDivider, HowToLayout, HowToRows, HowToSection, HowToTips } from './HowToParts';

type Props = {
  onBack: () => void;
};

export default function HowToPlayMain({ onBack }: Props) {
  return (
    <HowToLayout title="How To Play" subtitle="Emoji Royale" onBack={onBack}>
      <HowToSection number={1} title="How to Play">
        <HowToBody>
          Emoji Royale is a turn-based strategy game played on a 5×5 board. Each player has a rack of emoji stickers — place them on the board to build winning patterns before your opponent does.
        </HowToBody>
        <HowToBody>On your turn, tap a sticker from your rack, then tap the board square where you want to place it. Empty squares only. Once placed, it stays — unless a power removes it.</HowToBody>
        <HowToBody>The goal is simple: get the right emojis in the right spots before time or turns run out.</HowToBody>
      </HowToSection>

      <HowToSection number={2} title="How to Win">
        <HowToBody>There are 6 ways to win:</HowToBody>
        <HowToDivider />
        <HowToRows
          rows={[
            { label: 'Standard Win', description: 'Get 4 of your emojis in a row — horizontal, vertical, or diagonal.' },
            { label: 'Standard Roll Win', description: 'Same as Standard, but the winning move was completed using a Roll.' },
          ]}
        />
        <HowToDivider />
        <HowToRows
          rows={[
            { label: 'Epic Win', description: 'Place 3 of the exact same emoji anywhere on the board.' },
            { label: 'Epic Roll Win', description: 'Same as Epic, but completed with a Roll.' },
          ]}
        />
        <HowToDivider />
        <HowToRows
          rows={[
            { label: 'Legendary Win', description: 'Place all 3 of the legendary trio on the board — Polly, PS Emoji, and The Hidden Son.' },
            { label: 'Legendary Roll Win', description: 'Same as Legendary, but completed with a Roll.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={3} title="Emoji Sticker Rewards">
        <HowToBody>Win sticker rewards that go straight into your album. The bigger the win, the rarer the reward.</HowToBody>
        <HowToBody>Sticker rarities from lowest to highest:</HowToBody>
        <HowToRows
          rows={[
            { label: 'Common', description: 'Earned frequently — the foundation of your album.' },
            { label: 'Epic', description: 'Earned from Epic wins and higher. Rarer, more valuable.' },
            { label: 'Legendary', description: 'Only from Legendary wins. Very rare.' },
            { label: 'Platinum', description: 'Special tier for top-level rewards.' },
            { label: 'Power', description: 'Stickers tied to powers — earned through specific wins.' },
            { label: 'Power+', description: 'The rarest class. Only from the biggest moments in the game.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={4} title="What is a Roll?">
        <HowToBody>A Roll is a 2-sided die you can use on your turn instead of placing a sticker. You get a limited number of rolls per game.</HowToBody>
        <HowToRows
          rows={[
            { label: 'Side 1', description: 'Activates a random Emoji Power+ — could be anything from a row clear to a board scramble.' },
            { label: 'Side 2', description: 'Blank / Wild Card — acts as a free play or boosts a placement.' },
          ]}
        />
        <HowToBody>The Scrambler Power+ is the most chaotic — it shuffles every sticker on the entire board. Use it wisely.</HowToBody>
        <HowToBody>If a Roll completes a winning pattern, it upgrades that win to a Roll Win, which pays out bonus rewards.</HowToBody>
      </HowToSection>

      <HowToSection number={5} title="Wager Modes">
        <HowToRows
          rows={[
            { label: 'No Wager', description: 'Practice mode. No stickers are risked. Still earn basic rewards on a win.' },
            { label: 'Epic Wager', description: "Put 1 Epic Sticker on the line. Win and you earn bonus epic rewards. Lose and it's gone." },
            { label: 'Legendary Wager', description: 'Put 1 Legendary Sticker on the line. Highest risk, highest reward.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={6} title="Special Rules">
        <HowToBody>Each mode has its own special rules. Open that mode's How To for the full details.</HowToBody>
        <HowToBody>
          The Golden Phoenix is a special title held by one player on this device at a time. Earn it by winning a Legendary match against the current holder. Only one person holds it at a time — and it can be taken.
        </HowToBody>
      </HowToSection>

      <HowToSection number={7} title="Quick Tips">
        <HowToTips
          tips={[
            "Watch the board for both your patterns and your opponent's — blocking is just as important as building.",
            'Save your rolls for critical moments. A well-timed Roll Win pays out far more than a standard win.',
            "Epic wins are easier to set up than you think — keep duplicate emojis in mind when placing.",
            'Wager when your album is stacked. Risking a sticker you have 10 of is smart play.',
          ]}
        />
      </HowToSection>
    </HowToLayout>
  );
}
