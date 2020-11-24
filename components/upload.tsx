import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  StyleSheet,
  View,
  Platform,
  Image,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { colors } from '../App';
import ImagePicker, {
  ImagePickerOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Api } from '../api';
import { AppState } from '../app-state';
import {theme} from '../App';
import { AppStateType } from '../types/appstate-type';

/**
 * Had to do this for the gallery and camera to be properly opened :
 * https://github.com/react-native-image-picker/react-native-image-picker/issues/1233#issuecomment-719749514
 */
export const Upload = () => {
  const api = Api.getInstance();
  const appState = AppState.getInstance();

  const [image, setImage] = React.useState<ImagePickerResponse>();

  const options: ImagePickerOptions = {
    mediaType: 'photo',
    maxWidth: Dimensions.get('window').width,
    quality: 1,
    cameraType: 'back',
  };

  const openCamera = () => {
    ImagePicker.launchCamera({}, (response: ImagePickerResponse) => {
      if (response.uri) {
        setImage(response);
      }
    });
  };

  const openGallery = () => {
    ImagePicker.launchImageLibrary({}, (response: ImagePickerResponse) => {
      if (response.uri) {
        setImage(response);
      }
    });
  };

  const getImage = () => {
    const source = image?.uri
      ? { uri: image.uri }
      : require('../assets/splash.png');
    if (image?.uri) {
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          {/* AutoHeightImage does not work here, don't know why */}
          <Image
            style={{
              width: '100%',
              height: Dimensions.get('window').height/2,
              resizeMode: 'contain',
            }}
            source={source}
          />
        </View>
      );
    } else return <Text theme={theme}>Please select an image or take a picture</Text>;
  };

  const onSubmit = () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        name: image.fileName,
        type: image.type || '',
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', ''),
      });

      api.postImage(formData);
    } else {
      appState.setAppState({
        snackbar: {
          color: colors.warn,
          isVisible: true,
          message: 'You must have an image to upload'
        }
      })
    }
  };

  // Reset image after it was sent
  React.useEffect(() => {
    let subscription = appState.state.subscribe((state: AppStateType) =>{
      state && setImage(undefined);
    });

    return () => {
      setImage(undefined);
      return subscription.unsubscribe();
    }
  }, []);

  const style = StyleSheet.create({
    spacing: {
      marginVertical: 10,
      marginTop: 0,
    },
    fatAssButtonDisplay: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 25,
    },
    fatAssButton: {
      paddingVertical: 20,
    },
  });

  return (
    <View style={{ marginTop: 15 }}>
      <View style={style.spacing}>
        <View style={style.fatAssButtonDisplay}>
          <TouchableOpacity onPress={openGallery}>
            <Button
              mode='contained'
              color={colors.surface}
              style={style.fatAssButton}
              icon='camera-image'
            >
              Gallery
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={openCamera}>
            <Button
              mode='contained'
              color={colors.surface}
              style={style.fatAssButton}
              icon='camera-plus'
            >
              Camera
            </Button>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        mode={'contained'}
        style={style.spacing}
        onPress={() => onSubmit()}
      >
        Post it !
      </Button>
      {getImage()}
    </View>
  );
};
