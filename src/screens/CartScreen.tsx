import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Product } from "../types/types";

type Props = {
    cart: Product[];
};
const CartScreen: React.FC<Props> = ({ cart }) => {
    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);return (

        <View style={styles.container}>
            <Text style={styles.title}>Carrinho</Text>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name} - R$ {item.price}</Text>
                    </View>
                )}
            />
            <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
        </View>
    );
};
export default CartScreen;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 20 
    },
    title: { 
        fontSize: 24,
        fontWeight: "bold", 
        marginBottom: 10 
    },
    item: { 
        marginBottom: 5 
    },
    total: { 
        marginTop: 20, 
        fontSize: 18, 
        fontWeight: "bold" 
    },
});
