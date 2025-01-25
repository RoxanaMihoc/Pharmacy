const BASE_URL = "http://localhost:3000";

// Services/prescriptionServices.js
export const sendPrescription = async (prescriptionData) => {
  try {
    const response = await fetch(`${BASE_URL}/home/add-prescription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prescriptionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send prescription");
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in sendPrescription:", error);
    return { success: false, error: error.message };
  }
};

export const fetchPrescriptions = async (currentUser) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/all-prescriptions/${currentUser}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const markPresAsCurrent = async (prescriptionId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/prescription/${prescriptionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPrescription: true, currentUser }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark the prescription as current.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error marking prescription as current:", error);
    alert("An error occurred while marking the prescription as current.");
  }
};

// prescriptionServices.js
export const removeCurrentPrescription = async (prescriptionId, currentUser) => {
    try {
      const response = await fetch(
        `${BASE_URL}home/prescription/remove-current/${prescriptionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPrescription: false, currentUser }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to remove the current prescription.");
      }
  
      return { success: true };
    } catch (error) {
      console.error("Error in removeCurrentPrescription:", error);
      return { success: false, error };
    }
  };

//For Doctors
export const fetchPrescriptionsForDoctors = async (user) => {
  try {
    const response = await fetch(
      `${BASE_URL}home/prescription/${user}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in fetchPrescriptionsFromApi:", error);
    return { success: false, error: error.message };
  }
};

//all doctor prescriptions
export const fetchAllPrescriptions = async (currentUser) => {
  try {
    const response = await fetch(
      `${BASE_URL}home/all-prescriptions/${currentUser}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch prescriptions");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in fetchAllPrescriptions:", error);
    return { success: false, error: error.message };
  }
};

export const fetchCurrentPrescriptions = async (currentUser) => {
  try {
    const response = await fetch(
      `http://localhost:3000/home/current-prescription/${currentUser}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prescriptions");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return { success: false, error: error.message };
  }
};

export const updateMedicationProgress = async (prescriptionId, medicationId, progressHistory, currentUser) => {
  try {
    const response = await fetch(
      `http://localhost:3000/home/update-progress/${prescriptionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationId,
          progressHistory,
          currentUser,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update medication progress.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating medication progress:", error);
    return { success: false, error: error.message };
  }
};

export const deleteLastProgressEntry = async (prescriptionId, medicationId, progressHistory, currentUser) => {
  try {
    const response = await fetch(
      `http://localhost:3000/home/delete-progress/${prescriptionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationId,
          progressHistory,
          currentUser,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the last progress entry.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting the last progress entry:", error);
    return { success: false, error: error.message };
  }
};



  
