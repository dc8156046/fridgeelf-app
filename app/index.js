import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomePage() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require("../assets/fridge_elf.png")} />
      <Text style={styles.title}>Welcome to Our Fridge Elf App</Text>
      <Text style={styles.subtitle}>Please login or register to continue</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("login")} // Navigate to Login page
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={() => navigation.navigate("register")} // Navigate to Register page
        />
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
  },
});
