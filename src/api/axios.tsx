// @ts-ignore
import axios from "axios";

export const config = {
  baseURL: "https://newsapi-project.onrender.com",
};

const client = axios.create({
  baseURL: config.baseURL,

  timeout: 500000,
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

export default client;
