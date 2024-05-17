

const addToFavorites = async (userId, productId) => {
  try {
    console.log('Product added to cart:', userId, productId);
    const response = await fetch(`http://localhost:3000/home/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export default addToFavorites;

