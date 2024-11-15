import AxiosWrapper from "../services/ApiConfig.jsx";

export const addFamilyDetails = async (payload) => {
    return AxiosWrapper.getFamilyMember({
      endpoint: "family/familyDetails",payload
    })
      .then((response) => {
        return {
          status:response.status,
          data:response.data
        };
      })
      .catch((error) => {
          // return {
          //     status:error.response.status,
          //     code:error.code
          //   };
          throw error 
      });
  };
  