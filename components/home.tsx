import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { ImgurCard } from './imgur-card';

export const Home = () => {
  const containerWidth = Dimensions.get('window').width;

  const style = StyleSheet.create({
    container: {
      width: containerWidth,
      flexDirection: 'row',
    },
    column: {
      width: containerWidth / 2
    }
  });

  const getCards = () => {
    return [1, 1, 1, 1, 1, 1, 1, 1, 1].map( _ =>
      <ImgurCard
        key={Math.random()}
        imgUrl='https://picsum.photos/100/200'
        subtitle='Sous-titre'
        title='TITRE'
      />
    );
  };

  return (
    <>
      <ScrollView>
        <View style={style.container}>
          <View style={style.column}>{getCards()}</View>
          <View style={style.column}>{getCards()}</View>
        </View>
      </ScrollView>
    </>
  );
};
