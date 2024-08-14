import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import PhotoPlaceholder from "./PhotoPlaceholder";

const EditPlant = ({ route }) => {
  const { plant } = route.params;
  const [name, setName] = useState(plant.name);
  const [wateringFrequency, setWateringFrequency] = useState(
    plant.wateringFrequency
  );
  const [photoUri, setPhotoUri] = useState(plant.photo || null);
  const navigation = useNavigation();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      saveImage(uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      saveImage(uri);
    }
  };

  const saveImage = async (imageUri) => {
    const fileName = imageUri.split("/").pop();
    const newPath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.moveAsync({
        from: imageUri,
        to: newPath,
      });
      setPhotoUri(newPath);
    } catch (error) {
      console.error("Error saving the image:", error);
    }
  };

  const editPlant = async () => {
    const storedPlants = await AsyncStorage.getItem("plants");
    const plants = JSON.parse(storedPlants);
    const updatedPlants = plants.map((p) =>
      p.id === plant.id ? { ...p, name, wateringFrequency, photo: photoUri } : p
    );
    await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} />
      ) : (
        <PhotoPlaceholder />
      )}
      <TextInput
        style={styles.inputField}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Watering Frequency (days)"
        value={wateringFrequency.toString()}
        onChangeText={setWateringFrequency}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image from Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={editPlant}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#dbffe1",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    backgroundColor: "white",
    padding: 8,
    marginBottom: 12,
    borderRadius: 8,
    width: 200,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
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

export default EditPlant;
