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
import { useNavigation } from "@react-navigation/native";

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://fastapifridgeelf-production.up.railway.app/auth/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("Response:", result);
      setIsLoading(false);

      if (response.ok) {
        Alert.alert("Registration Successful", "Welcome! You can now log in.");
        navigation.navigate("login");
      } else {
        Alert.alert(
          "Registration Failed",
          result.detail || "An error occurred."
        );
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Network Error", "Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      {/* Username */}
      <Controller
        control={control}
        name="username"
        rules={{ required: "Username is required" }}
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

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Email is not valid",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Email"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
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

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirm Password is required",
          validate: (value) => value === password || "Passwords do not match",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.errorInput,
              ]}
              placeholder="Confirm Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </>
        )}
      />

      {/* Submit Button */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Register" onPress={handleSubmit(onSubmit)} />
      )}

      {/* Link to Login Page */}
      <TouchableOpacity onPress={() => navigation.navigate("login")}>
      <Text style={styles.text}> Already have an account? <Text style={styles.link}>Login here</Text></Text>

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

  text: {
    color: "black",
    textAlign: "center",
    marginTop: 3,
  },

});
