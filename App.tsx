import { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerForPushNotificationsAsync } from "./src/utils/notifications";

export default function App() {
  useEffect(()=>{
    registerForPushNotificationsAsync();
  }, []);

  return <AppNavigator />;
}
