import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Post } from '../components/post';
import { Upload } from '../components/upload';
import { Favorite } from '../components/favorite';
import { Header } from '../components/header';
import { Error } from '../components/error';
import { colors } from '../App';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DrawerContent } from './drawer-content';
import { Authentication } from './authentication';

const Drawer = createDrawerNavigator();

export const AppWrapper = (props: any) => {
  // litle trick to share the header with all thecomponent without having toimplement an inner tab navigation
  const getComponent = (Component: any, title: string, navigation: any) => (
    <ScrollView style={{ backgroundColor: colors.accent, minHeight: '100%' }}>
      <View style={style.shadow}>
        <Header title={title} navigation={navigation} />
      </View>
      <View style={{padding: 15}}>
        <Component />
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
    }
  })

  return (
    <NavigationContainer>
      <Authentication>
        <Drawer.Navigator
          initialRouteName='Posts'
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name='Posts'>
            {({navigation}) => getComponent(Post, 'Posts', navigation)}
          </Drawer.Screen>
          <Drawer.Screen name='Upload'>
            {({navigation}) => getComponent(Upload, 'Upload', navigation)}
          </Drawer.Screen>
          <Drawer.Screen name='Favorites'>
            {({navigation}) => getComponent(Favorite, 'Favorites', navigation)}
          </Drawer.Screen>
          <Drawer.Screen name='Error' component={Error} />
        </Drawer.Navigator>
      </Authentication>
    </NavigationContainer>
  );
};
