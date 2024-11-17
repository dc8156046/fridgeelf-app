import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./app/login";
import RegisterPage from "./app/register";
import WelcomePage from "./app/index";
import HomePage from "./app/(home)/home";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: true, // Ensures the header is shown on all screens
          headerTitleAlign: "center", // Aligns title to center
          headerStyle: {
            backgroundColor: "#f8f9fa", // Customize header background color
          },
          headerTitleStyle: {
            fontWeight: "bold", // Title text styling
          },
          headerBackTitleVisible: false, // Hides "Back" text, shows only the arrow
        }}
      >
        <Stack.Screen
          name="WelcomePage"
          component={WelcomePage}
          options={{ headerShown: false, title: "Welcome" }}
        />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="RegisterPage"
          component={RegisterPage}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ title: "Home" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
