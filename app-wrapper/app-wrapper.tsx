import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Gallery } from '../components/gallery';
import { Upload } from '../components/upload';
import { Header } from '../components/header';
import { Error } from '../components/error';
import { colors } from '../App';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { DrawerContent } from './drawer-content';
import { Authentication } from './authentication';
import { Snackbar, Surface, Text } from 'react-native-paper';
import { AppState } from '../app-state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { theme } from '../App';
import { Post } from '../components/post';
import { SnackbarParams } from '../types/snackbar-params';
import { AppStateType } from '../types/appstate-type';

const Drawer = createDrawerNavigator();

export const AppWrapper = () => {
  const appState = AppState.getInstance();

  const [snackbarParams, setSnackbarParams] = React.useState<SnackbarParams>();

  React.useEffect(() => {
    let subscription = appState.state.subscribe((state: AppStateType) => {
      if (state.snackbar) {
        state.snackbar.isVisible = true;
        setSnackbarParams(state.snackbar);

        setTimeout(
          () =>
            setSnackbarParams({
              ...snackbarParams,
              isVisible: false,
            } as SnackbarParams),
          3000
        );
      }
    });

    return subscription.unsubscribe();
  }, []);

  const getComponent = (Component: any, title: string, props: any) => (
    <View
      style={{ flex: 1, backgroundColor: colors.accent, minHeight: '100%' }}
    >
      <Header title={title} navigation={props.navigation} />
      <ScrollView style={{ padding: 15 }}>
        <Component {...props} />
      </ScrollView>
    </View>
  );

  return (
    <NavigationContainer>
      {snackbarParams && (
        <Snackbar
          visible={snackbarParams.isVisible}
          onDismiss={() => {}}
          style={
            {
              backgroundColor: snackbarParams.color,
            } as ViewStyle
          }
        >
          <Text theme={theme} style={{ fontSize: 16 }}>
            {snackbarParams.message}
          </Text>
        </Snackbar>
      )}

      <Authentication>
        <Drawer.Navigator
          initialRouteName='MyContent'
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name='MyContent'>
            {({ navigation }) =>
              getComponent(Post, 'My content', {
                navigation,
                isUserOwnContent: true,
              })
            }
          </Drawer.Screen>
          <Drawer.Screen name='Gallery'>
            {({ navigation }) =>
              getComponent(Gallery, 'Gallery', {
                navigation,
                isUserOwnContent: false,
              })
            }
          </Drawer.Screen>
          <Drawer.Screen name='Upload'>
            {({ navigation }) => getComponent(Upload, 'Upload', { navigation })}
          </Drawer.Screen>
          <Drawer.Screen name='Favorites'>
            {({ navigation }) =>
              getComponent(Post, 'Favorites', { navigation })
            }
          </Drawer.Screen>
          <Drawer.Screen name='Error' component={Error} />
        </Drawer.Navigator>
      </Authentication>
    </NavigationContainer>
  );
};
