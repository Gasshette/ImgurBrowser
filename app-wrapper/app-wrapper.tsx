import React from 'react';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from '../components/home';
import { Upload } from '../components/upload';
import { Favorite } from '../components/favorite';
import { Header } from '../components/header';
import { colors } from '../App';
import { ScrollView } from 'react-native';
import {DrawerContent } from './drawer-content';

const Drawer = createDrawerNavigator();

export const AppWrapper = () => {
  // litle trick to share the header with all thecomponent without having toimplement an inner tab navigation
  const getComponent = (Component: any) => (
    <ScrollView style={{backgroundColor: colors.accent, minHeight: '100%'}}>
      <Header />
      <Component />
    </ScrollView>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Home' drawerContent={props => (<DrawerContent {...props} />)}>
        <Drawer.Screen name='Home' >{() => getComponent(Home)}</Drawer.Screen>
        <Drawer.Screen name='Upload'>{() => getComponent(Upload)}</Drawer.Screen>
        <Drawer.Screen name='Favorites'>{() => getComponent(Favorite)}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
