import React from 'react';
import _ from 'lodash';
import * as FramerMotion from 'framer-motion';
import * as icons from '@fortawesome/pro-solid-svg-icons';
import * as UI from '@chakra-ui/react';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'special';

export interface Effect {
  targets?: Symbol[];
  location:
    | 'anywhere'
    | 'adjacent'
    | 'same_row'
    | 'same_column'
    | 'self_corner';
  type: 'destroy' | 'add' | 'multiply_score' | 'increase_score';
  probability?: number;
}

export interface Symbol {
  name: string;
  score: number;
  targets?: Symbol[];
  icon: icons.IconDefinition;
  color?: string;
  rarity: Rarity;
  effects?: Effect[];
}

const defineSymbol = (props: Partial<Symbol>): Symbol => {
  return {
    name: '',
    score: 0,
    icon: icons.faQuestionCircle,
    rarity: 'common',
    ...props,
  };
};

const symbolLibrary = {
  empty: defineSymbol({
    name: 'Empty',
    icon: icons.faHyphen,
    rarity: 'special',
  }),
  bee: defineSymbol({
    name: 'Bee',
    score: 1,
    icon: icons.faBee,
    color: 'yellow.400',
  }),
  cat: defineSymbol({
    name: 'Cat',
    score: 1,
    icon: icons.faCat,
    color: 'orange.400',
  }),
  cherry: defineSymbol({
    name: 'Cherry',
    score: 1,
    icon: icons.faCherries,
    color: 'red.500',
  }),
  coin: defineSymbol({
    name: 'Coin',
    score: 1,
    icon: icons.faCoin,
    color: 'yellow.500',
  }),
  flower: defineSymbol({
    name: 'Flower',
    score: 1,
    icon: icons.faFlowerTulip,
    color: 'purple.400',
  }),
  milk: defineSymbol({
    name: 'Milk',
    score: 1,
    icon: icons.faJug,
    color: 'gray.300',
  }),
  spade: defineSymbol({
    name: 'Spade',
    score: 1,
    icon: icons.faSpade,
  }),
};

type SymbolKey = keyof typeof symbolLibrary;

const symbolsByRarity: Record<Rarity, Symbol[]> = {
  special: _.filter(symbolLibrary, { rarity: 'special' }),
  common: _.filter(symbolLibrary, { rarity: 'common' }),
  rare: _.filter(symbolLibrary, { rarity: 'rare' }),
  uncommon: _.filter(symbolLibrary, { rarity: 'uncommon' }),
  very_rare: _.filter(symbolLibrary, { rarity: 'very_rare' }),
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

const createSymbol = (keyOrSymbol: Symbol | SymbolKey) => {
  if (typeof keyOrSymbol === 'string') {
    return _.clone(symbolLibrary[keyOrSymbol]);
  }
  return _.clone(keyOrSymbol);
};

// Randomly select a number of symbols from a collection
// And if there are not enough, fill with empty symbols first
const pickSymbols = (symbols: Symbol[]): Symbol[] => {
  return _.sampleSize(
    symbols.concat(
      _.fill(
        Array(Math.max(0, SYMBOL_COUNT - symbols.length)),
        createSymbol('empty')
      )
    ),
    SYMBOL_COUNT
  );
};

const createInitialOwnedSymbols = (): Symbol[] => {
  const result = _.times(SYMBOL_COUNT, () => createSymbol('empty'));
  result[5] = createSymbol('cat');
  result[7] = createSymbol('cherry');
  result[9] = createSymbol('coin');
  result[11] = createSymbol('flower');
  result[13] = createSymbol('spade');
  return result;
};

const createInitialViewportSymbols = (ownedSymbols: Symbol[]): Symbol[] => {
  return [...ownedSymbols];
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
  const prizeWindow = UI.useDisclosure();
  const [prizeOptions, setPrizeOptions] = React.useState<Symbol[]>([]);
  const paymentWindow = UI.useDisclosure();
  const canSpin = !spinning && !prizeWindow.isOpen && !paymentWindow.isOpen;

  const addToScore = (n: number) => {
    setScore((v) => v + n);
  };

  const spin = () => {
    if (!canSpin) return;

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
    openPrizeWindow();
  };

  const openPrizeWindow = () => {
    // TODO: choose by rarity
    setPrizeOptions(_.sampleSize(symbolsByRarity.common, 3));
    prizeWindow.onOpen();
  };

  const addSymbol = (symbol: Symbol | SymbolKey) => {
    setOwnedSymbols((val) => {
      const symbolToAdd = createSymbol(symbol);
      // if there is an empty symbol,
      //   replace the first one in the viewport OR the first one owned
      const symbolToReplace =
        _.find(viewportSymbols, symbolLibrary.empty) ||
        _.find(ownedSymbols, symbolLibrary.empty);

      if (!symbolToReplace) {
        return [...val, symbolToAdd];
      }

      const newVal = [...val];
      newVal[newVal.indexOf(symbolToReplace)] = symbolToAdd;
      setViewportSymbols((val) => {
        const visibleSymbolIndex = val.indexOf(symbolToReplace);
        if (visibleSymbolIndex === -1) {
          return val;
        }
        const newVal = [...val];
        newVal[visibleSymbolIndex] = symbolToAdd;
        return newVal;
      });
      return newVal;
    });
  };

  const selectPrize = (symbol: Symbol | SymbolKey) => {
    addSymbol(symbol);
    prizeWindow.onClose();
  };

  return {
    viewportSymbols,
    score,
    spinCount,
    spinning,
    canSpin,
    symbolAnimations,
    scoreAnimations,
    spin,
    handleSpinComplete,
    prizeOptions,
    selectPrize,
    prizeWindow,
    paymentWindow,
  };
};

const SlotMachine = {
  ROWS,
  COLUMNS,
  useSlotMachine,
};

export default SlotMachine;
