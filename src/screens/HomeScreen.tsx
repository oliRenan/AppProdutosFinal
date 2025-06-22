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
    Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
    const [newProductImage, setNewProductImage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [searchText, setSearchText] = useState("");
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
        if (!newProductName || !newProductPrice || !newProductImage) {
            Alert.alert("Preencha todos os campos!");
            return;
        }
        try {
            const newProduct = {
                name: newProductName,
                price: newProductPrice,
                image: newProductImage,
            };
            await axios.post("https://6846d6487dbda7ee7ab08979.mockapi.io/products", newProduct);
            setNewProductName("");
            setNewProductPrice("");
            setNewProductImage("");
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const filteredProducts = products.filter((product) =>
        String(product.name).toLowerCase().includes(searchText.toLowerCase())
    );

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
                    <TextInput
                        placeholder="URL da imagem"
                        value={newProductImage}
                        onChangeText={setNewProductImage}
                        style={styles.input}
                    />
                    <Button color="#EA1D2C" title="Cadastrar Produto" onPress={handleAddProduct} />
                </View>
            )}

            <Text style={[styles.title, { marginTop: 20 }]}>Produtos</Text>
            <TextInput
                placeholder="Buscar Produto"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
            />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("DetalhesProduto", { product: item })}
                    >
                        <View style={styles.productCard}>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="image-outline" size={40} color="#ccc" />
                                </View>
                            )}
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>R$ {item.price}</Text>
                            </View>
                            <TouchableOpacity onPress={() => addToCart(item)}>
                                <Ionicons name="cart" size={24} color="#EA1D2C" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
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
    container: { flex: 1, padding: 20, backgroundColor: "#ffffff" },
    title: { fontSize: 22, fontWeight: "bold", color: "#EA1D2C", marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    formContainer: {
        backgroundColor: "#fcebec",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    productCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: "#f2f2f2",
        borderWidth: 1,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        backgroundColor: "#f2f2f2",
    },
    imagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333",
    },
    productPrice: {
        color: "#EA1D2C",
        fontSize: 14,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 100,
        backgroundColor: "#EA1D2C",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cartIcon: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#EA1D2C",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#EA1D2C",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
});
