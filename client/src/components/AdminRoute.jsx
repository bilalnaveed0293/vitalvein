"use client"

import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Spinner from "./ui/Spinner"

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/login" />
}

export default AdminRoute

