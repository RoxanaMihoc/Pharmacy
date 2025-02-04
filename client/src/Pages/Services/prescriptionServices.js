const BASE_URL = "http://localhost:3000";

// Services/prescriptionServices.js
export const sendPrescriptionData = async (prescriptionData,token) => {
  try {
    const response = await fetch(`${BASE_URL}/home/add-prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const fetchPrescriptions = async (currentUser, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/all-prescriptions/${currentUser}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const markPresAsCurrent = async (prescriptionId, currentUser, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/prescription/${prescriptionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUser: currentUser }),
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
export const removeCurrentPrescription = async (
  prescriptionId,
  currentUser, token
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/prescription/remove-current/${prescriptionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
export const fetchPrescriptionsForDoctors = async (user, token) => {
  try {
    const response = await fetch(`${BASE_URL}/home/prescription/${user}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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
export const fetchAllPrescriptions = async (currentUser, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/all-prescriptions/${currentUser}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

export const fetchCurrentPrescriptions = async (currentUser, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/current-prescription/${currentUser}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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

export const updateMedicationProgress = async (
  prescriptionId,
  medicationId,
  progressHistory,
  currentUser,
  doctorId,
  name,
  completed, token
) => {
  console.log("dnaodn", completed);
  if (completed == false) {
    try {
      console.log("Med", medicationId);
      const response = await fetch(
        `${BASE_URL}/home/update-progress/${prescriptionId}/${medicationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
          body: JSON.stringify({
            progressHistory,
            currentUser,
            doctorId,
            name,
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
  } else {
    return { success: false, error: "Pres completed" };
  }
};

export const deleteLastProgressEntry = async (
  prescriptionId,
  medicationId,
  progressHistory,
  currentUser,token
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/delete-progress/${prescriptionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
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

export const notifyDoctorAboutCompletion = async (
  prescriptionId,
  medicationId,
  progressHistory,
  currentUser,
  doctorId,
  name,
  completed,token
) => {
  try {
    console.log("Med", medicationId);
    const response = await fetch(
      `${BASE_URL}/home/progress-completed/${prescriptionId}/${medicationId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
        body: JSON.stringify({
          progressHistory,
          currentUser,
          doctorId,
          name,
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
