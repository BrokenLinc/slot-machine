import React from 'react';
import * as UI from '@chakra-ui/react';

export const theme = UI.extendTheme({
  styles: {
    global: {
      body: {
        // bg: 'gray.200',
      },
    },
  },
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <UI.ChakraProvider theme={theme}>{children}</UI.ChakraProvider>;
};
