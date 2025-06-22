import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { Product } from "../types/types";

type Props = {
  route: RouteProp<RootStackParamList, "DetalhesProduto">;
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

const ProductDetailsScreen: React.FC<Props> = ({ route, cart, setCart }) => {
  const { product } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleAddToCart = () => {
    setCart((prevCart) => [...prevCart, product]);
    navigation.navigate("Carrinho");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#D00000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
      </View>

      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Sem Imagem</Text>
        </View>
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>R$ {product.price}</Text>
        <Text style={styles.description}>
          {product.description}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

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
    marginLeft: 10,
    color: "#D00000",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    backgroundColor: "#f9f9f9",
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  detailsContainer: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D00000",
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addToCartButton: {
    backgroundColor: "#D00000",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
