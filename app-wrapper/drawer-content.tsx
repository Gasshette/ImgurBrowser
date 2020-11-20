import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-paper';
import { colors } from '../App';

export const DrawerContent = (props: any) => {
  const [activeLink, setActiveLink] = React.useState(0);

  const goTo = (pageName: string, activeIndex: number) => {
    setActiveLink(activeIndex);
    props.navigation.navigate(pageName);
  };

  const pages = [
    {
      route: 'MyContent',
      label: 'My content',
      icon: 'cloud',
    },
    {
      route: 'Favorites',
      label: 'Favorites',
      icon: 'star',
    },
    {
      route: 'Gallery',
      label: 'Gallery',
      icon: 'home',
    },
    {
      route: 'Upload',
      label: 'Upload',
      icon: 'upload',
    },
  ];

  const style = StyleSheet.create({
    item: {
      backgroundColor: colors.surface,
    },
    activeItem: {
      backgroundColor: colors.primary,
      color: colors.accent,
    },
  });

  const getLinks = ({ item, index }: { item: any; index: number }) => (
    <Drawer.Item
      icon={item.icon}
      label={item.label}
      style={activeLink === index ? style.activeItem : style.item}
      onPress={() => goTo(item.route, index)}
    />
  );

  return (
    <DrawerContentScrollView style={{ backgroundColor: colors.accent }}>
      <FlatList
        data={pages}
        keyExtractor={(data) => data.route}
        renderItem={getLinks}
      />
    </DrawerContentScrollView>
  );
};
