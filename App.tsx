import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AppWrapper } from './app-wrapper/app-wrapper';

export const colors = {
  primary: '#1bb76e',
  accent: '#2e3035',
  surface: '#4a4a4a',
  white: '#FFF',
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    surface: colors.surface,
    text: colors.white,
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppWrapper />
    </PaperProvider>
  );
}
