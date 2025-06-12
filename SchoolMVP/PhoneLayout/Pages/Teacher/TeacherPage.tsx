import React from "react";
import {View, Text, StyleSheet} from 'react-native'

export default function TeacherPage(){
    return(
        <View style={stil.holder}>
            <Text>Teacher Page</Text>
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