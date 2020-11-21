import { Route, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { Api } from '../api';
import { colors } from '../App';
import { AppState } from '../app-state';
import { ImgurImage } from '../models/image';

type HeaderProps = {
  navigation?: any;
  title?: string;
  isModal?: boolean;
  setModal?: any;
};
export const Header = (props: HeaderProps) => {
  const api = Api.getInstance();
  const appState = AppState.getInstance();

  // Exception is thrown fromuseRoute() hook if header isn't a direct child of our navigator (AppWrapper)
  let route = !props.isModal ? useRoute() : null;

  const syncImages = () => {
    if (route) {
      api.reloadData(route.name);
    }
  };

  const style = StyleSheet.create({
    blockLayout: {
      flexDirection: 'row',
    },
    wrapper: {
      backgroundColor: colors.surface,
      padding: 15,
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    img: {
      marginRight: 20,
      marginLeft: 15,
    },
    title: {
      fontSize: 24,
    },
  });

  return (
    <>
      <View style={[style.wrapper, style.blockLayout]}>
        {!props.isModal ? (
          <>
            <View style={style.blockLayout}>
              <Image
                source={require('../assets/imgurLogo.png')}
                style={style.img}
              />
              <Text style={style.title}>{props.title}</Text>
            </View>
            <View style={style.blockLayout}>
              <IconButton
                icon='refresh'
                color={colors.primary}
                style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                size={32}
                onPress={syncImages}
              />
              <IconButton
                icon='filter'
                color={colors.primary}
                style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                size={32}
                onPress={syncImages}
              />
              <IconButton
                icon='menu'
                color={colors.primary}
                style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                size={32}
                onPress={() => props.navigation.openDrawer()}
              />
            </View>
          </>
        ) : (
          <View>
            <IconButton
              icon='arrow-left'
              color={colors.primary}
              style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
              size={32}
              onPress={() => props.setModal({ isVisible: false, image: null })}
            ></IconButton>
          </View>
        )}
      </View>
    </>
  );
};
