import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CONFIG from "./config";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Encode form data with URLSearchParams
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Set the content type to application/x-www-form-urlencoded
        },
        body: formData.toString(), // Send the encoded form data as a string
      });

      const result = await response.json();
      setIsLoading(false);

      if (response.ok) {
        // Save the username, user_id, and token in AsyncStorage
        await AsyncStorage.setItem("username", data.username);
        await AsyncStorage.setItem("user_id", result.user_id.toString());
        await AsyncStorage.setItem("token", result.access_token);

        Alert.alert("Login Successful", "Welcome back!");
        console.log("Token:", result.access_token);
        // const token = await AsyncStorage.getItem("token");
        // console.log("Get Token:", token);
        // Navigate to another screen or perform further actions
        navigation.navigate("(tabs)");
      } else {
        Alert.alert("Login Failed", result.detail || "Invalid credentials.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Network Error", "Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      {/* Username */}
      <Controller
        control={control}
        name="username"
        rules={{
          required: "Username is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.username && styles.errorInput]}
              placeholder="Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        rules={{ required: "Password is required", minLength: 6 }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.password && (
              <Text style={styles.errorText}>
                {errors.password.message ||
                  "Password must be at least 6 characters"}
              </Text>
            )}
          </>
        )}
      />

      {/* Submit Button */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
           <Text style={styles.buttonText}>Login</Text>
       </TouchableOpacity>
      )}

      {/* Link to Register Page */}
      <TouchableOpacity onPress={() => navigation.navigate("register")}>
        <Text style={styles.link}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FAE3D9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  link: {
    color: "#007bff",
    marginTop: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#61C0BF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
