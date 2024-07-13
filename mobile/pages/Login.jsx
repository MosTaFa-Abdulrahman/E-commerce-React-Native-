import { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";

export default function Login() {
  const { setAuthUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Email and password are required.");
      return;
    }
    if (password?.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      const { data } = await makeRequest.post("/auth/login", {
        email,
        password,
      });

      if (data) {
        setAuthUser(data);
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://media.istockphoto.com/id/1346223165/photo/encryption-your-data-binary-code-and-digital-lock-hacker-attack-and-data-breach-big-data-with.webp?b=1&s=170667a&w=0&k=20&c=D017cD3Uy1ynHOm7w2i4ugulbXQ5qW7OBxYdkni1tzY=",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to CoolApp</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={(e) => setEmail(e)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={(e) => setPassword(e)}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
    color: "#fff",
  },
  button: {
    backgroundColor: "#3b5998",
    borderRadius: 25,
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
