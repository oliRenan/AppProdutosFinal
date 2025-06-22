import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
  route: RouteProp<RootStackParamList, "DetalhesProduto">;
};

const ProductDetailsScreen: React.FC<Props> = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>

      {product.image ? (
        <Image source={{ uri: product.image}} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>R$ {product.price}</Text>
      <Text style={styles.description}>Produto delicioso, feito com carinho! (mock)</Text>
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
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 20,
    color: "#333",
  },
  price: {
    fontSize: 18,
    marginTop: 5,
    marginHorizontal: 20,
    color: "#D00000",
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 20,
    color: "#666",
  },
});
