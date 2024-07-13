import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Context && Reduxt-Toolkit
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Screens
import Home from "./pages/Home";
import CustomHeader from "./components/CustomHeader";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LocationSearch from "./pages/LocationSearch";
import Details from "./pages/Details";
import Cart from "./pages/Cart";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import ProductsList from "./pages/ProductsList";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const Stack = createNativeStackNavigator();

function App() {
  const { authUser } = useContext(AuthContext);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            {authUser ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    header: () => <CustomHeader />,
                  }}
                />

                <Stack.Screen
                  name="LocationSearch"
                  component={LocationSearch}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Details" component={Details} />
                <Stack.Screen
                  name="Cart"
                  component={Cart}
                  // options={{ headerShown: false }}
                />
                <Stack.Screen name="SearchResults" component={SearchResults} />
                <Stack.Screen name="Favorites" component={Favorites} />
                <Stack.Screen name="ProductsList" component={ProductsList} />
                <Stack.Screen name="Orders" component={Orders} />
              </>
            ) : (
              <>
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
              </>
            )}

            <Stack.Screen name="NotFound" component={NotFound} />
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const AppWrapper = () => (
  <AuthContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthContextProvider>
);

export default AppWrapper;
