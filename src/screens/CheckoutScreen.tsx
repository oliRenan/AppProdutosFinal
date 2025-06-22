import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../types/types";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

Animatable.initializeRegistryWithDefinitions({
  scatterLeft: {
    0: {
      opacity: 1,
      scaleX: 1,
      translateX: 0,
      translateY: 0,
    },
    1: {
      opacity: 0,
      scaleX: 0.5,
      translateX: -20,
      translateY: -20,
    },
  },
  scatterRight: {
    0: {
      opacity: 1,
      scaleX: 1,
      translateX: 0,
      translateY: 0,
    },
    1: {
      opacity: 0,
      scaleX: 0.5,
      translateX: 20,
      translateY: -20,
    },
  },
});

type Props = {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "Checkout">;

const CheckoutScreen: React.FC<Props> = ({ cart, setCart }) => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastRef = useRef<Animatable.View>(null);
  const toastIconRef = useRef<Animatable.View>(null);

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const paymentOptions = [
    { id: "pix", label: "Pix", icon: "qr-code" },
    { id: "card", label: "Cartão", icon: "card" },
    { id: "cash", label: "Dinheiro", icon: "cash" },
  ];

  const handleCheckout = () => {
    if (!address.trim() || !paymentMethod) {
      setToast({ message: "Por favor, preencha o endereço e selecione uma forma de pagamento.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setToast({
      message: `Compra finalizada!\nEndereço: ${address}\nPagamento: ${paymentOptions.find((opt) => opt.id === paymentMethod)?.label}`,
      type: "success",
    });
    setTimeout(() => {
      setToast(null);
      setCart([]);
      navigation.navigate("Home");
    }, 2000);
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethod(id === paymentMethod ? "" : id);
  };

  const renderPaymentOption = ({ item }: { item: { id: string; label: string; icon: string } }) => (
    <TouchableOpacity
      style={[styles.paymentOption, paymentMethod === item.id && styles.paymentOptionSelected]}
      onPress={() => togglePaymentMethod(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={24}
        color={paymentMethod === item.id ? "#fff" : "#D00000"}
      />
      <Text
        style={[
          styles.paymentOptionText,
          paymentMethod === item.id && styles.paymentOptionTextSelected,
        ]}
      >
        {item.label}
      </Text>
      <View style={styles.checkbox}>
        {paymentMethod === item.id && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: Product }) => (
    <View style={styles.summaryItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.summaryImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Sem Imagem</Text>
        </View>
      )}
      <View style={styles.summaryItemInfo}>
        <Text style={styles.summaryItemName}>{item.name}</Text>
        <Text style={styles.summaryItemPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#D00000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#888" />
          <Text style={styles.emptyText}>Seu carrinho está vazio!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopButtonText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.form}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressStep}>
                <View style={styles.progressCircleActive}>
                  <Text style={styles.progressText}>1</Text>
                </View>
                <Text style={styles.progressLabel}>Carrinho</Text>
              </View>
              <View style={styles.progressLineActive} />
              <View style={styles.progressStep}>
                <View style={styles.progressCircleActive}>
                  <Text style={styles.progressText}>2</Text>
                </View>
                <Text style={styles.progressLabel}>Checkout</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>3</Text>
                </View>
                <Text style={styles.progressLabel}>Confirmação</Text>
              </View>
            </View>

            {/* Address Input */}
            <Text style={styles.label}>Endereço de Entrega</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, bairro"
              value={address}
              onChangeText={setAddress}
              multiline
              placeholderTextColor="#888"
            />

            {/* Payment Methods */}
            <Text style={[styles.label, { marginTop: 20 }]}>Forma de Pagamento</Text>
            <FlatList
              data={paymentOptions}
              renderItem={renderPaymentOption}
              keyExtractor={(item) => item.id}
              style={styles.paymentList}
            />

            {/* Order Summary */}
            <TouchableOpacity
              style={styles.summaryHeader}
              onPress={() => setShowSummary(!showSummary)}
            >
              <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
              <Ionicons
                name={showSummary ? "chevron-up" : "chevron-down"}
                size={24}
                color="#D00000"
              />
            </TouchableOpacity>
            {showSummary && (
              <View style={styles.summaryContent}>
                <FlatList
                  data={cart}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => item.id}
                  style={styles.summaryList}
                />
                <View style={styles.summaryTotal}>
                  <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Confirm Button */}
            <TouchableOpacity style={styles.button} onPress={handleCheckout}>
              <Text style={styles.buttonText}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>

          {/* Toast Notification */}
          {toast && (
            <Animatable.View
              ref={toastRef}
              animation={toast.type === "success" ? "slideInDown" : "bounceInDown"}
              duration={400}
              style={[
                styles.toast,
                toast.type === "success" ? styles.toastSuccess : styles.toastError,
              ]}
            >
              {toast.type === "success" && (
                <>
                  <Animatable.View
                    animation="scatterLeft"
                    duration={600}
                    style={[styles.particle, { left: 10, top: 10 }]}
                  />
                  <Animatable.View
                    animation="scatterRight"
                    duration={600}
                    style={[styles.particle, { left: 20, top: 5 }]}
                  />
                  <Animatable.View
                    animation="scatterLeft"
                    duration={600}
                    style={[styles.particle, { left: 15, top: 15 }]}
                  />
                </>
              )}
              <Animatable.View
                ref={toastIconRef}
                animation={toast.type === "success" ? "pulse" : "fadeIn"}
                delay={toast.type === "success" ? 0 : 300}
                duration={toast.type === "success" ? 200 : 200}
                style={styles.toastIconContainer}
              >
                <Ionicons
                  name={toast.type === "success" ? "checkmark-circle" : "alert-circle"}
                  size={24}
                  color="#fff"
                />
              </Animatable.View>
              <Text style={styles.toastText}>{toast.message}</Text>
            </Animatable.View>
          )}
        </>
      )}
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
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: "#D00000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  progressCircleActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D00000",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#eee",
    marginHorizontal: 5,
  },
  progressLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: "#D00000",
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentList: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  paymentOptionSelected: {
    backgroundColor: "#D00000",
    borderColor: "#D00000",
  },
  paymentOptionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  paymentOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D00000",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  summaryContent: {
    marginBottom: 20,
  },
  summaryList: {
    maxHeight: 200,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  summaryItemPrice: {
    fontSize: 12,
    color: "#D00000",
    marginTop: 4,
  },
  summaryTotal: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  button: {
    backgroundColor: "#D00000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  toast: {
    position: "absolute",
    top: 70,
    left: "5%",
    right: "5%",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toastSuccess: {
    backgroundColor: "#4CAF50",
  },
  toastError: {
    backgroundColor: "#D00000",
  },
  toastIconContainer: {
    marginRight: 10,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    opacity: 0.8,
  },
});
