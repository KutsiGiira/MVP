import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
export default function Admin() {
  return (
    <View style={styles.v}>
      <Text style={styles.text}>Welcome to Admin Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  v: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
  }
});