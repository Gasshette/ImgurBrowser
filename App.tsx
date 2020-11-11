import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AppWrapper } from './app-wrapper/app-wrapper';
import { AuthConfiguration, authorize } from 'react-native-app-auth';


const CLIENT_ID = 'f15e2ce763dcdc9';
const CLIENT_SECRET = '4b33d65b4b823b350e6b0f2834555999ba031d08';
const AUTHORIZATION_HEADER = `Authorization:${CLIENT_ID} ${CLIENT_SECRET}`;

const URL_USER_AUTHORIZATION = `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`;

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


const config: AuthConfiguration = {
  issuer: 'https://api.imgur.com/oauth2/authorize',
  clientId: 'f15e2ce763dcdc9',
  clientSecret: '4b33d65b4b823b350e6b0f2834555999ba031d08',
  redirectUrl: 'http://localhost:3000/callback',
  scopes: [],
  // serviceConfiguration: 'https://api.imgur.com/oauth2/token'
};

export default function App() {
  React.useEffect(() => {
    authorize(config).then(data => console.log('authorize data = ', data));
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AppWrapper />
    </PaperProvider>
  );
}
