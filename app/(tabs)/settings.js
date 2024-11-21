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
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
         <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAE3D9",
  },
  button: {
    backgroundColor: "#61C0BF",
    paddingVertical: 10,
    width: 150,
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
