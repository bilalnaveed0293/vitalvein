"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get("/api/users/me")
          setUser(res.data)
        }
      } catch (err) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
        setError(err.response?.data?.message || "Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      console.log("Sending registration request with data:", userData)
      const res = await axios.post("/api/auth/register", userData)
      console.log("Registration response:", res.data)

      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return res.data
    } catch (err) {
      console.error("Registration error details:", err)
      const errorMessage = err.response?.data?.message || "Registration failed"
      setError(errorMessage)
      throw err
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put("/api/users/profile", userData)
      setUser(res.data)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed")
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

