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

export default function HowToBattle({ onBack }: Props) {
  return (
    <HowToLayout title="Battle Mode" subtitle="How To Play" onBack={onBack}>
      <HowToSection number={1} title="How to Play">
        <HowToBody>
          Battle Mode is a timed war against a CPU alter ego. You have 2 minutes per round to out-play your opponent on the board. Place stickers, use powers, manage the clock — whoever builds the winning pattern first takes the round.
        </HowToBody>
        <HowToBody>
          Rounds are best-of-series. Win enough rounds to reach 2,000 battle points and you clear the stage. Lose too many and you're sent back to try again.
        </HowToBody>
        <HowToBody>Each stage features a different CPU alter ego with its own personality, difficulty, and special moves. Start with Todd and work your way up.</HowToBody>
      </HowToSection>

      <HowToSection number={2} title="How to Win">
        <HowToWinRows
          intro="Win a round by hitting any of the 6 win types:"
          standardRollDescription="Same as Standard, completed with a Roll. Earns bonus battle points."
          legendaryRollDescription="Same as Legendary, completed with a Roll. Maximum battle points."
        />
        <HowToDivider />
        <HowToBody>Win rounds to earn battle points. Reach 2,000 points and you win the stage. If time runs out, the round is a draw — no points for either side.</HowToBody>
      </HowToSection>

      <HowToSection number={3} title="Emoji Sticker Rewards">
        <HowToBody>Battle Mode rewards stickers and album puzzle pieces — not just for winning the stage, but for every round you take.</HowToBody>
        <HowToRows
          rows={[
            { label: 'Round Win', description: 'Common or Epic stickers depending on how you won.' },
            { label: 'Stage Clear', description: 'Bonus reward drop including rarer stickers and album puzzle pieces.' },
            { label: 'Puzzle Pieces', description: 'Unique to Battle Mode. Collect pieces to unlock full album pages in the Battle book.' },
          ]}
        />
        <HowToBody>The harder the stage, the better the reward pool. Pushing deep into the journey pays off.</HowToBody>
      </HowToSection>

      <HowToSection number={4} title="What is a Roll?">
        <HowToBody>In Battle Mode, you have a limited number of rolls for the round. Use them carefully — they don't carry over.</HowToBody>
        <HowToRows
          rows={[
            { label: 'Side 1 — Power+', description: 'Triggers a random Emoji Power+. Could flip the board or clear a row.' },
            { label: 'Side 2 — Wild', description: 'Blank result — no power fires but the roll is still consumed.' },
          ]}
        />
        <HowToDivider />
        <HowToBody>Battle Mode also gives you Power Slots — special abilities you can activate on your turn:</HowToBody>
        <HowToRows
          rows={[
            { label: '+10 Seconds', description: 'Adds 10 seconds back to the clock. Use when time is running low.' },
            { label: 'Clock Freeze', description: 'Stops the timer completely for a short period. Gives you breathing room.' },
            { label: 'Reverse Time', description: 'Resets the clock back to full. Powerful — use it when you need a full reset.' },
            { label: 'Rerack', description: 'Shuffles your current rack and gives you a fresh set of emojis.' },
          ]}
        />
      </HowToSection>

      <HowToSection number={5} title="Wager Modes">
        <HowToBody>
          Battle Mode uses its own progression system rather than traditional wagers. Stages scale in difficulty — the further you go, the higher the stakes and the better the rewards.
        </HowToBody>
        <HowToBody>Clearing a stage unlocks the next one. Failing sends you back to retry. No sticker is wagered — but you earn more by pushing further.</HowToBody>
      </HowToSection>

      <HowToSection number={6} title="Special Rules">
        <HowToBody bold>The CPU Alter Egos</HowToBody>
        <HowToBody>
          Each Battle stage has a unique CPU character with their own personality and attack style. Todd is the first — nervous under pressure, capable of dirty tricks. Nico and others follow, each harder and more unpredictable.
        </HowToBody>
        <HowToDivider />
        <HowToBody bold>Todd's Epi Powers</HowToBody>
        <HowToBody>Todd has two moves he can use against you during the match:</HowToBody>
        <HowToRows
          rows={[
            { label: 'Time Warp', description: 'Todd steals 30 seconds from your clock. Watch for the flash — your time just got shorter.' },
            { label: 'Clear Row', description: 'Todd clears your strongest row off the board. Wipes out your progress in that line.' },
          ]}
        />
        <HowToBody>Todd is more likely to use his powers right after you use one of yours. He responds to pressure.</HowToBody>
        <HowToDivider />
        <HowToBody bold>The Timer</HowToBody>
        <HowToBody>Each round runs 2 minutes. If nobody wins before the clock hits zero, the round ends with no points scored. Your timer does not reset between rounds — manage it across the match, not just one round.</HowToBody>
        <HowToDivider />
        <HowToBody bold>The Battle Album</HowToBody>
        <HowToBody>
          Battle Mode has its own album section. Pages unlock as you collect puzzle pieces earned from clearing stages. Some pages reveal full-art illustrations of the CPU alter egos and story fragments from the Emoji Royale world.
        </HowToBody>
      </HowToSection>

      <HowToSection number={7} title="Quick Tips">
        <HowToTips
          tips={[
            "Save Clock Freeze for when Todd uses Time Warp — getting hit for 30 seconds right before you freeze is devastating for him.",
            "Reverse Time is best used early in a round, not when you're already at 10 seconds. Reset from strength.",
            "Todd gets nervous when you use a power. That's when he's most likely to make a mistake — press your advantage.",
            "Don't spend all your rolls early. A Roll Win at the end of a round earns significantly more battle points.",
            'Clear Row hits your best line — not a random one. Build your strongest pattern somewhere else while keeping a decoy row active.',
          ]}
        />
      </HowToSection>
    </HowToLayout>
  );
}
