import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const PhotoPlaceholder = () => {
  return (
    <View style={styles.placeholder}>
      <Icon name="camera" size={50} color="white" />
      <Text style={styles.placeholderText}>No Image</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    width: 200,
    height: 200,
    backgroundColor: "green",
    opacity: 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
});

export default PhotoPlaceholder;
