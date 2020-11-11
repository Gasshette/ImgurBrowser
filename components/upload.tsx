import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export const Upload = () => {
  type FormData = {
    title: string;
    description: string;
  };

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('data = ', data);
  };

  const style = StyleSheet.create({
    spacing: {
      margin: 15,
      marginTop: 0,
    },
  });

  return (
    <View style={{ marginTop: 15 }}>
      <Controller
        control={control}
        name='title'
        render={({ onBlur, onChange, value }) => (
          <TextInput
            style={style.spacing}
            label='Title'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name='description'
        render={({ onBlur, onChange, value }) => (
          <TextInput
            style={style.spacing}
            label='Description'
            autoCapitalize='sentences'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Button
        mode={'contained'}
        style={style.spacing}
        onPress={handleSubmit(onSubmit)}
      >
        Post it !
      </Button>
    </View>
  );
};
