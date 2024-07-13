import { useState, useRef, useEffect } from "react";
import { View, ScrollView, Dimensions, Image, StyleSheet } from "react-native";
import useGetThreeRandomFoods from "../hooks/useGetThreeRandomFoods";

const { width: screenWidth } = Dimensions.get("window");

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { randomFoods } = useGetThreeRandomFoods();

  const products = [
    {
      id: 1,
      title: "Product 1",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1670601440146-3b33dfcd7e17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      title: "Product 2",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 3,
      title: "Product 3",
      imageUrl:
        "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    },
  ];

  useEffect(() => {
    // Start the timer when the component mounts
    const timer = setInterval(() => {
      scrollToIndex(
        currentIndex === randomFoods.length - 1 ? 0 : currentIndex + 1
      );
    }, 1600);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [currentIndex]);

  const scrollToIndex = (index) => {
    setCurrentIndex(index);
    // Calculate the x offset based on the screen width and index
    const xOffset = index * screenWidth;
    // Scroll to the calculated offset with animation (true)
    scrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.ceil(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(newIndex);
        }}
      >
        {randomFoods?.map((product) => (
          <View key={product._id} style={styles.slide}>
            <Image source={{ uri: product?.imageUrl }} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bbb",
    marginTop: 20,
  },
  slide: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});
