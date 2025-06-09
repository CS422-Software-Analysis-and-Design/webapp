import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo.png";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 flex items-center justify-center">
      <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="relative p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="w-24 h-24" />
          </div>
          {/* Title */}
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
            Sign in to your account
          </h2>
          {/* Login Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;