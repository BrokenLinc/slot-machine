import React from 'react';
import _ from 'lodash';
import * as FramerMotion from 'framer-motion';

interface Symbol {
  score: number;
  type: string;
  targets?: string[];
  sprite?: string;
}

const SymbolLibrary: Record<string, Symbol> = {
  empty: { score: 0, type: 'empty', sprite: '-' },
  A: { score: 10, type: 'A' },
  B: { score: 100, type: 'B' },
  C: { score: 20, type: 'C' },
  D: { score: 5, type: 'D' },
  E: { score: 2, type: 'E' },
};

// Constants
export const COLUMNS = 5;
export const ROWS = 4;
export const SYMBOL_COUNT = COLUMNS * ROWS;

// Helper to create an array of animation controls
const useAnimations = (n: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return _.times(n, () => FramerMotion.useAnimation());
};

// Randomly select a number of symbols from a collection
// And if there are not enough, fill with empty symbols first
const pickSymbols = (symbols: Symbol[]): Symbol[] => {
  return _.sampleSize(
    symbols.concat(
      _.fill(
        Array(Math.max(0, SYMBOL_COUNT - symbols.length)),
        _.clone(SymbolLibrary.empty)
      )
    ),
    SYMBOL_COUNT
  );
};

const createInitialOwnedSymbols = (): Symbol[] => {
  return [
    _.clone(SymbolLibrary.A),
    _.clone(SymbolLibrary.B),
    _.clone(SymbolLibrary.C),
    _.clone(SymbolLibrary.D),
    _.clone(SymbolLibrary.E),
  ];
};

const createInitialViewportSymbols = (ownedSymbols: Symbol[]): Symbol[] => {
  const result = _.times(SYMBOL_COUNT, () => _.clone(SymbolLibrary.empty));
  result[5] = ownedSymbols[0];
  result[7] = ownedSymbols[1];
  result[9] = ownedSymbols[2];
  result[11] = ownedSymbols[3];
  result[13] = ownedSymbols[4];
  return result;
};

// Trigger various symbol effects and tabulate scores
const processSpin = async (
  viewportSymbols: Symbol[],
  symbolAnimations: FramerMotion.AnimationControls[],
  scoreAnimations: FramerMotion.AnimationControls[],
  addToScore: (n: number) => any
) => {
  // Activate each symbol in order
  for (let i in symbolAnimations) {
    // TODO: Find affected symbols and animate together
    // TODO: Order of operations (change/destroy/add/multiply-score/incerase-score/etc)
    if (!viewportSymbols[i].targets) {
      continue;
    }
    await symbolAnimations[i].start(
      { scale: [1, 2, 1, 2, 1] },
      { duration: 0.2 }
    );
    // TODO: change or destroy affected symbols
  }

  // Tabulate groups of identical scores in descending order
  const uniqueSymbolScoresGroups = _.groupBy(viewportSymbols, 'score');
  const uniqueSymbolScores = _.compact(
    Object.keys(uniqueSymbolScoresGroups).map((v) => parseInt(v))
  ).sort((a, b) => a - b);
  for (let i in uniqueSymbolScores) {
    const score = uniqueSymbolScores[i];
    const symbolGroup = uniqueSymbolScoresGroups[score];
    await Promise.all(
      symbolGroup.map(async (symbol) => {
        const index = viewportSymbols.indexOf(symbol);
        await scoreAnimations[index].start(
          { scale: [0, 1, 1, 0] },
          { duration: 0.4, times: [0, 0.1, 0.9, 1] }
        );
        // Add to score after this batch of animations completes
        addToScore(symbol.score);
      })
    );
  }
};

export const useSlotMachine = () => {
  // The owned collection of symbols
  const [ownedSymbols, setOwnedSymbols] = React.useState<Symbol[]>(() =>
    createInitialOwnedSymbols()
  );
  // The current displayed symbols (a sampling of owned symbols and empties)
  const [viewportSymbols, setViewportSymbols] = React.useState<Symbol[]>(() =>
    createInitialViewportSymbols(ownedSymbols)
  );
  const [spinning, setSpinning] = React.useState(false);
  const symbolAnimations = useAnimations(SYMBOL_COUNT);
  const scoreAnimations = useAnimations(SYMBOL_COUNT);
  const [score, setScore] = React.useState(0);
  const [spinCount, setSpinCount] = React.useState(0);

  const addToScore = (n: number) => {
    setScore((v) => v + n);
  };

  const spin = () => {
    setSpinning(true);
    setSpinCount((n) => n + 1);
    const newSymbols = pickSymbols(ownedSymbols);
    setViewportSymbols(newSymbols);
    // handleSpinComplete will be called after new symbols mount
  };

  const handleSpinComplete = async () => {
    await processSpin(
      viewportSymbols,
      symbolAnimations,
      scoreAnimations,
      addToScore
    );
    setSpinning(false);
  };

  return {
    viewportSymbols,
    score,
    spinCount,
    spinning,
    symbolAnimations,
    scoreAnimations,
    spin,
    handleSpinComplete,
  };
};

const SlotMachine = {
  ROWS,
  COLUMNS,
  useSlotMachine,
};

export default SlotMachine;
