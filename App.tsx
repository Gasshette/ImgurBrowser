import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AppWrapper } from './app-wrapper/app-wrapper';
import { Authentication } from './app-wrapper/authentication';

export const colors = {
  primary: '#1bb76e',
  // primary: '#85BF25', //lemon-green used for upvote (web), can't decide
  accent: '#2e3035',
  warn: '#ff7d00',
  surface: '#4a4a4a',
  white: '#FFF',
  blue: '#171544'
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    warn: colors.warn,
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
