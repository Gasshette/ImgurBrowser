import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

export const ImgurCard = ({
  imgUrl,
  title,
  subtitle,
}: {
  imgUrl: string;
  title: string;
  subtitle: string;
}) => {

  const style = StyleSheet.create({
    card: {
      margin: 5,
    }
  });
  return (
    <Card style={style.card}>
      <Card.Title title={title} subtitle={subtitle} />
      <Card.Cover source={{ uri: imgUrl }} />
      <Card.Actions>
        <Button>Favorite</Button>
      </Card.Actions>
    </Card>
  );
};
