import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import { Product } from "../types/types";

export type RootStackParamList = {
    Home: undefined;
    Carrinho: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {

    const [cart, setCart] = useState<Product[]>([]);
    const addToCart = (product: Product) => {
        setCart((prev) => [...prev, product]);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home">
                    {(props) => <HomeScreen {...props} addToCart={addToCart} />}
                </Stack.Screen>
                <Stack.Screen name="Carrinho">
                    {(props) => <CartScreen {...props} cart={cart} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigator;
