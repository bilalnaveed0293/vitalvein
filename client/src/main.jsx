import React from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import App from "./App"
import "./index.css" // Make sure this import is present
import axios from "axios"

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"
console.log("Axios base URL:", axios.defaults.baseURL)

// Add token to requests if it exists
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  console.log("Authorization token found and set in headers")
}

// Add axios interceptors for debugging
axios.interceptors.request.use(
  (config) => {
    console.log("Request sent:", config.method.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url)
    return response
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  },
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-center" />
    <App />
  </React.StrictMode>,
)

