import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerForPushNotificationsAsync } from "./src/utils/notifications"; // (ajuste o path)

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token ?? null);
    };

    getToken();
  }, []);

  return <AppNavigator />;
}
