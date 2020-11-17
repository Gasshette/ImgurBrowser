import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Api } from '../api';
import { colors } from '../App';
import { AppState, AppStateType } from '../app-state';
import { Helper } from '../helper';
import { ImgurImage } from '../models/image';
import { Error } from './error';
import { ImgurCard } from './imgur-card';

class ContentType {
  posts: Array<ImgurImage> | undefined;
  favorites: Array<ImgurImage> | undefined;
}

export const ContentLayout = () => {
  const unsubscriber = new Subject();
  const helper = new Helper();

  let route = useRoute();
  const api = Api.getInstance();
  const appState = AppState.getInstance();

  const [content, setcontent] = React.useState<ContentType>({
    posts: [],
    favorites: [],
  });
  const [stateKey, setStateKey] = React.useState<'favorites' | 'posts'>('posts');

  // Possibles url for this component (must be a keys from AppStateType. Create another one if there's a newkey in AppStateType that match a route)
  const FAVORITES = 'favorites';
  const POSTS = 'posts';

  let isFavorites = false;

  const getPromise = () => {
    if (isFavorites) {
      return api.getFavorites();
    }

    return api.getPosts();
  };

  // Use route to define if we are in favorites page or in posts page
  const setParams = () => {
    isFavorites = helper.testString(route.name.toLowerCase(), [FAVORITES]);
    setStateKey(isFavorites ? 'favorites' : 'posts');
  }

  React.useEffect(() => {
    setParams();

    appState.state
      .pipe(takeUntil(unsubscriber))
      .subscribe((state: AppStateType) => {
        console.log('content = ', content);

        // If we don't have data yet, we get it, else we jsut update our images state to refresh the view
        if (!state[stateKey]) {
          getPromise()
            .then((res: Response) => res.json())
            .then((json: { data: Array<ImgurImage> }) => {
              console.log('[if]set appState with stateKey = ', stateKey);
              appState.setAppState({
                [stateKey]: json.data,
              });
            })
            .catch((error) => console.log('Error while retrieving data'));
        } else {
              console.log('[else]set content with stateKey = ', stateKey);
              setcontent({
            ...content,
            [stateKey]: appState.state.value[stateKey],
          });
        }
      });

    return unsubscriber.unsubscribe();
  }, []);

  React.useEffect(() => {
    console.log('[useEffectContent]content = ', content);
  }, [content]);

  React.useEffect(() => {
    console.log('route changed, updating stateKey');
    setParams();

  }, [route]);

  const getCards = () => {
    console.log('[getCard] stateKey = ', stateKey);
    if (!content[stateKey]?.length) {
      return (
        <Text style={{ color: colors.white }}>
          There is nothing to show. Swipe right to open the menu and upload some
          content !
        </Text>
      );
    }

    return content[stateKey]?.map((image: ImgurImage) => (
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
};
