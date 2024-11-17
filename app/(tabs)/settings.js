import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Tab() {
  const navigation = useNavigation();
  const logout = async () => {
    // Clear the AsyncStorage
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem("token");

    // Navigate to the login screen
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
