import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PhotoPlaceholder from "./PhotoPlaceholder";

export const scheduleNotification = async (plant) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to water ${plant.name}!`,
        body: `Water your plant every ${plant.wateringFrequency} days.`,
        data: { plantId: plant.id },
      },
      trigger: {
        seconds: plant.wateringFrequency * 24 * 60 * 60, // days to seconds converter
        // seconds: 10, // Trigger for testing
      },
    });
    console.log("Notification scheduled for:", plant.name);
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};

const AddPlant = () => {
  const [name, setName] = useState("");
  const [wateringFrequency, setWateringFrequency] = useState("");
  const [photoUri, setPhotoUri] = useState(null);

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
      setPhotoUri(uri);
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

  const addPlant = async () => {
    const newPlant = {
      photo: photoUri,
      id: Date.now().toString(),
      name,
      wateringFrequency: parseInt(wateringFrequency, 10),
    };
    const storedPlants = await AsyncStorage.getItem("plants");
    const plants = storedPlants ? JSON.parse(storedPlants) : [];
    plants.push(newPlant);
    await AsyncStorage.setItem("plants", JSON.stringify(plants));
    await scheduleNotification(newPlant);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <Text>Water every</Text>
        <TextInput
          style={styles.inputFieldNumber}
          placeholder="0"
          value={wateringFrequency}
          onChangeText={setWateringFrequency}
          keyboardType="numeric"
        />
        <Text>day</Text>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Image from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={addPlant}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  inputField: {
    backgroundColor: "white",
    padding: 8,
    marginBottom: 12,
    borderRadius: 8,
    width: 200,
    marginTop: 12,
  },
  inputFieldNumber: {
    backgroundColor: "white",
    padding: 8,
    marginBottom: 12,
    borderRadius: 8,
    marginTop: 12,
    width: 40,
    textAlign: "center",
    flex: "row",
  },
  image: {
    width: 240,
    height: 240,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 12,
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

export default AddPlant;
