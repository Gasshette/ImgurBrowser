import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  IconButton,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Api } from '../api';
import { colors, fallbackImage, theme } from '../App';
import { AppState } from '../app-state';
import { ImgurImage } from '../models/image';
import { ImgurCard } from './imgur-card';
import * as _ from 'lodash';
import AutoHeightImage from 'react-native-auto-height-image';
import { Helper } from '../helper';
import { AppStateType } from '../types/appstate-type';
import { Header } from './header';

export const Post = ({
  isUserOwnContent,
  navigation,
}: {
  isUserOwnContent: boolean;
  navigation: any;
}) => {
  const subject = new Subject();

  const api = Api.getInstance();
  const appState = AppState.getInstance();
  const helper = new Helper();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [posts, setPosts] = React.useState<Array<ImgurImage> | null>(null);
  const [modal, setModal] = React.useState<{
    isVisible: boolean;
    image: ImgurImage | null;
  }>({ isVisible: false, image: null });

  let appStateSubscription: Subscription;
  let routeSubscription: Subscription;

  React.useEffect(() => {
    if (!appStateSubscription) {
      appStateSubscription = appState.state
        .pipe(takeUntil(subject))
        .subscribe((state: AppStateType) => {
          if (state !== undefined && state.posts !== undefined) {
            setPosts(state.posts);
            setIsLoading(false);
          }
        });
    }

    return () => {
      appStateSubscription = Subscription.EMPTY;
      subject.next();
      subject.complete();
    };
  }, []);

  // We need to handle the data loading with this handler rather than the
  // 'useRoute()' hook because the hook isn't updated (Dark magic, trick of the light, I don't know)
  React.useEffect(() => {
    routeSubscription = navigation.addListener('focus', (navData: any) => {
      setIsLoading(true);

      if (helper.testString(['gallery'], [navData.target])) {
        api.getGallery();
      } else if (helper.testString(['mycontent'], [navData.target])) {
        api.getMyContent();
      } else if (helper.testString(['favorites'], [navData.target])) {
        api.getFavorites();
      }
    });

    return () => {
      routeSubscription = Subscription.EMPTY;
    };
  }, [navigation]);

  const card = ({ item }: { item: ImgurImage }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setModal({ isVisible: true, image: item })}
    >
      <ImgurCard image={item} />
    </TouchableOpacity>
  );

  const style = StyleSheet.create({
    spacing: {
      padding: 15,
    },
    container: {
      width: Dimensions.get('window').width,
      flexDirection: 'column',
    },
    viewLoading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 100,
      backgroundColor: colors.accent,
    },
    imagePosition: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
  });

  if (isLoading)
    return (
      <View style={style.viewLoading}>
        <ActivityIndicator animating={true} color={colors.primary} />
      </View>
    );

  return (
    <>
      {modal.isVisible && (
        <Portal>
          <Modal
            visible={modal.isVisible}
            onDismiss={() => setModal({ isVisible: false, image: null })}
            contentContainerStyle={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: colors.accent,
              width: '100%',
              height: '100%',
              alignSelf: 'center',
            }}
          >
            <Header
              navigation={navigation}
              isModal={true}
              setModal={setModal}
            />
            <ScrollView>
              <Text style={[style.spacing, {fontSize: 24}]}>{modal.image?.title}</Text>
              {modal.image?.images.map((img) => (
                <View
                  key={Math.floor(Math.random() * 9999)}
                  style={[style.imagePosition, style.spacing]}
                >
                  {/* calcul de la width trouvé au pif hein, j'suis pas mathématicien moi ! */}
                  <AutoHeightImage
                    width={Dimensions.get('window').width - 30}
                    source={{ uri: img.link }}
                    fallbackSource={{ uri: fallbackImage }}
                  />
                  <Text
                    theme={theme}
                    style={{ padding: 15, textAlign: 'justify' }}
                  >
                    {img.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </Modal>
        </Portal>
      )}

      {!posts?.length && (
        <Text style={{ color: colors.white }}>
          There is nothing to show. Swipe right to open the menu and upload some
          content !
        </Text>
      )}

      <FlatList
        data={posts}
        renderItem={card}
        keyExtractor={(item) => item.id}
      />

      {/* <View style={style.container}></View> */}
    </>
  );
};
