import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../App';

export const Error = () => (
  <View>
    <Text style={{marginTop: 150, backgroundColor: colors.accent, color: colors.white}}>
      An error occured during the authentication process :(
    </Text>
  </View>
);
