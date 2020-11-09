import React, { ComponentElement, ElementRef, JSXElementConstructor } from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from '../components/home';
import { Upload } from '../components/upload';
import { Favorite } from '../components/favorite';
import { Header } from '../components/header';

const Drawer = createDrawerNavigator();

export const AppWrapper = () => {
  // little Trick to share the header with all thecomponent without having toimplement an inner tab navigation
  const getComponent = (Component: any) => (
    <>
      <Header />
      <Component />
    </>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Home'>
        <Drawer.Screen name='Home'>{() => getComponent(Home)}</Drawer.Screen>
        <Drawer.Screen name='Upload'>{() => getComponent(Upload)}</Drawer.Screen>
        <Drawer.Screen name='Favorite'>{() => getComponent(Favorite)}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
