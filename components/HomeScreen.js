import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyPlant</Text>
      <Image style={styles.image} source={require("./plants.jpg")} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("My Plants")}
      >
        <Text style={styles.buttonText}>Go to plants</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    color: "#257a3b",
  },
  button: {
    fontSize: 18,
    backgroundColor: "#257a3b",
    padding: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  image: {
    width: 360,
    height: 360,
    marginBottom: 60,
  },
});
