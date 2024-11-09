import axios from "axios";
import { BASE_URL } from "../constants";

// console.log("BASEURL",BASE_URL)
// console.log("BASE_URL", BASE_URL);

export default class AxiosWrapper {
  static token = null;

  constructor() {
    // AxiosWrapper.retrieveToken()
  }

  static retrieveToken = async () => {
    try {
      this.token = await localStorage.getItem("token");
      
    } catch (e) {
      console.error(e);
    }
  };

  // Inside ApiConfig.jsx or the AxiosWrapper module

static get = async ({ endpoint, token }) => {
  const url = `${BASE_URL}${endpoint}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`, // Use the token here for Authorization
    },
  });
};


  static getById = async ({ endpoint, id, filter }) => {
    await AxiosWrapper.retrieveToken();
    let url = `${BASE_URL}${endpoint}/${id}`;
    const searchParams = [];
    let params;
    if (filter) {
      searchParams.push(`${filter}=time`);
    }
    if (searchParams.length > 0) {
      params = searchParams.join("&");
      url = url + "?" + params;
    }
    return axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
    });
  };

  static Registerpost = async ({ endpoint,formData }) => {
    await AxiosWrapper.retrieveToken();
    return axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
       "Content-Type": "multipart/form-data",
        Authorization: `${this.token}`,
      },

    });
    
  };
  static Loginpost = async ({ endpoint,formData }) => {
    await AxiosWrapper.retrieveToken();
    return axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },

    });
    
  };
  
  
  static put = async ({ endpoint, id, body }) => {
    await AxiosWrapper.retrieveToken();
    let url = `${BASE_URL}${endpoint}`;
    if (id) {
      url += `/${id}`;
    }
    return axios.put(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
    });
  };

  static delete = async ({ endpoint, id }) => {
    await AxiosWrapper.retrieveToken();
    let url = `${BASE_URL}${endpoint}`;
    if (id) {
      url += `/${id}`;
    }
    return axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
    });
  };
}