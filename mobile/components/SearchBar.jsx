import { useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const handleSearch = () => {
    navigation.navigate("SearchResults", { query: searchQuery });
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchSection}>
        <TouchableOpacity style={styles.searchField} onPress={handleSearch}>
          <Ionicons
            name="search-outline"
            style={styles.searchIcon}
            size={20}
            color={Colors.medium}
          />
          <TextInput
            style={styles.input}
            placeholder="Seacrh for Food 😍"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Orders")}
        >
          <Ionicons name="open-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    height: 60,
    backgroundColor: "#fff",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  input: {
    padding: 10,
    color: Colors.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});
