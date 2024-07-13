import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

// Redux  && Context
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCartItems,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const { authUser } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCartItems());
  };

  const handleIncreaseQuantity = (itemId) => {
    dispatch(increaseQuantity({ itemId }));
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(decreaseQuantity({ itemId }));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleDecreaseQuantity(item._id)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          value={item?.quantity?.toString()}
          keyboardType="numeric"
          editable={false}
        />
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleIncreaseQuantity(item._id)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item._id)}
      >
        <Ionicons name="trash" size={20} color={Colors.red} />
      </TouchableOpacity>
    </View>
  );

  // Create Order
  const handlePayment = async () => {
    try {
      const orderData = {
        user: authUser._id,
        name: authUser.username,
        address: authUser.address,
        totalPrice: totalPrice.toFixed(2),
        items: cartItems?.map((item) => ({
          food: {
            _id: item._id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          },
          price: (item.price * item.quantity).toFixed(2),
          quantity: item.quantity,
        })),
      };

      await makeRequest.post("order/create", orderData);
      dispatch(clearCartItems());
      alert("Order placed Successfully 🥰");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderCartItem}
          />
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Count : {cartItems.length}</Text>
            <Text style={styles.summaryText}>
              Total Price: ${totalPrice.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handlePayment}
          >
            <Text style={styles.paymentButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lightGrey,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    fontSize: 16,
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: Colors.danger,
    padding: 8,
    borderRadius: 5,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.grey,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  paymentButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    marginTop: 20,
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Cart;
