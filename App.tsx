import React from 'react';
import { StyleSheet } from 'react-native';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { AppWrapper } from './app-wrapper/app-wrapper';

export const fallbackImage = '../assets//splash.png';

export const colors = {
  primary: '#1bb76e',
  accent: '#2e3035',
  warn: '#ff7d00',
  surface: '#4a4a4a',
  white: '#FFF',
  blue: '#171544',
  lemonGreen: '#85BF25', //lemon-green used for upvote on the website, maybe a bit too flashy for a mobile app
};

export const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    warn: colors.warn,
    surface: colors.surface,
    text: colors.white,
  },
};

export const globalStyle = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    backgroundColor: colors.accent,
    width: '80%',
    alignSelf: 'center',
    padding: 30,
    borderRadius: 5
  },
  modalTitle: { paddingBottom: 15, fontSize: 18 },
  modalButtonLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  modalButtonSolo: {
    alignSelf: 'flex-end',
    paddingTop: 20,
  }
});

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppWrapper />
    </PaperProvider>
  );
}
