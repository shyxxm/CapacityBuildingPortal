import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "./UserContext";

const PrivateRoutes = () => {
  const { userData } = useContext(UserContext);
  console.log("Checking userData in PrivateRoutes:", userData);
  return userData ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoutes;
