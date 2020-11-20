import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Modal, Text } from 'react-native-paper';
import { Api } from '../api';
import { colors, fallbackImage } from '../App';
import { ImgurImage } from '../models/image';
import * as _ from 'lodash';
import { Helper } from '../helper';
import { AppState } from '../app-state';

export const ImgurCard = ({ image }: { image: ImgurImage }) => {
  const api = Api.getInstance();
  const appState = AppState.getInstance();
  const helper = new Helper();
  const route = useRoute();

  const [isFav, setIsFav] = React.useState(image.favorite);
  const [cover, setCover] = React.useState<ImgurImage>();

  React.useEffect(() => {
    // get the cover that must be shown on the card (see api getPosts where we get all images from an album)
    // Added few typing (eg: 'as string') to remove typescript error, he's too dumb to know my object are correct
    if (image.images) {
      const imageForCover = image.images.filter((x) =>
        helper.testString([image.cover], [x.link as string])
      )[0];

      setCover(imageForCover as ImgurImage);
    } else {
      setCover({link: fallbackImage} as ImgurImage);
    }
    setIsFav(isFav);
  }, []);

  const changeFav = () => {
    api
      .toggleFavorite(image.id)
      .then((response) => {
        setIsFav(!isFav);
        return response.json();
      })
      .catch(error => {
        console.error('Something went wrong while toggling favorite :( - ', error);
        appState.setAppState({
          snackbar: {
            isVisible: true,
            color: colors.warn,
            message: 'Something went wrong while toggling favorite :('
          }
        })
      });
  };

  const getIcon = () => (isFav ? 'heart' : 'heart-outline');

  const getActions = () => {
    // we can't fav our own images
    if(!helper.testString(['mycontent'], [route.name])){
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
      {image.title && (
        <Card.Title title={_.truncate(image.title, { length: 40 })} />
      )}
      <Card.Cover source={{ uri: cover?.link }} />
      <Card.Content>
        {image.description && (
          <Text style={{ paddingVertical: 15 }}>
            {_.truncate(image.description, { length: 50 })}
          </Text>
        )}
      </Card.Content>
      {getActions()}
    </Card>
  );
};
