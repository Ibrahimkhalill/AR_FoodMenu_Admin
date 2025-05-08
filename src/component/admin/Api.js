import axiosInstance from "./axiosInstance";

// API Functions for TermsCondition and PrivacyPolicy
const termsConditionAPI = {
    // Get all terms and conditions
    getAll: async () => {
      try {
        const response = await axiosInstance.get("terms-condition/");
        return response.data;
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
        throw error;
      }
    },
  
    // Save (POST) a new term and condition
    save: async (data) => {
      try {
        const response = await axiosInstance.post("terms-condition/", data);
        return response.data;
      } catch (error) {
        console.error("Error saving term and condition:", error);
        throw error;
      }
    },
  
    // Update (PUT) an existing term and condition
    update: async (id, data) => {
      try {
        const response = await axiosInstance.put(`terms-condition/${id}/`, data);
        return response.data;
      } catch (error) {
        console.error("Error updating term and condition:", error);
        throw error;
      }
    },
  };
  
  const privacyPolicyAPI = {
    // Get all privacy policies
    getAll: async () => {
      try {
        const response = await axiosInstance.get("privacy-policy/");
        return response.data;
      } catch (error) {
        console.error("Error fetching privacy policies:", error);
        throw error;
      }
    },
  
    // Save (POST) a new privacy policy
    save: async (data) => {
      try {
        const response = await axiosInstance.post("privacy-policy/", data);
        return response.data;
      } catch (error) {
        console.error("Error saving privacy policy:", error);
        throw error;
      }
    },
  
    // Update (PUT) an existing privacy policy
    update: async (id, data) => {
      try {
        const response = await axiosInstance.put(`privacy-policy/${id}/`, data);
        return response.data;
      } catch (error) {
        console.error("Error updating privacy policy:", error);
        throw error;
      }
    },
  };
  
  export { termsConditionAPI, privacyPolicyAPI };
  