import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { AppContext } from "../store";

import{ ImagesAssets } from '../assets/ImageAssets';



const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    errorMessage: "",
  });

  const { setUser } = useContext(AppContext);
  const navigation = useNavigation();

  const handleLogin = () => {
    try {
      const { email, password } = state;
      if (email === "" || password === "") return;
  
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          setUser(userCredentials.user);
          navigation.navigate("Main");
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            setState((prev) => ({
              ...prev,
              errorMessage: "Wrong password. Please try again.",
            }));
          } else {
            setState((prev) => ({
              ...prev,
              errorMessage: "An error occurred. Please try again.",
            }));
          }
        });
    } catch (e) {
      console.error(e);
    }
  };
  
  


  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password button clicked");
    const { email } = state;
    if (email === "") return;
    
    console.log("Sending password reset email...");

    try { 
      sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent successfully");
        // Optionally show a success message to the user
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        // Handle the error, e.g., show an error message to the user
      });

    } catch (error) {
      console.error("An error occurred:", error);
    }

  };

  return (
   
    <ImageBackground source={ImagesAssets.bannerList1} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.h1}>WELCOME</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
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

      {state.errorMessage !== "" && (
          <Text style={styles.errorMessage}>{state.errorMessage}</Text>
      )}
        
      <View style={styles.buttonContainer}>
      <View style={styles.buttonsWrapper}>  

      <View style={styles.button}>  
        <Button title="Log In" onPress={handleLogin} color = "black" style={styles.buttonStyle} />
      </View>
      <View style={styles.button}>
              <Button title="Sign Up" onPress={handleSignUp} color = "black" style={styles.buttonStyle} />
      </View>
            
       </View>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

      </View>
      </ImageBackground>
  );
};

export default Login;


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

  h1: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color:"white",
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

  signUpText: {
    fontSize: 16,
    color: "#3498db",
  },

  forgotPasswordText: {
    marginTop: 10,
    color: "white",
    textDecorationLine: "underline",
  },
});