import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../types/types"; 
import { Ionicons } from "@expo/vector-icons";

type Props = {
    addToCart: (product: Product) => void;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
const HomeScreen: React.FC<Props> = ({ addToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [showForm, setShowForm] = useState(false);
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://6846d6487dbda7ee7ab08979.mockapi.io/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    const handleAddProduct = async () => {
        if (!newProductName || !newProductPrice) {
            Alert.alert("Preencha todos os campos!");
            return;
        }
        try {
            const newProduct = {
                name: newProductName,
                price: newProductPrice,
            };
            await axios.post("https://6846d6487dbda7ee7ab08979.mockapi.io/products", newProduct);
            setNewProductName("");
            setNewProductPrice("");
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
        }
    };
    const toggleForm = () => {
        setShowForm(!showForm);
    };
    return (
        <View style={styles.container}>
            {showForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Cadastrar Produto</Text>
                    <TextInput
                        placeholder="Nome do produto"
                        value={newProductName}
                        onChangeText={setNewProductName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Preço"
                        value={newProductPrice}
                        onChangeText={setNewProductPrice}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button title="Cadastrar Produto" onPress={handleAddProduct} />
                </View>
            )}
            <Text style={[styles.title, { marginTop: 20 }]}>Produtos</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name}</Text><Text>R$ {item.price}</Text>
                        <TouchableOpacity onPress={() => addToCart(item)}>
                            <Ionicons name="cart" size={24} color="green" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.cartIcon}
                onPress={() => navigation.navigate("Carrinho")}
            >
                <Ionicons name="cart" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fab} onPress={toggleForm}>
                <Ionicons name={showForm ? "close" : "add"} size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};
export default HomeScreen;
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    formContainer: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    item: {
        marginBottom: 10,
        borderBottomWidth: 1,paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 100,
        backgroundColor: "#007bff",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    cartIcon: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "green",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
});
