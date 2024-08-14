import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/HomeScreen";
import PlantList from "./components/PlantList";
import PlantDetails from "./components/PlantDetails";
import AddPlant from "./components/AddPlant";
import EditPlant from "./components/EditPlant";
import * as Notifications from "expo-notifications";
import NotificationHandler from "./components/NotificationHandler";
import { Platform } from "react-native";

import Layout from "./components/Layout";

const requestPermissions = async () => {
  if (Platform.OS === "ios") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need notification permissions to send you reminders!");
      return;
    }
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NotificationHandler />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="My Plants">
          {(props) => (
            <Layout>
              <PlantList {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Details">
          {(props) => (
            <Layout>
              <PlantDetails {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Add Plant">
          {(props) => (
            <Layout>
              <AddPlant {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="EditPlant">
          {(props) => (
            <Layout>
              <EditPlant {...props} />
            </Layout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
