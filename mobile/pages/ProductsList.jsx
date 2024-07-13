import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function ProductsList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("all");
  const navigation = useNavigation();

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.6:5000/api/food/get/all?category=${category}&page=${page}`
      );
      const json = await response.json();
      setFoods([...foods, ...json.foods]);
      setTotalPages(json.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [page, category]);

  const renderFooter = () => {
    return loading ? (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.loadingIndicator}
      />
    ) : null;
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
      <View style={styles.foodDetails}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Details", { foodId: item._id })}
        >
          <Text style={styles.foodName}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.foodPrice}>Price: ${item.price}</Text>
        <Text style={styles.foodCategory}>Category: {item.cat}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setCategory(itemValue);
          setPage(1);
          setFoods([]);
        }}
      >
        <Picker.Item label="All Categories" value="all" />
        <Picker.Item label="Vegetables" value="Vegetables" />
        <Picker.Item label="Fruites" value="Fruites" />
        <Picker.Item label="Coffee" value="Coffee" />
        <Picker.Item label="Juice" value="Juice" />
      </Picker>

      <FlatList
        data={foods}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    padding: 12,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});
