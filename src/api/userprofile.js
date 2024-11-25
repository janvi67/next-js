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
  
  export const UpdateUser = async (formData) => {
    return AxiosWrapper.put({
      endpoint: "users/profile/update",formData
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

  export const deleteUser = async () => {
    return AxiosWrapper.delete({
      endpoint: "users/profile/delete"
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

  export const fetchUsers = async (token,params) => {
    return AxiosWrapper.get({
      endpoint: "users/allusers",token,params
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