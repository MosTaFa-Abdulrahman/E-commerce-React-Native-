import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { makeRequest } from "../requestMethod";
import { useNavigation } from "@react-navigation/native";

const fetchFoods = async (query, setFoods) => {
  try {
    const { data } = await makeRequest.get(`food/get/foodParams`, {
      params: query,
    });
    setFoods(data);
  } catch (error) {
    console.log(error.message);
  }
};

export default function Products({ title }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const queryMap = {
      top: { sort: "price", order: "desc", limit: 10 },
      low: { sort: "price", order: "asc", limit: 10 },
      all: {},
    };
    fetchFoods(queryMap[title], setFoods);
  }, [title]);

  const navigation = useNavigation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 15 }}
    >
      {foods?.map((food) => (
        <TouchableOpacity
          key={food._id}
          style={styles.card}
          onPress={() => navigation.navigate("Details", { foodId: food._id })}
        >
          <Image
            style={styles.image}
            source={{ uri: food?.imageUrl }}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{food.name}</Text>
            <Text style={styles.productPrice}>${food.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250, // Set a fixed width for each card
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  infoContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    marginTop: 5,
  },
});
