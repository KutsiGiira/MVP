import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import Login from './Pages/Login';

export default function App() {
  return (
    <View style={styles.view}>
      <Login></Login>
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,         
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})