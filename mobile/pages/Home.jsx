import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/colors";
import Carousel from "../components/Carousel";
import Products from "../components/Products";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Carousel />

        <View style={styles.titleContainer}>
          <Text style={styles.header}>Top Price 😱💖</Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            onPress={() => navigation.navigate("ProductsList")}
          >
            <Text style={styles.itemText}>All</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <Products title="top" />

        <View style={styles.titleContainer}>
          <Text style={styles.header}>Offers near you</Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            onPress={() => navigation.navigate("ProductsList")}
          >
            <Text style={styles.itemText}>All</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <Products title="low" />

        <View style={styles.titleContainer}>
          <Text style={styles.header}>All Foods 🤩</Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            onPress={() => navigation.navigate("ProductsList")}
          >
            <Text style={styles.itemText}>All</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <Products title="all" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 80,
    backgroundColor: Colors.lightGrey,
    // marginBottom: 80,
  },
  scrollViewContent: { paddingBottom: 85 },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.medium,
  },
  header: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    paddingHorizontal: 16,
  },
});
