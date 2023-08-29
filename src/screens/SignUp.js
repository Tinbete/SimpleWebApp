import { View, Text, Button, TextInput, StyleSheet, ImageBackground } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ImagesAssets } from '../assets/ImageAssets';



const SignUp = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const navigation = useNavigation();

  const handleSignUp = () => {
    try {
      const { email, password } = state;
      if(email === '' || password === '') return;

      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredentials) => {
          navigation.navigate("Login");
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
    source={ImagesAssets.bannerList1}
    style={styles.backgroundImage}
  >
  
      <View style={styles.container}>
        <Text style={styles.h1}>REGISTER</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          inputMode="email"
          onChangeText={(value) =>
            setState((prev) => ({ ...prev, email: value }))
          }
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter Password"
          onChangeText={(value) =>
            setState((prev) => ({ ...prev, password: value }))
          }
        />

        
      <View style={styles.buttonContainer}>
      <View style={styles.buttonsWrapper}>  

          <View style={styles.button}>
              <Button title="Sign Up" onPress={handleSignUp}  color = "black" style={styles.buttonStyle} />
          </View>
  
          <View style={styles.button}>
              <Button title="Log In" onPress={handleLogin}  color = "black"  style={styles.buttonStyle} />
          </View>
            
       </View>
       </View>       
        
     </View>
    </ImageBackground>
  );
};

export default SignUp;


const styles = StyleSheet.create({

  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "50%",
    padding: 12,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: "white",
    color: "#f7dcf6",
  },
   
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },

  buttonsWrapper: {
    flexDirection: 'row',
    width: '50%',
  },

  button: {
    flex: 1,
    marginHorizontal: 5,

  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "baskerville",
  },

  signUpText: {
    fontSize: 16,
    color: "#3498db",
    color: "white",
  },
});