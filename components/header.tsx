import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../App';

export const Header = () => {
  const route = useRoute();

  React.useEffect(() => {
    console.log('route = ', route);
  }, []);

  const style = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.accent,
      padding: 25,
      paddingLeft: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    img: {
      marginRight: 15,
    },
    title: {
      fontSize: 24,
    },
  });

  return (
    <>
      <View style={style.wrapper}>
        <Image source={require('../assets/imgurLogo.png')} style={style.img} />
        <Text style={style.title}>{route.name}</Text>
      </View>
    </>
  );
};
