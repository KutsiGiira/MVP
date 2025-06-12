import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';import {jwtDecode} from 'jwt-decode';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AdminPage from "./Admin/AdminPage";
import ParentPage from "./Parent/ParentPage";
import TeacherPage from "./Teacher/TeacherPage";
import { StatusBar } from "expo-status-bar";
  interface JwtPayload {
    roles: string[];
    sub: string;
    iat: number;
    exp: number;
  }
  export default function Login(){
      const [username, setUsername] = useState<string>('');
      const [password, setPassword] = useState<string>('');
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const navigation = useNavigation<any>();
    function decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded;
    } catch (error) {
      console.log('Failed to decode JWT:', error);
      return null;
    }
  }
      async function HandleSubmit(){
        try{
        const res = await fetch('http://192.168.1.3:8080/login', {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          });
        if (res.ok) {
          const token = await res.text();
          console.log('Received token:', token);
          await AsyncStorage.setItem('@jwt_token', token);
          const payload = decodeToken(token);

            if (payload) {
              console.log('User roles:', payload.roles);
              console.log('Subject (user):', payload.sub);
              if(payload.roles.includes("ADMIN")){
                navigation.navigate('AdminPage'  as never);
              }
              else if(payload.roles.includes("PARENT")){
                navigation.navigate('ParentPage' as never);
              }
              else if(payload.roles.includes("TEACHER")){
                navigation.navigate('TeacherPage'  as never);
              }
              else{
                console.log("makaynch")
              }
          } 
      }
        else if (res.status === 401) {
            setError('Invalid credentials');
          } 
          else {
            setError('Something went wrong');
          }
    } catch (err) {
      console.log('madaztch', err);
      }
              if(!username|| !password){
          setError('Veuillez remplir tous les champs')
        }
}

    return(
      <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3D0075', '#00CFFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>BONJOUR ET BIENVENUE</Text>
        <Text style={styles.subtitle}>
          Accédez facilement à vos emplois du temps, examens, absences, notifications et à toutes les informations essentielles de la vie scolaire.
        </Text>
      </LinearGradient>

      {/* Login Section */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>CONNEXION UTILISATEUR</Text>

        {/* Username */}
        <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
          <FontAwesome name="user" size={20} color={error ? 'red' : '#fff'} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="#eee"
            value={username}
            onChangeText={(text: string) => {
              setUsername(text);
              setError(null);
            }}
          />
        </View>
        
        {/* Password */}
        <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
          <FontAwesome name="lock" size={20} color={error ? 'red' : '#fff'} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#eee"
            secureTextEntry
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setError(null);
            }}
          />
        </View>

        {/* Error Message */}
        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="#3D0075" />}

        {/* Button */}
        <TouchableOpacity onPress={HandleSubmit} style={styles.buttonWrapper} disabled={loading}>
          <LinearGradient
            colors={['#3D0075', '#00CFFF']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>SE CONNECTER</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
    );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1,
     backgroundColor: '#fff'
     },
  header: { paddingTop: 100, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 26, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#f0f0f0', textAlign: 'center', maxWidth: 300 },
  loginContainer: { marginTop: 40, paddingHorizontal: 30 },
  loginTitle: { fontSize: 18, fontWeight: '500', textAlign: 'center', marginBottom: 20, color: '#444' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c6d5e4',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  icon: { marginRight: 10 },
  inputError: { borderWidth: 1.5, borderColor: 'red' },
  errorText: { color: 'red', fontSize: 13, position: 'relative', left: '15%'},
  buttonWrapper: { alignItems: 'center', marginTop: 10 },
  button: { width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
});