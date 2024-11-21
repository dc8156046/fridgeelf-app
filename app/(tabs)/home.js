import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function Home() {
  const [areas, setAreas] = useState([]);
  const [items, setItems] = useState([]);
  const [areaId, setAreaId] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [expireDate, setExpireDate] = useState(new Date());
  const [category, setCategory] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categories, setCategories] = useState([]);

  const addItem = async () => {
    // Add item logic here
    console.log("Item added:", newItemName, quantity, expireDate, category);
    if (!newItemName) {
      alert("Please enter item name");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    if (!quantity) {
      alert("Please enter a quantity");
      return;
    }

    createItem({ newItemName, quantity, expireDate, category });
    // Close the modal
    setIsModalVisible(false);

    // Reset the form
    setNewItemName("");
    setQuantity("");
    setExpireDate(new Date());
    setCategory("");
  };

  const createItem = async ({
    newItemName,
    quantity,
    expireDate,
    category,
  }) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        `https://fastapifridgeelf-production.up.railway.app/items/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newItemName,
            quantity: quantity,
            expire_date: expireDate.toISOString(),
            category_id: category,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        fetchItems(areaId);
      } else {
        Alert.alert("Error", "Failed to add item");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expireDate;
    setShowDatePicker(false);
    setExpireDate(currentDate);
  };

  // Fetch areas from the API
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
    fetchCategories(areaId);
  }, [areaId]); // Fetch items when areaId changes

  // Fetch items from the API
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

  // Fetch categories from the API
  const fetchCategories = async (areaId) => {
    try {
      const response = await fetch(
        `https://fastapifridgeelf-production.up.railway.app/areas/${areaId}/categories`
      );
      const result = await response.json();
      if (Array.isArray(result)) {
        setCategories(result);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (blockId, itemId) => {
    //alert(`Block ID: ${blockId}, Item ID: ${itemId}`);
    Alert.alert("Confirm", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteItem(itemId);
        },
      },
    ]);
  };

  const deleteItem = async (itemId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        `https://fastapifridgeelf-production.up.railway.app/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchItems(areaId);
      } else {
        Alert.alert("Error", "Failed to delete item");
      }
    } catch (error) {
      console.error(error);
    }
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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>

            {/* Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter item name"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            {/* Quantity Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            {/* Expire Date Picker */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {expireDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={expireDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Area Picker */}
            <Picker
              selectedValue={areaId}
              style={styles.picker}
              onValueChange={(itemValue) => setAreaId(itemValue)} // Updating area
            >
              <Picker.Item label="Select Area" value="" />
              {areas.map((area, index) => (
                <Picker.Item key={index} label={area.name} value={area.id} />
              ))}
            </Picker>

            {/* Category Picker */}
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((cat, index) => (
                <Picker.Item key={index} label={cat.name} value={cat.id} />
              ))}
            </Picker>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button title="Add Item" onPress={addItem} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setIsModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Blocks */}
      {items.map((category) => (
        <View key={category.id} style={styles.block}>
          <Text style={styles.blockTitle}>{category.name}</Text>
          <FlatList
            data={category.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemText}>
                    {item.name} - {item.quantity} pcs
                  </Text>
                  <Text style={styles.itemText}>
                    Expire Date: {new Date(item.expire_date).toDateString()}
                  </Text>
                </View>
                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(category.id, item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#61C0BF",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    fridgeButton: {
      backgroundColor: "#FAE3D9",
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 5,
    },
    freezerButton: {
      backgroundColor: "#FFB6B9",
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 5,
    },
    addButton: {
      backgroundColor: "#D9D9D9",
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      marginLeft: 5,
    },
    addButtonText: {
      color: "#000000",
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
    deleteButton: {
      marginLeft: 10,
      backgroundColor: "#BBDED6",
      padding: 8,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButtonText: {
      color: "black",
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background
    },
    modalContent: {
      width: "80%",
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    input: {
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingLeft: 10,
    },
    datePickerButton: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: "#ddd",
      borderRadius: 5,
    },
    datePickerText: {
      fontSize: 16,
      color: "#333",
    },
    picker: {
      height: 150,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
    },
});
