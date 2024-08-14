import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PhotoPlaceholder from "./PhotoPlaceholder";

const PlantDetails = ({ route }) => {
  const { plant } = route.params;
  const navigation = useNavigation();

  const deletePlant = async () => {
    const storedPlants = await AsyncStorage.getItem("plants");
    const plants = JSON.parse(storedPlants);
    const updatedPlants = plants.filter((p) => p.id !== plant.id);
    await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
    navigation.goBack();
  };

  console.log("Plant Details Image URI:", plant.photo);

  return (
    <View style={styles.container}>
      {plant.photo ? (
        <Image source={{ uri: plant.photo }} style={styles.photo} />
      ) : (
        <PhotoPlaceholder />
      )}

      <Text style={styles.plantText}>Name: {plant.name}</Text>
      <Text>Watering Frequency: Every {plant.wateringFrequency} day</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditPlant", { plant })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={deletePlant}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#dbffe1",
    alignItems: "center",
    justifyContent: "center",
  },
  plantText: {
    color: "darkgreen",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  photo: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#4CAF50",
    textAlign: "center",
    fontSize: 18,
  },
});

export default PlantDetails;
