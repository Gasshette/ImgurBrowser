import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { AppWrapper } from './app-wrapper/app-wrapper';
import { Header } from './components/header';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1bb76e', // Color picked on Imgur website
    accent: '#2e3035', // Color picked on Imgur website
  },
};

export const colors = {
  primary: '#1bb76e',
  accent: '#2e3035',
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppWrapper />
    </PaperProvider>
  );
}
