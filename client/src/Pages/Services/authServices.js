const BASE_URL = "http://localhost:3000";

// Services/loginServices.js

export const loginUser = async (email, password, identifier, role) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, identifier, role }),
    });

    if (!response.ok) {
      throw new Error("Credențiale invalide. Încearcă din nou.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error: error.message };
  }
};

// Services/registerServices.js

// Services/authServices.js

export const registerUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error("User already registered. Please use another email.");
      }
  
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, error: error.message };
    }
  };
  

export const fetchAllDoctors = async () => {
    try {
      const response = await fetch(`${BASE_URL}/doctors/all-doctors`);
  
      if (!response.ok) {
        throw new Error("Failed to get all doctors");
      }
  
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      return { success: false, error: error.message };
    }
  };
  
