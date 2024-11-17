import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import CheckBox from "react-native-check-box";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [areas, setAreas] = useState([]);
  const [items, setItems] = useState([]);
  const [areaId, setAreaId] = useState(1);

  const fetchAreas = async () => {
    try {
      const response = await fetch(
        "https://fastapifridgeelf-production.up.railway.app/areas/"
      );
      const result = await response.json();
      setAreas(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchItems(areaId);
  }, [areaId]); // Fetch items when areaId changes

  const addItem = () => {};

  const fetchItems = async (areaId) => {
    const token = await AsyncStorage.getItem("token");
    console.log("Token:", token);
    try {
      const response = await fetch(
        `https://fastapifridgeelf-production.up.railway.app/areas/${areaId}/items`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log(result);
      // Ensure `result` is an array of categories
      if (Array.isArray(result)) {
        setItems(result);
      } else {
        setItems([]); // Default to an empty array if the data is invalid
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheck = (blockId, itemId) => {
    setItems((prevItems) =>
      prevItems.map((block) =>
        block.id === blockId
          ? {
              ...block,
              items: block.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : block
      )
    );
  };

  const handleTrash = () => {
    Alert.alert("Confirm", "Are you sure you want to delete selected items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setItems((prevItems) =>
            prevItems.map((block) => ({
              ...block,
              items: block.items.filter((item) => !item.checked),
            }))
          );
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Clickable Buttons */}
      <View style={styles.buttonContainer}>
        {areas.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={area.id == 1 ? styles.fridgeButton : styles.freezerButton}
            onPress={() => setAreaId(area.id)}
          >
            <Text style={styles.buttonText}>{area.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => addItem()}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Blocks */}
      {items.map((category) => (
        <View key={category.id} style={styles.block}>
          <Text style={styles.blockTitle}>{category.name}</Text>
          <FlatList
            data={category.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <CheckBox
                  isChecked={item.checked}
                  onClick={() => handleCheck(category.id, item.id)}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemText}>
                    {item.name} - {item.quantity} pcs - Expires:{" "}
                    {item.expire_date}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      ))}

      {/* Trash Button */}
      <TouchableOpacity style={styles.trashButton} onPress={handleTrash}>
        <Text style={styles.trashButtonText}>Trash</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  fridgeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  freezerButton: {
    backgroundColor: "#17a2b8",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  block: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemDetails: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 16,
  },
  trashButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  trashButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
