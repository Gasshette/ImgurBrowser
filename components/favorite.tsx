import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Api } from '../api';
import { colors } from '../App';
import { AppState, AppStateType } from '../app-state';
import { ImgurImage } from '../models/image';
import { ImgurCard } from './imgur-card';

export const Favorite = () =>  {
  const subject = new Subject();

  const api = Api.getInstance();
  const appState = AppState.getInstance();

  const [favs, setFavs] = React.useState<Array<ImgurImage> | null>(null);

  React.useEffect(() => {
    // This condition on 'null' prevent an infinite loop
    if (!favs) {
      api.getFavorites();
    }

    appState.state.pipe(takeUntil(subject)).subscribe((state: AppStateType) => {
      if (state !== undefined && state.posts !== undefined) {
        setFavs(state.posts);
      }
    });

    return subject.unsubscribe();
  }, []);

  const getCards = () => {
    if (!favs?.length) {
      return (
        <Text style={{ color: colors.white }}>
          There is nothing to show. Swipe right to open the menu and upload some
          content !
        </Text>
      );
    }

    return favs?.map((image: ImgurImage) => (
      <ImgurCard key={image.id} image={image} />
    ));
  };

  const style = StyleSheet.create({
    container: {
      width: Dimensions.get('window').width,
      flexDirection: 'row',
    },
    column: {
      width: Dimensions.get('window').width,
    },
  });

  return (
    <ScrollView>
      <View style={style.container}>
        <View style={style.column}>{getCards()}</View>
      </View>
    </ScrollView>
  );
}
