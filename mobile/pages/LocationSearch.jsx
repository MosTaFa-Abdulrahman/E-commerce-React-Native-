import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";

const LocationSearch = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      updateLocation(latitude, longitude);
    };

    requestLocationPermission();
  }, []);

  const updateLocation = (latitude, longitude) => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));
    setMarker({
      latitude,
      longitude,
    });
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  const searchLocation = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = () => {
    // Handle confirmation logic here, e.g., navigate to the next screen
    console.log("Confirmed:", marker);
    // For example:
    // navigation.navigate('NextScreen', { marker });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            searchLocation(text);
          }}
        />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                updateLocation(parseFloat(item.lat), parseFloat(item.lon));
                setSearchResults([]);
                setQuery(item.display_name);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    marginTop: 14,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  searchInput: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  resultItem: {
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 5,
  },
  confirmText: {
    color: "white",
    fontSize: 18,
  },
});

export default LocationSearch;
