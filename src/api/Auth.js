import AxiosWrapper from "../services/ApiConfig.jsx";

export const RegisterUser = async (formData) => {
  return AxiosWrapper.Registerpost({
    endpoint: "users/register",formData
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


export const LoginUser = async (formData) => {
  return AxiosWrapper.Loginpost({
    endpoint: "users/login",formData
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

