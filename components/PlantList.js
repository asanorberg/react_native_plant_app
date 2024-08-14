import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchPlants = async () => {
        const storedPlants = await AsyncStorage.getItem("plants");
        if (storedPlants) setPlants(JSON.parse(storedPlants));
      };

      fetchPlants();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Details", { plant: item })}
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Icon
        style={styles.plusIcon}
        title="Add Plant"
        name="plus"
        size={36}
        color="#9deaab"
        onPress={() => navigation.navigate("Add Plant")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    numColumns: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  card: {
    backgroundColor: "#9deaab",
    height: 150,
    width: 150,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  cardText: {
    color: "#257a3b",
    fontSize: 16,
    fontWeight: "bold",
  },
  plusIcon: {
    color: "darkgreen",
    fontWeight: "bold",
    marginBottom: 40,
  },
});

export default PlantList;
