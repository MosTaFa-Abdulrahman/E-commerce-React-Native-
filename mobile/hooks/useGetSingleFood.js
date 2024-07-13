import { useState, useEffect } from "react";
import { makeRequest } from "../requestMethod";

function useGetSingleFood(id) {
  const [food, setFood] = useState({});

  const getFood = async () => {
    try {
      const { data } = await makeRequest.get(`food/get/${id}`);
      if (data) setFood(data);
      else console.log("Food not found 😥");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getFood();
  }, []);

  return { food };
}

export default useGetSingleFood;
