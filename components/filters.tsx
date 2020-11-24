import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Subject } from 'rxjs';
import { globalStyle } from '../App';
import { AppState } from '../app-state';
import { Helper } from '../helper';
import { ImgurImage } from '../models/image';
import { FiltersType } from '../types/filters-type';

export const Filters = ({ closeModal }: { closeModal: () => void }) => {
  const helper = new Helper();
  const appState = AppState.getInstance();

  const { control, handleSubmit } = useForm<FiltersType>({
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = (data: FiltersType) => {
    appState.setAppState({
      posts: appState.state.value.posts?.filter(
        (p: ImgurImage) =>
          helper.testString([data.description], [p.description]) ||
          helper.testString([data.description], [p.title])
      ),
    });
    closeModal();
  };

  const style = StyleSheet.create({
    spacing: {
      marginVertical: 10,
      marginTop: 0,
    },
    button: {
      width: Dimensions.get('window').width * 0.45,
    }
  });

  return (
    <>
      <Text style={globalStyle.modalTitle}>
        Filter the current displayed posts
      </Text>
      <Controller
        control={control}
        name='description'
        defaultValue=''
        render={({ onBlur, onChange, value }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            mode='flat'
            style={style.spacing}
            label='Filter by description'
          />
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={globalStyle.modalButtonSolo}
      >
        <Button mode='contained' icon='filter-outline'>
          Filter
        </Button>
      </TouchableOpacity>
    </>
  );
};
