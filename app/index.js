import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomePage() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require("../assets/fridge_elf.png")} />
      <Text style={styles.title}>Welcome to Our Fridge Elf App</Text>
      <Text style={styles.subtitle}>Please login or register to continue</Text>

      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("register")}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FAE3D9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 10,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#61C0BF",
    paddingVertical: 10,
    width: 150,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
