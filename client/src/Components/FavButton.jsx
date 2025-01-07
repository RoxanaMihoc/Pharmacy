const addToFav = async (userId, productId, prescriptionId) => {
  try {
    console.log('Product added to cart:', userId, productId, prescriptionId);
    const response = await fetch(`http://localhost:3000/home/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, prescriptionId}),
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const data = await response.json();
    printProductsToFav(data);
    return { success: true, message: 'Product added to cart successfully' };
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error('Error adding product to cart:', error);
    // Handle error (e.g., display an error message)
  }
};

const printProductsToFav = async (data) => {
  console.log("In print ");
  console.log(data);
};

const addToFavF = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/home/product/${productId}`
    );

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const data = await response.json();
    printProductsToFav(data);
    return { success: true, data};
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error('Error adding product to cart:', error);
    // Handle error (e.g., display an error message)
  }
};

export {addToFav, addToFavF};

