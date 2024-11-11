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
  
  export const UpdateUser = async (formData,token) => {
    return AxiosWrapper.put({
      endpoint: "users/profile/update",formData,token
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

  export const deleteUser = async (token) => {
    return AxiosWrapper.delete({
      endpoint: "users/profile/delete",token
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