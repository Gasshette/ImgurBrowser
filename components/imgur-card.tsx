import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
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
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    // get the cover that must be shown on the card (see api getPosts where we get all images from an album)
    // Added few typing (eg: 'as string') to remove typescript error, he's too dumb to know my object are correct
    if (image.images) {
      const imageForCover = image.images.filter((x) =>
        helper.testString([image.cover], [x.link as string])
      )[0];

      setCover(imageForCover as ImgurImage);
    } else {
      setCover({ link: fallbackImage } as ImgurImage);
    }
    setIsFav(isFav);
  }, []);

  const deleteOwnImage = () => {
    api
      .deleteOwnContent(image.id)
      .then(() => {
        let newState = _.cloneDeep(appState.state.value.posts);
        newState = newState?.filter((p) => p.id !== image.id);
        appState.setAppState({ posts: newState });
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error(
          'Something went wrong while removing your image :( - ',
          error
        );
        appState.setAppState({
          snackbar: {
            isVisible: true,
            color: colors.warn,
            message: 'Something went wrong while toggling favorite :(',
          },
        });
      });
  };

  const changeFav = () => {
    api
      .toggleFavorite(image.id)
      .then((response) => {
        setIsFav(!isFav);
        return response.json();
      })
      .catch((error) => {
        console.error(
          'Something went wrong while toggling favorite :( - ',
          error
        );
        appState.setAppState({
          snackbar: {
            isVisible: true,
            color: colors.warn,
            message: 'Something went wrong while toggling favorite :(',
          },
        });
      });
  };

  const getIcon = () => (isFav ? 'heart' : 'heart-outline');

  const getActions = () => {
    if (helper.testString(['mycontent'], [route.name])) {
      return (
        <IconButton
          icon='delete'
          color={colors.primary}
          size={32}
          onPress={() => setIsModalVisible(true)}
        />
      );
    }

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
  };

  const style = StyleSheet.create({
    card: {
      margin: 5,
      padding: 0,
    },
    cardContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 15,
    },
    modalContent: {
      flex: 1,
      flexShrink: 1,
      flexDirection: 'column',
      backgroundColor: colors.accent,
      width: '80%',
      maxHeight: '30%',
      alignSelf: 'center',
    },
    modalButtonView: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      alignContent: 'space-around',
    }
  });

  return (
    <>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={style.modalContent}
        >
          <Text style={{ padding: 15, fontSize: 18 }}>
            Are you sure you want to delete your image ? this action is
            irreversible.
          </Text>
          <View
            style={style.modalButtonView}
          >
            <Button onPress={deleteOwnImage}>Confirm</Button>
            <Button onPress={() => setIsModalVisible(false)}>Cancel</Button>
          </View>
        </Modal>
      </Portal>

      <Card style={style.card}>
        {image.title && (
          <Card.Title title={_.truncate(image.title, { length: 40 })} />
        )}
        <Card.Cover source={{ uri: cover?.link }} />
        <Card.Content
          style={style.cardContent}
        >
          <Text style={{ paddingVertical: 15 }}>
            {image.description &&
              _.truncate(image.description, { length: 50, separator: ',' })}
          </Text>

          {getActions()}
        </Card.Content>
      </Card>
    </>
  );
};
