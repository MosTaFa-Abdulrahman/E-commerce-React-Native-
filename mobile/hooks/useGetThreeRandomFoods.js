import { useState, useEffect } from "react";
import { makeRequest } from "../requestMethod";

function useGetThreeRandomFoods() {
  const [randomFoods, setRandomFoods] = useState([]);

  const getRandomFoods = async () => {
    try {
      const { data } = await makeRequest.get("food/get/random");
      if (data) setRandomFoods(data);
      else console.log("Foods Random not found 😥");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRandomFoods();
  }, []);

  return { randomFoods };
}

export default useGetThreeRandomFoods;
