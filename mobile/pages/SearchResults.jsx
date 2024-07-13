import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { makeRequest } from "../requestMethod";

const SearchResults = () => {
  const [foods, setFoods] = useState([]);
  const route = useRoute();
  const { query } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const { data } = await makeRequest.get(`food/search`, {
          params: { query },
        });
        setFoods(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchSearchResults();
  }, [query]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Details", { foodId: item._id })}
    >
      <Image style={styles.image} source={{ uri: item.imageUrl }} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={foods}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 150,
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
  },
});

export default SearchResults;
