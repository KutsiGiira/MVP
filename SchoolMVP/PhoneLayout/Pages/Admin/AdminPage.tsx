import React from "react";
import {View, Text, StyleSheet, StatusBar} from 'react-native'

export default function AdminPage(){
    return(
        <View style={stil.holder}>
            <Text>Admin Page</Text>
        </View>
    )
}

const stil = StyleSheet.create({

  holder: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})