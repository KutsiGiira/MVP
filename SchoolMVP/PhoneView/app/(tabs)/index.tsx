import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Login/Login';
import Admin from '../Screens/Admin/Admin';
import Teacher from '../Screens/Teacher/Teacher';
import Parent from '../Screens/Parent/Parent';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="AdminPage" component={Admin} />
          <Stack.Screen name="ParentPage" component={Parent} />
          <Stack.Screen name="TeacherPage" component={Teacher} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}