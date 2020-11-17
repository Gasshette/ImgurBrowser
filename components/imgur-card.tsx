import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import { Api } from '../api';
import { colors } from '../App';
import { ImgurImage } from '../models/image';

export const ImgurCard = ({ image }: { image: ImgurImage }) => {
  const api = Api.getInstance();
  const route = useRoute();

  const [isFav, setIsFav] = React.useState(image.favorite);

  React.useEffect(() => {
    setIsFav(isFav);
  }, []);

  const changeFav = () => {
    api
      .toggleFavorite(image.id)
      .then((response) => {
        setIsFav(!isFav);
        return response.json();
      })
      .then((json) => console.log('json = ', json))
      .catch((_) => console.log('something went wrong'));
  };

  const getIcon = () => (isFav ? 'heart' : 'heart-outline');
  const getActions = () => {
    if (route.name === 'Favorites') {
      return (
        <Card.Actions>
          <IconButton
            icon={getIcon()}
            color={colors.primary}
            size={32}
            onPress={changeFav}
          />
        </Card.Actions>
      );
    }
  };

  const style = StyleSheet.create({
    card: {
      margin: 5,
    },
  });

  return (
    <Card style={style.card}>
      <Card.Cover source={{ uri: image.link }} />
      {getActions()}
    </Card>
  );
};
