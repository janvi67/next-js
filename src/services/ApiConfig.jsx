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

  static get = async ({ endpoint, token, params }) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}?${queryString}`;

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
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static Registerpost = async ({ endpoint, formData }) => {
    await AxiosWrapper.retrieveToken();
    return axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${this.token}`,
      },
    });
  };
  static Loginpost = async ({ endpoint, formData }) => {
    await AxiosWrapper.retrieveToken();
    return axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
    });
  };

  static Forgetpwdpost = async ({ endpoint, email }) => {
    return axios.post(
      `${BASE_URL}${endpoint}`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  static Resetpwdpost = async ({ endpoint, data }) => {
    console.log("🚀 ~ AxiosWrapper ~ Resetpwdpost= ~ token:", data);
    return axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
  };

  static put = async ({ endpoint, formData }) => {
    await AxiosWrapper.retrieveToken();
    let url = `${BASE_URL}${endpoint}`;

    return axios.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.token}`,
      },
    });
  };

  static delete = async ({ endpoint }) => {
    await AxiosWrapper.retrieveToken();
    let url = `${BASE_URL}${endpoint}`;

    return axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  };

  static getFamilyMember = async ({ endpoint, payload }) => {
    await AxiosWrapper.retrieveToken();
    return axios.post(`${BASE_URL}${endpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  };
}
