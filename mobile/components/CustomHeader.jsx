import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { useAuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Bottom Sheet
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "./SearchBar";

export default function CustomHeader() {
  const { authUser, setAuthUser } = useAuthContext();

  const navigation = useNavigation();

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["50%"];

  const handlePresentModal = () => {
    bottomSheetModalRef.current?.present();
  };

  // Handle handleLogOut
  const handleLogOut = async () => {
    try {
      setAuthUser(null);
      await AsyncStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        overDragResistanceFactor={0}
        backgroundStyle={{ backgroundColor: Colors.lightGrey, borderRadius: 0 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={styles.toggleActive}>
              <Text style={styles.activeText}>Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleInActive}>
              <Text style={styles.inActiveText}>Pickup</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.locationHeader}>Your Location</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("LocationSearch");
              bottomSheetModalRef.current?.dismiss();
            }}
          >
            <View style={styles.locationItem}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.medium}
              />
              <Text style={{ flex: 1 }}>Current Location</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.locationHeader}>Arrival Time</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Favorites");
              bottomSheetModalRef.current?.dismiss();
            }}
          >
            <View style={styles.locationItem}>
              <Ionicons name="fast-food" size={20} color={Colors.medium} />
              <Text style={{ flex: 1 }}>Favourites Foods 😋</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
      {/* Bottom Sheet */}

      <View style={styles.container}>
        <TouchableOpacity style={styles.bikeImage} onPress={handlePresentModal}>
          <Image source={require("../assets/bike.png")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleContainer}
          onPress={handlePresentModal}
        >
          <Text style={styles.title}>Delivery . Now</Text>
          <View style={styles.locationName}>
            <Text style={styles.subTitle}>Selected Location</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {authUser ? (
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{
                uri: authUser?.imageUrl
                  ? authUser?.imageUrl
                  : "data:image/png;base64,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",
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                objectFit: "cover",
              }}
            />
            <TouchableOpacity onPress={handleLogOut}>
              <Text style={{ color: "red" }}>Logout</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "blue" }}>Register</Text>
          </TouchableOpacity>
        )}
      </View>

      <SearchBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },

  bikeImage: {
    weidth: 20,
    height: 20,
    borderRadius: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "gray",
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileButton: {
    // backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 50,
    flexDirection: "row",
    gap: 20,
  },

  // Bottom Sheet
  contentContainer: { flex: 1 },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 30,
    paddingHorizontal: 30,
  },
  activeText: { color: "#fff", fontWeight: "700" },
  toggleInActive: {
    // backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 30,
    paddingHorizontal: 30,
  },
  inActiveText: { color: Colors.primary },

  locationHeader: { fontWeight: "600", fontSize: 16, margin: 10 },
  locationItem: {
    flexDirection: "row",
    gap: 8,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: Colors.medium,
    borderWidth: 1,
  },

  button: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    margin: 16,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
