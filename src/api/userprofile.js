import AxiosWrapper from "../services/ApiConfig.jsx";

export const getUserProfile = async (token) => {
    return AxiosWrapper.get({
      endpoint: "users/profile",token
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
  
  