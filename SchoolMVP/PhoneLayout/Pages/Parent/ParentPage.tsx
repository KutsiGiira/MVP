import React from "react";
import {View, Text, StyleSheet} from 'react-native'

export default function ParentPage(){
    return(
        <View style={stil.holder}>
            <Text>Parent Page</Text>
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