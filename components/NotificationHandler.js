import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NotificationHandler = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "ios") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert(
            "Sorry, we need notification permissions to send you reminders"
          );
          return;
        }
      }
    };

    requestPermissions();

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return null;
};

export default NotificationHandler;
