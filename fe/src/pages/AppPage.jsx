import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { appRoutes } from "../constants/routes";
import Home from "../components/Home";
import Products from "../components/Products";
import ProductPage from "../components/ProductPage";
import Compare from "../components/Compare";
import NotFound from "../components/NotFound";
import ProductDetail from "../components/ProductDetail";
import ChatbotScreen from "../components/Chatbot";

import Favourite from "../components/Favourite";

function AppPage() {
    const location = useLocation();
    const isChatbotScreen = location.pathname.split("/")[2] === appRoutes.CHATBOT;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className={`flew-grow pt-[64px] ${isChatbotScreen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                <Routes>
                    <Route path={appRoutes.HOME} element={<Home />} />
                    <Route path={appRoutes.PRODUCTS} element={<ProductPage/>}>
                        <Route path=":productId" element={<ProductDetail/>}/>
                        <Route path="" element={<Products />} />
                    </Route>
                    <Route path={appRoutes.PRODUCTS_SEARCH} element={<Products/>} />
                    <Route path={appRoutes.COMPARE} element={<Compare/>} />
                    <Route path={appRoutes.NOTFOUND} element={<NotFound />} />
                    <Route path={appRoutes.FAVOURITE} element={<Favourite/>} />
                    <Route path={appRoutes.PRODUCTDETAIL} element={<ProductDetail/>}/>
                    <Route path={appRoutes.CHATBOT} element={<ChatbotScreen/>} />
                    <Route
                        path="*"
                        element={<Navigate to="/app/home" replace />}
                    />
                </Routes>
            </main>
            {!isChatbotScreen && (
                <div className="FooterContainer">
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default AppPage;