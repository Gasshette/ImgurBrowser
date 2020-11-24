import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { Api } from '../api';
import { colors } from '../App';
import { Error } from '../components/error';
import { AppState } from '../app-state';
import { AuthenticationResponse } from '../models/authentication-response';

export const Authentication = (props: any) => {
  const api = Api.getInstance();
  const appState = AppState.getInstance();

  const [authState, setauthState] = React.useState({
    isAuthed: false,
    isLoading: true,
  });

  React.useEffect(() => {
    auth();
  }, []);

  const auth = () => {
    api
      .getTokens()
      .then((data: AuthenticationResponse) => {
        api.accessToken = data.accessToken;
        api.refreshToken = data.refreshToken;
        api.username = data.tokenAdditionalParameters.account_username;

        appState.setAppState({
          username: data.tokenAdditionalParameters.account_username,
          isTokenRetrieved: true,
        });

        setauthState({ isAuthed: true, isLoading: false });
      })
      .catch(() => {
        setauthState({ ...authState, isLoading: false });
      });
  };

  const style = StyleSheet.create({
    view: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 100,
      backgroundColor: colors.accent,
    },
  });

  if (authState.isLoading) {
    return (
      <View style={style.view}>
        <ActivityIndicator animating={true} color={colors.primary} />
      </View>
    );
  } else if (authState.isAuthed) {
    return props.children;
  } else {
    return <Error />;
  }
};
