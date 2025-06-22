import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Alert, TouchableOpacity, Image, RefreshControl } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../types/types";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import * as Yup from "yup"; 
import { TextInputMask } from "react-native-masked-text"; 

type Props = {
    addToCart: (product: Product) => void;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "O nome deve ter pelo menos 3 caracteres")
        .required("O nome é obrigatório"),
    price: Yup.number()
        .positive("O preço deve ser um número positivo")
        .required("O preço é obrigatório"),
    image: Yup.string()
        .url("A URL da imagem deve ser válida")
        .required("A URL da imagem é obrigatória"),
    description: Yup.string()
        .min(10, "A descrição deve ter pelo menos 10 caracteres")
        .required("A descrição é obrigatória"),
});

const HomeScreen: React.FC<Props> = ({ addToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [newProductImage, setNewProductImage] = useState("");
    const [newProductDescription, setNewProductDescription] = useState(""); 
    const [showForm, setShowForm] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [refreshing, setRefreshing] = useState(false); 
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); 
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://6846d6487dbda7ee7ab08979.mockapi.io/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setRefreshing(false); 
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        try {
            const unmaskedPrice = newProductPrice.replace(/[^0-9,]/g, "").replace(",", ".");
            const productData = {
                name: newProductName,
                price: parseFloat(unmaskedPrice),
                image: newProductImage,
                description: newProductDescription, 
            };

            await validationSchema.validate(productData, { abortEarly: false });
            setErrors({}); 

            await axios.post("https://6846d6487dbda7ee7ab08979.mockapi.io/products", {
                ...productData,
                price: unmaskedPrice, 
            });
            setNewProductName("");
            setNewProductPrice("");
            setNewProductImage("");
            setNewProductDescription(""); 
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errorMessages: { [key: string]: string } = {};
                error.inner.forEach((err) => {
                    if (err.path) errorMessages[err.path] = err.message;
                });
                setErrors(errorMessages);
                Alert.alert("Erro de validação", "Por favor, corrija os campos destacados.");
            } else {
                console.error("Erro ao cadastrar produto:", error);
                Alert.alert("Erro", "Não foi possível cadastrar o produto.");
            }
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setErrors({}); 
    };

    const filteredProducts = products.filter((product) =>
        String(product.name).toLowerCase().includes(searchText.toLowerCase())
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

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
                        style={[styles.input, errors.name && styles.inputError]}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>} 

                    <TextInputMask
                        type={"money"}
                        options={{
                            precision: 2,
                            separator: ",",
                            delimiter: ".",
                            unit: "R$ ",
                            suffixUnit: "",
                        }}
                        placeholder="Preço"
                        value={newProductPrice}
                        onChangeText={setNewProductPrice}
                        keyboardType="numeric"
                        style={[styles.input, errors.price && styles.inputError]}
                    />
                    {errors.price && <Text style={styles.errorText}>{errors.price}</Text>} 

                    <TextInput
                        placeholder="URL da imagem"
                        value={newProductImage}
                        onChangeText={setNewProductImage}
                        style={[styles.input, errors.image && styles.inputError]}
                    />
                    {errors.image && <Text style={styles.errorText}>{errors.image}</Text>} 

                    <TextInput
                        placeholder="Descrição do produto"
                        value={newProductDescription}
                        onChangeText={setNewProductDescription}
                        style={[styles.input, errors.description && styles.inputError, { height: 80 }]}
                        multiline
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>} 

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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#dc2626"]}
                        tintColor="#dc2626"
                    />
                }
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
    inputError: { // NEW: Style for invalid inputs
        borderColor: "#dc2626",
    },
    errorText: { // NEW: Style for error messages
        color: "#dc2626",
        fontSize: 12,
        marginBottom: 8,
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
