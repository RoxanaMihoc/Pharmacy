const BASE_URL = "http://localhost:3000";

//getAll orders for user
export const fetchOrders = async (currentUser, token) => {
    try {
      const response = await fetch(`${BASE_URL}/home/orders/${currentUser}`,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }});
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      throw error; // Re-throw to handle errors in the caller
    }
  };

  export const submitOrderApi = async (orderDetails,token) => {
    try {
      const response = await fetch(`${BASE_URL}/home/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit order");
      }
  
      const data = await response.json();
      return { success: data.success, data };
    } catch (error) {
      console.error("Error submitting order:", error);
      return { success: false, error: error.message };
    }
  };
  