import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { colors } from '../App';
import { Header } from './header';

export const Error = () => (
  <View style={{height: Dimensions.get("window").height, backgroundColor: colors.accent}}>
    <Header title="Error" />
    <Text style={{padding: 15, color: colors.white}}>
      An error occured during the authentication process :(
    </Text>
  </View>
);
