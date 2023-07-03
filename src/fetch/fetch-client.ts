import axios from "axios";

const base = "/api/";

function initBaseURL() {
  if (!axios.defaults.baseURL) {
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL + base;
  }
}

export function removeToken() {
  delete axios.defaults.headers.common["Authorization"];
}

export function setFetchClientToken(token: string) {
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
}

export const appRequest = <T>(type: "get" | "delete" | "put" | "post") => {
  initBaseURL();

  switch (type) {
    case "get":
      return (url: string) => axios.get(url).then((res) => res.data as T);

    case "delete":
      return (url: string) => axios.delete(url);
    case "put":
      return (url: string, data?: any) =>
        axios.put(url, data).then((res) => res.data as T);
    case "post":
      return (url: string, data?: any) =>
        axios.post(url, data).then((res) => res.data as T);
  }
};
