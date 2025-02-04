
const BASE_URL = "http://localhost:3000";

//get favorites for user
export const fetchFavorites = async (currentUser, token) => {
  try {
    const response = await fetch(`${BASE_URL}/home/favorites/${currentUser}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }});
    if (!response.ok) {
      throw new Error("Failed to fetch favorites data");
    }
    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching favorites data:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

//add to favorites for user
export const addToFavorites = async (userId, productId, token) => {
  try {
    console.log('Product added to cart:', userId, productId);
    const response = await fetch(`${BASE_URL}/home/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, productId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const data = await response.json();
    console.log(data);
    return { success: true, message: 'Product added to favorites successfully' };
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error('Error adding product to favorites:', error);
    // Handle error (e.g., display an error message)
  }
};

// Fetch a single product's details by ID
export const fetchFavoriteItemDetails = async (productId, token) => {
  try {
    console.log("Product Id:", productId);
    const response = await fetch(`${BASE_URL}/home/product/${productId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }});
    if (!response.ok) {
      throw new Error("Failed to fetch product details.");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { success: false, error };
  }
};

// Fetch multiple product details based on a list of product IDs
export const populateFavoriteItems = async (favoritesItems, token) => {
  try {
    const promises = favoritesItems.map(async (id) => {
      const { success, data } = await fetchFavoriteItemDetails(id, token);
      return success ? data : null; // Return data if successful, otherwise null
    });

    const resolvedData = await Promise.all(promises);
    return resolvedData.filter((item) => item !== null); // Filter out null values
  } catch (error) {
    console.error("Error populating favorite items:", error);
    throw error; // Re-throw for error handling
  }
};

export const removeFavoriteItem = async (currentUser, productId, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/favorites/${currentUser}/${productId}`,
      {
        method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove item from favorites");
    }
    return { success: true };
  } catch (error) {
    console.error("Error removing item from favorites:", error);
    return { success: false, error };
  }
};


