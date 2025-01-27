const BASE_URL = "http://localhost:3000";

//For Doctors
export const fetchPatientDetailsForDoctorPage = async (patientId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/doctors/patient/${patientId}`
      );
  
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

  export const fetchPatientsFromAPI = async (currentUser) => {
    try {
      const response = await fetch(
        `${BASE_URL}/doctors/patients-list/${currentUser}`
      );
  
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
export const fetchDoctorName = async (currentUser) => {
  try {
    let response = await fetch(`${BASE_URL}/home/details/${currentUser}`);
    if (!response.ok) {
      throw new Error("Failed to fetch doctor data");
    }
    let data = await response.json();
    const doctorId = data.doctor;

    response = await fetch(`${BASE_URL}/doctors/details/${doctorId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch doctor data");
    }
    data = await response.json();
    return { success: true, firstNameD: data.firstName, lastNameD:data.lastName, doctorId};
  } catch (error) {
    console.error("Error in fetchDoctorDetails:", error);
    return { success: false, error: error.message };
  }
};

  