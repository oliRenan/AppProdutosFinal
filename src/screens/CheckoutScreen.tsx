import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { Product } from "../types/types";

type Props = {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "Checkout">;

const CheckoutScreen: React.FC<Props> = ({ cart, setCart }) => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleCheckout = () => {
    if (!address || !paymentMethod) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    Alert.alert("Compra Finalizada!", `Endereço: ${address}\nPagamento: ${paymentMethod}`);

    setCart([]); 
    navigation.navigate("Home"); 
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <TextInput
        placeholder="Endereço de entrega"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TextInput
        placeholder="Forma de pagamento (Cartão, Pix...)"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
        style={styles.input}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      <Button title="Finalizar Compra" onPress={handleCheckout} />
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5 },
  total: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
});
