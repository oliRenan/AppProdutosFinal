import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../types/types";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

type CheckoutScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Checkout"
>;

const CheckoutScreen: React.FC<Props> = ({ cart, setCart }) => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCheckout = () => {
    if (!address.trim() || !paymentMethod.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    Alert.alert(
      "Compra Finalizada!",
      `Endereço: ${address}\nPagamento: ${paymentMethod}`
    );

    setCart([]);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Endereço de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, número, bairro"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Text style={[styles.label, { marginTop: 20 }]}>Forma de Pagamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Cartão, Pix, etc."
          value={paymentMethod}
          onChangeText={setPaymentMethod}
        />

        <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D00000",
    marginLeft: 15,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D00000",
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    fontSize: 16,
    color: "#111",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D00000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#D00000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
