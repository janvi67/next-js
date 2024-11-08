
// export const setAuthData = (token, email, rememberMe) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("login", "true");
  
//     if (rememberMe) {
//       localStorage.setItem("usertoken", token);
//       localStorage.setItem("email", email);
//     } else {
//       localStorage.removeItem("usertoken");
//       localStorage.removeItem("email");
//     }
//   };
  
//   export const getAuthData = () => {
//     return {
//       token: localStorage.getItem("token"),
//       email: localStorage.getItem("email"),
//       isLoggedIn: localStorage.getItem("login") === "true",
//     };
//   };
  
  export const clearAuthData = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("login");
    // localStorage.removeItem("usertoken");
    // localStorage.removeItem("email");
  };
  