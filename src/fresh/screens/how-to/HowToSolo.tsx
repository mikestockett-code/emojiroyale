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

export default function HowToSolo({ onBack }: Props) {
  return (
    <HowToLayout title="Solo Mode" subtitle="How To Play" onBack={onBack}>
      <HowToSection number={1} title="How to Play">
        <HowToBody>
          Solo is you vs the CPU on a shared 5×5 board. You play as Player 1, the CPU plays as Player 2. You alternate turns — place a sticker, then the CPU places one.
        </HowToBody>
        <HowToBody>
          Pick your wager mode before the match starts. Once you're in, tap a sticker from your rack and then tap the board square to place it. The CPU moves automatically after your turn.
        </HowToBody>
        <HowToBody>First to build a winning pattern wins the round. Best of whatever the mode calls for.</HowToBody>
      </HowToSection>

      <HowToSection number={2} title="How to Win">
        <HowToWinRows />
      </HowToSection>

      <HowToSection number={3} title="Emoji Sticker Rewards">
        <HowToBody>Every win in Solo earns stickers for your album. The win type determines what you get:</HowToBody>
        <HowToRows
          rows={[
            { label: 'Standard', description: 'Common stickers. The everyday reward.' },
            { label: 'Standard Roll', description: 'Common + bonus stickers for using the roll.' },
            { label: 'Epic', description: 'Epic stickers. Rarer, album-worthy.' },
            { label: 'Epic Roll', description: 'Epic stickers + roll bonus.' },
            { label: 'Legendary', description: 'Legendary stickers. Very rare. These fill the hardest album pages.' },
            { label: 'Legendary Roll', description: 'Legendary + the biggest reward in the game.' },
          ]}
        />
        <HowToBody>Wager modes amplify all of this — see Section 5.</HowToBody>
      </HowToSection>

      <HowToSection number={4} title="What is a Roll?">
        <HowToBody>You get a limited number of rolls per game. Instead of placing a sticker on your turn, tap Roll to use one.</HowToBody>
        <HowToRows
          rows={[
            {
              label: 'Side 1 — Power+',
              description: 'Triggers a random Emoji Power+. This could be a row clear, an eraser, a column wipe, or the Scrambler.',
            },
            { label: 'Side 2 — Wild', description: 'A blank/wild result. Acts as a free utility play.' },
          ]}
        />
        <HowToDivider />
        <HowToBody>
          In Solo, rolling can land on the Random emoji — when it does, a random Emoji Power+ fires automatically. This can be anything from a safe score boost to a full board scramble. You don't choose — that's the gamble.
        </HowToBody>
        <HowToBody>The Scrambler Power+ reshuffles every sticker on the board. It can save you or wreck you.</HowToBody>
      </HowToSection>

      <HowToSection number={5} title="Wager Modes">
        <HowToRows
          rows={[
            { label: 'No Wager', description: 'Practice. No stickers risked. Still earn rewards on a win.' },
            { label: 'Epic Wager', description: "Wager 1 Epic Sticker. Win and earn bonus epic rewards. Lose and it's gone." },
            { label: 'Legendary Wager', description: 'Wager 1 Legendary Sticker. Highest risk, highest reward in Solo mode.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={6} title="Special Rules">
        <HowToBody>Solo has one mechanic unique to this mode: the Random roll result.</HowToBody>
        <HowToBody>
          When your roll lands on the Random emoji, the game fires a random Emoji Power+ without giving you a choice. It pulls from the full power pool — row clear, column clear, eraser, scrambler, and more. It's chaotic on purpose.
        </HowToBody>
        <HowToBody>
          Safe score protects your points during a scramble or board-clear event. If you've built up a safe score, you won't lose everything if the board gets wiped.
        </HowToBody>
      </HowToSection>

      <HowToSection number={7} title="Quick Tips">
        <HowToTips
          tips={[
            'The CPU gets smarter in higher wager modes. No Wager is the right place to learn the board.',
            "Keep your duplicate emojis in mind — an Epic Win can sneak up on you if you're building for Standard.",
            "Don't burn your rolls early. Save them for a moment where a Power+ could flip the match.",
            "The Random roll is high risk. If you're ahead, you may not want to roll at all.",
            'Legendary Wager with a Legendary Roll Win is the highest payout in the game. Worth grinding for.',
          ]}
        />
      </HowToSection>
    </HowToLayout>
  );
}
