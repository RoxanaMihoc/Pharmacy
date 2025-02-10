const BASE_URL = "http://localhost:3000";

export const addToCart = async (userId, productId, prescriptionId,token) => {
  try {
    console.log("Product added to cart:", userId, productId, prescriptionId);
    const response = await fetch(`${BASE_URL}/home/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, productId, prescriptionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    printProductsToFav(data);
    return { success: true, message: "Product added to cart successfully" };
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error("Error adding product to cart:", error);
    // Handle error (e.g., display an error message)
  }
};

const printProductsToFav = async (data) => {
  console.log("In print ");
  console.log(data);
};

export const addToCartF = async (productId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/home/product/${productId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    printProductsToFav(data);
    return { success: true, data };
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error("Error adding product to cart:", error);
    // Handle error (e.g., display an error message)
  }
};

//GET CART FOR USER
export const fetchCart = async (currentUser, token) => {
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  try {
    const response = await fetch(`${BASE_URL}/home/cart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }
    const data = await response.json();
    return data; // Return fetched cart data
  } catch (error) {
    console.error("Error fetching cart data:", error.message);
    throw error; // Re-throw error to handle it in the caller
  }
};

//GET details about items FROM CART
export const fetchCartItems = async (productId,token) => {
  console.log("Product Id: " + productId);
  try {
    const response = await fetch(`${BASE_URL}/home/product/${productId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching product data:", error.message);
    return { success: false, error: error.message };
  }
};

// cartServices.js

export const removeItemFromCart = async (currentUser, productId,token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }
    return { success: true };
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    return { success: false, error: error.message };
  }
};

export const deleteCart = async (currentUser,token) => {
  try {
    const response = await fetch(`${BASE_URL}/home/delete-cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete cart");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting cart:", error);
    return { success: false, error: error.message };
  }
};
