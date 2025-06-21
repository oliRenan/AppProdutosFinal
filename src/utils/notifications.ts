import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permissão de notificações não concedida!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log("Expo Push Token:", token);
  } else {
    alert("Precisa usar um dispositivo físico para receber notificações!");
  }

  return token;
}
