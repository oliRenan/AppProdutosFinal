import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Alert, TouchableOpacity, Button, Image } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../types/types";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";

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
                <Animated.View
                    entering={FadeInDown.duration(300)}
                    exiting={FadeOut.duration(300)}
                    style={styles.formContainer}
                >
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
                    <TouchableOpacity style={styles.submitButton} onPress={handleAddProduct}>
                        <Text style={styles.submitButtonText}>Cadastrar Produto</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <Text style={[styles.title, { marginTop: 20 }]}>Produtos</Text>
            <Animated.View entering={FadeIn.duration(300)} style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    placeholder="Buscar Produto"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                />
            </Animated.View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.duration(300).delay(index * 100)}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("DetalhesProduto", { product: item })}
                            style={styles.productCard}
                        >
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
                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={() => addToCart(item)}
                            >
                                <Ionicons name="cart" size={24} color="#fff" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                showsVerticalScrollIndicator={false}
            />

            <Animated.View entering={FadeIn.duration(300)} style={styles.cartIcon}>
                <TouchableOpacity onPress={() => navigation.navigate("Carrinho")}>
                    <Ionicons name="cart" size={30} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300)} style={styles.fab}>
                <TouchableOpacity onPress={toggleForm}>
                    <Ionicons name={showForm ? "close" : "add"} size={30} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8fafc",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 12,
        fontFamily: "System",
    },
    formContainer: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    input: {
        backgroundColor: "#f1f5f9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
        color: "#1f2937",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    submitButton: {
        backgroundColor: "#dc2626",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: "#1f2937",
    },
    productCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "#f1f5f9",
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: "#dc2626",
        fontWeight: "500",
    },
    addToCartButton: {
        backgroundColor: "#dc2626",
        padding: 8,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 96,
        backgroundColor: "#dc2626",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cartIcon: {
        position: "absolute",
        right: 16,
        bottom: 24,
        backgroundColor: "#dc2626",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
});
