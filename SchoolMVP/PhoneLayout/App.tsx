import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Pages/Login';
import AdminPage from './Pages/Admin/AdminPage';
import ParentPage from './Pages/Parent/ParentPage';
import TeacherPage from './Pages/Teacher/TeacherPage';

    export type RootStackParamList = {
      Login: undefined;
      AdminPage: undefined;
      ParentPage: undefined;
      TeacherPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <NavigationContainer>
            <StatusBar style="light"></StatusBar>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="ParentPage" component={ParentPage} />
        <Stack.Screen name="TeacherPage" component={TeacherPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}