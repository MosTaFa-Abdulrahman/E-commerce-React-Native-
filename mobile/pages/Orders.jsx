import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { authUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  // Get All Orders for (Specific User)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.6:5000/api/order/get/${authUser._id}`
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://192.168.1.6:5000/api/order/delete/${orderId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <TouchableOpacity onPress={() => handleDeleteOrder(item._id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
      <Text style={styles.orderTitle}>Order #{item._id}</Text>
      <Text style={styles.orderText}>
        Total Price: ${item.totalPrice.toFixed(2)}
      </Text>

      <FlatList
        data={item.items}
        keyExtractor={(product) => product.food._id}
        renderItem={({ item: product }) => (
          <View style={styles.productContainer}>
            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: product?.food?.imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productText}>{product.food.name}</Text>
              <Text style={styles.productText}>
                Quantity: {product.quantity}
              </Text>
              <Text style={styles.productText}>
                Price: ${product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(order) => order._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.contNoOrders}>
          <Text style={styles.message}>No Orders added yet 😥🙄</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productText: {
    fontSize: 14,
  },

  deleteButton: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
    color: "white",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },

  contNoOrders: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 25,
    fontWeight: "bold",
    color: "tomato",
  },
});
