import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  selectFavoriteProduct,
  loadFavorites,
  removeFromFavorites,
  persistFavorites,
} from "../redux/favoriteSlice";
import { useNavigation } from "@react-navigation/native";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const handleRemoveFromFavorites = (item) => {
    dispatch(removeFromFavorites(item));
    dispatch(persistFavorites());
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Details", { foodId: item._id })}
        >
          <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveFromFavorites(item)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-bin" size={24} color={Colors.red} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No favorites added yet 🙄</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: Colors.medium,
  },
  removeButton: {
    padding: 8,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    color: Colors.red,
  },
});

export default Favorites;
