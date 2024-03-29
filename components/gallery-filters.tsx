import React from 'react';
import { Button, Menu, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Api } from '../api';
import { colors } from '../App';
import { AppState } from '../app-state';
import { AppStateType } from '../types/appstate-type';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { GalleryFiltersType } from '../types/gallery-filters-type';

export const GalleryFilters = () => {
  const api = Api.getInstance();
  const appState = AppState.getInstance();

  const defaultMenuButtonValue = 'File type';

  const { control, handleSubmit, reset } = useForm<GalleryFiltersType>({
    defaultValues: {
      all: '',
      tags: '',
      type: '',
    },
  });

  const [type, setType] = React.useState<string>();
  const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false);
  const [menuButtonValue, setMenuButtonValue] = React.useState(
    defaultMenuButtonValue
  );

  const selectMenuItem = (value: string) => {
    setIsMenuVisible(false);

    if (value !== '') {
      setMenuButtonValue(`Selected type: ${value}`);
      setType(value);
    } else {
      setMenuButtonValue(defaultMenuButtonValue);
      setType('');
    }
  };

  const onSubmit = (data: GalleryFiltersType) => {
    // update filters in state and trigger api.getGallery()
    data.type = type;
    appState.setAppState({ galleryFilters: data });
  };

  const resetFilters = () => {
    reset(undefined);
    setMenuButtonValue(defaultMenuButtonValue);
  };

  React.useEffect(() => {
    // when the state is updated, trigger api call and reset the form
    let subscription = appState.state.subscribe((state: AppStateType) => {
      // This prevent sending a request without filters, this is the purpose of the gallery (Would be way better with a default filtering with newest, first page etc.. but time's up soon !)
      if (state.galleryFilters !== undefined) {
        api.getGallery();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const style = StyleSheet.create({
    spacing: {
      marginVertical: 10,
      marginTop: 0,
    },
    button: {
      width: Dimensions.get('window').width * 0.45,
    },
    buttonDisplay: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 25,
    },
    typesMenu: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <>
      <Controller
        control={control}
        name='all'
        defaultValue=''
        render={({ onBlur, onChange, value }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}

            value={value}
            mode='flat'
            style={style.spacing}
            label='Search for all these words (and)'
          />
        )}
      />

      <Controller
        control={control}
        name='tags'
        defaultValue=''
        render={({ onBlur, onChange, value }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            mode='flat'
            style={style.spacing}
            label='Comma delimited list of tags'

          />
        )}
      />
      <Menu
        contentStyle={style.typesMenu}
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={
          <Button
            style={{ width: '100%' }}
            mode='contained'
            color={colors.surface}
            onPress={() => setIsMenuVisible(true)}
          >
            {menuButtonValue}
          </Button>
        }
      >
        <Menu.Item onPress={() => selectMenuItem('')} title='--' />
        <Menu.Item onPress={() => selectMenuItem('JPG')} title='.jpg' />
        <Menu.Item onPress={() => selectMenuItem('PNG')} title='.png' />
      </Menu>

      <View style={style.spacing}>
        <View style={style.buttonDisplay}>
          <TouchableOpacity onPress={resetFilters}>
            <Button
              mode='contained'
              color={colors.warn}
              icon='cancel'
              style={style.button}
            >
              Reset
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Button
              mode='contained'
              icon='filter-outline'
              style={
                [
                  style.spacing,
                  style.button,
                  { color: colors.surface },
                ] as ViewStyle
              }
            >
              Filter
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
