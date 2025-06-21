import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import { Product } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

const CartScreen: React.FC<Props> = ({ cart, setCart }) => {

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Carrinho">>();
  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - R$ {item.price}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Text style={{ color: "red" }}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
      <Button title="Finalizar Compra" onPress={() => navigation.navigate("Checkout")} />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  item: { marginBottom: 10 },
  total: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
});
