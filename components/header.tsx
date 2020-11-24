import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';
import { Api } from '../api';
import { colors, globalStyle } from '../App';
import { AppState } from '../app-state';
import { Helper } from '../helper';
import { Filters } from './filters';

type HeaderProps = {
  navigation?: any;
  title?: string;
  isModal?: boolean;
  setModal?: any;
};
export const Header = (props: HeaderProps) => {
  const api = Api.getInstance();
  const helper = new Helper();

  // Exception is thrown fromuseRoute() hook if header isn't a direct child of our navigator (AppWrapper)
  let route = !props.isModal ? useRoute() : null;

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const syncImages = () => {
    if (route) {
      api.reloadData(route.name);
    }
  };

  const closeModal = () => setIsModalVisible(false);

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
    modalContent: {
      flexShrink: 1,
      flexDirection: 'column',
      backgroundColor: colors.accent,
      width: '80%',
      padding: 15,
      alignSelf: 'center',
    },
  });

  return (
    <>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={globalStyle.modal}
        >
          <Filters closeModal={closeModal} />
        </Modal>
      </Portal>

      <View style={[style.wrapper, style.blockLayout]}>
        {!props.isModal ? (
          <>
            <View style={style.blockLayout}>
              {/* <Image
                source={require('../assets/imgurLogo.png')}
                style={style.img}
              /> */}
              <Text style={style.title}>{props.title}</Text>
            </View>
            <View style={style.blockLayout}>
              {!helper.testString([route?.name], ['upload']) && (
                <>
                  <IconButton
                    icon='refresh'
                    color={colors.primary}
                    style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                    size={24}
                    onPress={syncImages}
                  />
                  <IconButton
                    icon='filter'
                    color={colors.primary}
                    style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                    size={24}
                    onPress={() => setIsModalVisible(true)}
                  />
                </>
              )}
              <IconButton
                icon='menu'
                color={colors.primary}
                style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                size={24}
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
              size={24}
              onPress={() => props.setModal({ isVisible: false, image: null })}
            ></IconButton>
          </View>
        )}
      </View>
    </>
  );
};
