import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,KeyboardAvoidingView,ActivityIndicator,Platform,} from "react-native";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
interface JwtPayload {
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  function decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded;
    } catch (error) {
      console.log("Failed to decode JWT:", error);
      return null;
    }
  }
  async function HandleSubmit() {
    try {
      const res = await fetch("http://192.168.1.3:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const token = await res.text();
        console.log("Received token:", token);
        await AsyncStorage.setItem("@jwt_token", token);
        const payload = decodeToken(token);

        if (payload) {
          console.log("User roles:", payload.roles);
          console.log("Subject (user):", payload.sub);
          if (payload.roles.includes("ADMIN")) {
            navigation.navigate("AdminPage" as never);
          } else if (payload.roles.includes("PARENT")) {
            navigation.navigate("ParentPage" as never);
          } else if (payload.roles.includes("TEACHER")) {
            navigation.navigate("TeacherPage" as never);
          } else {
            console.log("makaynch");
          }
        }
      } else if (res.status === 401) {
        setError("Nom d’utilisateur ou mot de passe incorrect. Veuillez réessayer.");
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      console.log("madaztch", err);
    }
  }
  const [fontsLoaded] = useFonts({
    'ultraLight': require('../assets/fonts/FiraSans-UltraLight.otf'),
    'light': require('../assets/fonts/FiraSans-Light.otf'),
    'medium': require('../assets/fonts/FiraSans-Medium.otf'),
    'book': require('../assets/fonts/FiraSans-Book.otf'),
    'semiBold': require('../assets/fonts/FiraSans-SemiBold.otf'),
  });
    if (!fontsLoaded) return null;
    //9ad baki icons w onhover dyal submit
  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
      <View style={styles.container}>
        {/* HEADER */}
        <LinearGradient style={styles.header} colors={['#3d176b', '#4392e1']}>
          <Text style={styles.BigTitle}>BONJOUR ET BIENVENUE</Text>
          <Text style={styles.SubTitle}>Accédez facilement à vos emplois du temps, examens, absences, notifications et à toutes les informations essentielles de la vie scolaire.</Text>
        </LinearGradient>
        {/* BODY */}
        
        <View style={styles.body}>
          <View style={styles.SubBody}>
            <Text style={styles.Title}>CONNEXION UTILISATEUR</Text>
            <TextInput style={[styles.Input, error && styles.inputError]} placeholder="Nom d'utilisateur" placeholderTextColor="white" value={username}
              onChangeText={(text: string) => {
              setUsername(text);
              setError(null);
            }}
            ></TextInput>
            <TextInput style={[styles.Input,error && styles.inputError]} placeholder="Mot de passe" placeholderTextColor="white" value={password}
              onChangeText={(text: string) => {
              setPassword(text);
              setError(null);
            }}
            >
            
            </TextInput>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.bottom}>
            <LinearGradient colors={['#3d176b', '#4392e1']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.buttonHolder}>
              <TouchableOpacity onPress={HandleSubmit} disabled={loading}>
                <Text style={styles.connectButton}>SE CONNECTER</Text>
              </TouchableOpacity>
            </LinearGradient>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  connectButton: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
  },
  buttonHolder: {
    width: '80%',
    borderRadius: 30,
  },
    container: {
      height: '100%'
    },
    header: {
      height: '35%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30
    },
  BigTitle: {
    fontSize: 28,
    fontFamily: "ultraLight",
    color: 'white',
  },
  SubTitle: {
    fontSize: 15,
    color: "white",
    fontFamily: "light",
    textAlign: "center",
    width: '90%'
  },
  body: {
    flex: 1,
    height: '65%',
    display: 'flex',
    alignItems: 'center',
    top: 70
  },
  SubBody:{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30
  },
    Title: {
    fontFamily: 'medium',
    color: '#58595b',
    fontSize: 20,
  },
  Input: {
    backgroundColor: '#c3d5e5',
    width: '80%',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontFamily: 'book',
    fontWeight: 'light',
    fontSize: 15,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 10,
    position: "relative",
  },
  bottom: {
    alignItems: "center",
    width: "100%",
  },
});