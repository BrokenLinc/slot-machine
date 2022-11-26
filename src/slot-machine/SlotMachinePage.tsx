import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import * as FramerMotion from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as SlotMachine from './';

// Constants
const SYMBOL_DIMENSION = 100;
const GRID_HEIGHT = SlotMachine.ROWS * SYMBOL_DIMENSION;
const GRID_WIDTH = SlotMachine.COLUMNS * SYMBOL_DIMENSION;

const MotionUI = {
  Box: FramerMotion.motion(UI.Box),
  Flex: FramerMotion.motion(UI.Flex),
};

const SlotMachineWindow: React.FC<UI.BoxProps> = (props) => {
  return (
    <UI.Box
      position="relative"
      w={GRID_WIDTH + 4}
      h={GRID_HEIGHT + 4}
      overflow="hidden"
      border="4px solid black"
      {...props}
    />
  );
};

const ReelDivider: React.FC<UI.BoxProps & { column: number }> = ({
  column,
}) => {
  return (
    <UI.Box
      position="absolute"
      bg="black"
      w="4px"
      h={GRID_HEIGHT}
      left={`${SYMBOL_DIMENSION * (column + 1) - 4}px`}
    />
  );
};

const SymbolTile: React.FC<UI.FlexProps & { row: number; column: number }> = ({
  row,
  column,
  ...flexProps
}) => {
  return (
    <MotionUI.Flex
      position="absolute"
      alignItems="center"
      justifyContent="center"
      top={row * SYMBOL_DIMENSION}
      left={column * SYMBOL_DIMENSION}
      w={SYMBOL_DIMENSION}
      h={SYMBOL_DIMENSION}
      initial={{ translateY: GRID_HEIGHT }}
      animate={{ translateY: 0 }}
      transition={{ delay: column / 10 }}
      exit={{ translateY: -GRID_HEIGHT }}
      {...flexProps}
    />
  );
};

const SymbolScoreOverlay: React.FC<
  UI.BoxProps & {
    animate: FramerMotion.AnimationControls;
  }
> = (props) => {
  return (
    <MotionUI.Box
      position="absolute"
      bg="purple.700"
      borderRadius={40}
      color="white"
      p={4}
      pointerEvents="none"
      initial={{ scale: 0 }}
      {...props}
    />
  );
};

const SymbolIcon: React.FC<
  UI.HeadingProps & { symbol: SlotMachine.Symbol }
> = ({ symbol, ...headingProps }) => {
  return (
    <UI.Heading color={symbol.color || ''} {...headingProps}>
      {symbol.icon ? <FontAwesomeIcon icon={symbol.icon} /> : symbol.name}
    </UI.Heading>
  );
};

export const SlotMachinePage: React.FC = () => {
  const {
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
    prizeWindow,
    selectPrize,
    paymentWindow,
  } = SlotMachine.useSlotMachine();

  return (
    <React.Fragment>
      <UI.Stack spacing={4} p={4} alignItems="center">
        <SlotMachineWindow>
          {_.times(SlotMachine.COLUMNS - 1, (column) => {
            return <ReelDivider key={column} column={column} />;
          })}
          <FramerMotion.AnimatePresence onExitComplete={handleSpinComplete}>
            {_.map(viewportSymbols, (symbol, i) => {
              const key = [spinCount, i].join('_');
              const column = i % SlotMachine.COLUMNS;
              const row = Math.floor(i / SlotMachine.COLUMNS);

              return (
                <SymbolTile key={key} row={row} column={column}>
                  <MotionUI.Flex animate={symbolAnimations[i]}>
                    <SymbolIcon symbol={symbol} />
                  </MotionUI.Flex>
                  <SymbolScoreOverlay animate={scoreAnimations[i]}>
                    <UI.Heading size="sm">+{symbol.score}</UI.Heading>
                  </SymbolScoreOverlay>
                </SymbolTile>
              );
            })}
          </FramerMotion.AnimatePresence>
        </SlotMachineWindow>
        <UI.Button
          size="lg"
          disabled={!canSpin}
          colorScheme="green"
          onClick={spin}
        >
          Spin
        </UI.Button>
        <UI.Text>Spinning: {JSON.stringify(spinning)}</UI.Text>
        <UI.Text>Score: {score}</UI.Text>
      </UI.Stack>

      <UI.Modal
        isCentered
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="xl"
        {...prizeWindow}
      >
        <UI.ModalOverlay />
        <UI.ModalContent>
          <UI.ModalHeader>Add a symbol:</UI.ModalHeader>
          <UI.ModalBody>
            <UI.HStack justifyContent="center">
              {_.map(prizeOptions, (prizeOption, i) => (
                <UI.Button
                  key={i}
                  p={4}
                  h="auto"
                  w="160px"
                  onClick={() => selectPrize(prizeOption)}
                >
                  <UI.VStack>
                    <SymbolIcon symbol={prizeOption} />
                    <UI.Heading size="sm">{prizeOption.name}</UI.Heading>
                  </UI.VStack>
                </UI.Button>
              ))}
            </UI.HStack>
          </UI.ModalBody>
          <UI.ModalFooter justifyContent="center">
            <UI.Button
              variant="outline"
              colorScheme="red"
              size="sm"
              onClick={prizeWindow.onClose}
            >
              Skip
            </UI.Button>
          </UI.ModalFooter>
        </UI.ModalContent>
      </UI.Modal>
    </React.Fragment>
  );
};
