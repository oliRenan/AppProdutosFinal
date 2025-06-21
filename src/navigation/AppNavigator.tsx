import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProductDetailsScreen from "../screens/ProductDetailScreen";
import { Product } from "../types/types";
import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
    Home: undefined;
    Carrinho: undefined;
    DetalhesProduto: {product: Product}
    Checkout: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {

    useEffect(()=>{
        loadCart()
    },[])

    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
        saveCart(cart);
    }, [cart]);
    const loadCart = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('@cart');
            if(savedCart){
                setCart(JSON.parse(savedCart))
            }
        } catch (error) {
            console.log('Erro ao carregar carrinho do AsyncStorage');
        }
    }


    const saveCart = async (cartToSave: Product[]) => {
        try {
            await AsyncStorage.setItem('@cart', JSON.stringify(cartToSave));
        } catch (error) {
            console.error('Erro ao salvar carrinho no AsyncStorage', error);
        }
    };

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
                    {(props) => <CartScreen {...props} cart={cart} setCart={setCart}/>}
                </Stack.Screen>
                <Stack.Screen name="DetalhesProduto" component={ProductDetailsScreen} />
                <Stack.Screen name="Checkout">
                    {(props) => <CheckoutScreen {...props} cart={cart} setCart={setCart}/>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigator;
