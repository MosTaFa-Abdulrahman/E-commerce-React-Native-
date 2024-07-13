import { useState, useLayoutEffect, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ParallaxScrollView from "../components/ParallaxScrollView";
import { Colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import useGetSingleFood from "../hooks/useGetSingleFood";

// Redux && Context
import { addToCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import {
  addToFavorites,
  removeFromFavorites,
  persistFavorites,
  selectFavoriteProduct,
} from "../redux/favoriteSlice";

export default function Details() {
  const { authUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { foodId } = route.params;
  const { food } = useGetSingleFood(foodId);

  const dispatch = useDispatch();
  const favorites = useSelector(selectFavoriteProduct);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the current food item is already in favorites
    const favoriteItem = favorites.some((product) => product._id === foodId);
    setIsFavorite(favoriteItem);
  }, [favorites, foodId]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...food, user: authUser._id }));
    navigation.navigate("Cart");
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(food));
    } else {
      dispatch(addToFavorites(food));
    }
    dispatch(persistFavorites());
    setIsFavorite(!isFavorite);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.roundButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons
              name="heart"
              size={24}
              onPress={handleToggleFavorite}
              color={isFavorite ? "red" : Colors.primary}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [isFavorite, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        backgroundColor="#fff"
        style={{ flex: 1 }}
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.lightGrey}
        renderBackground={() => (
          <Image
            source={{ uri: food?.imageUrl }}
            style={{ height: 300, width: "100%" }}
          />
        )}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{food.name}</Text>
          </View>
        )}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>{food.name}</Text>
          <Text style={styles.productDescription}>
            {/* {food.description} */}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>${food.price}</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
    padding: 16,
  },
  productTitle: {
    fontSize: 30,
    marginVertical: 8,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 70,
    height: 73,
    justifyContent: "flex-end",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
});
