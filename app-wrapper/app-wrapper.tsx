import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Gallery } from '../components/gallery';
import { Upload } from '../components/upload';
import { Favorite } from '../components/favorite';
import { Header } from '../components/header';
import { Error } from '../components/error';
import { UserGallery } from '../components/userGallery';
import { colors } from '../App';
import { Dimensions, Image, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { DrawerContent } from './drawer-content';
import { Authentication } from './authentication';
import { Modal, Snackbar, Text } from 'react-native-paper';
import { AppState, AppStateType, SnackbarParams } from '../app-state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {theme} from '../App';
import { Post } from '../components/post';

const Drawer = createDrawerNavigator();

export const AppWrapper = (props: any) => {
  const subject = new Subject();
  const appState = AppState.getInstance();

  const [snackbarParams, setSnackbarParams] = React.useState<SnackbarParams>();

  React.useEffect(() => {
    appState.state.pipe(takeUntil(subject)).subscribe((state: AppStateType) => {
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

    return subject.unsubscribe();
  }, []);

  const getComponent = (Component: any, title: string, props: any) => (
    <ScrollView style={{ backgroundColor: colors.accent, minHeight: '100%' }}>
      <View style={style.shadow}>
        <Header title={title} navigation={props.navigation} />
      </View>
      <View style={{ padding: 15 }}>
        <Component {...props} />
      </View>
    </ScrollView>
  );

  // TODO: Dark magic makes it not working, niether here of inside the header component.
  // Need an investigation from higher spirit power
  const style = StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 30 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
  });

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
          <Text theme={theme} style={{fontSize: 16}}>{snackbarParams.message}</Text>
        </Snackbar>
      )}

      <Authentication>
        <Drawer.Navigator
          initialRouteName='MyContent'
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name='MyContent'>
            {({ navigation }) => getComponent(Post, 'My content', {navigation, isUserOwnContent: true})}
          </Drawer.Screen>
          <Drawer.Screen name='Gallery'>
            {({ navigation }) => getComponent(Post, 'Gallery', {navigation, isUserOwnContent: false})}
          </Drawer.Screen>
          <Drawer.Screen name='Upload'>
            {({ navigation }) => getComponent(Upload, 'Upload', {navigation})}
          </Drawer.Screen>
          <Drawer.Screen name='Favorites'>
            {({ navigation }) =>
              getComponent(Post, 'Favorites', {navigation})
            }
          </Drawer.Screen>
          <Drawer.Screen name='Error' component={Error} />
        </Drawer.Navigator>
      </Authentication>
    </NavigationContainer>
  );
};
