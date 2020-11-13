import { DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Drawer } from 'react-native-paper';
import { colors } from '../App';
import * as api from '../api'

export const DrawerContent = (props: any) => {
  const [activeLink, setActiveLink] = React.useState(0);

  const goTo = (pageName: string, activeIndex: number) => {
    setActiveLink(activeIndex);
    props.navigation.navigate(pageName);
  }

  const style = StyleSheet.create({
    item: {
      backgroundColor: colors.surface,
    },
    activeItem: {
      backgroundColor: colors.primary,
      color: colors.accent
    }
  });

  React.useEffect(() => {
    api.getTokens(() => props.navigation.navigate('Error'));
  }, []);

  return (
    <DrawerContentScrollView style={{backgroundColor: colors.accent}}>
      <Drawer.Section>
        <Drawer.Item
          icon='home'
          label='Home'
          style={activeLink === 0 ? style.activeItem : style.item}
          onPress={() => goTo('Home', 0)}
        />
        <Drawer.Item
          icon='upload'
          label='Upload'
          style={activeLink === 1 ? style.activeItem : style.item}
          onPress={() => goTo('Upload', 1)}
        />
        <Drawer.Item
          icon='star'
          label='Favorites'
          style={activeLink === 2 ? style.activeItem : style.item}
          onPress={() => goTo('Favorites', 2)}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};
