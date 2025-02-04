const BASE_URL = "http://localhost:3000";

//For Doctors
export const fetchPatientDetailsForDoctorPage = async (patientId, token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/doctors/patient/${patientId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
    });
  
      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }
  
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error in fetchPatientFromApi:", error);
      return { success: false, error: error.message };
    }
  };

  export const fetchPatientsFromAPI = async (currentUser, token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/doctors/patients-list/${currentUser}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
    });
  
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
  
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error in fetchPatientsFromAPI:", error);
      return { success: false, error: error.message };
    }
  };

//For User
export const fetchDoctorName = async (currentUser, token) => {
  try {
    let response = await fetch(`${BASE_URL}/home/details/${currentUser}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
});
    if (!response.ok) {
      throw new Error("Failed to fetch doctor data");
    }
    let data = await response.json();
    const doctorName = data.doctorNameB;
    console.log(doctorName);

    return { success: true, doctorName};
  } catch (error) {
    console.error("Error in fetchDoctorDetails:", error);
    return { success: false, error: error.message };
  }
};

  