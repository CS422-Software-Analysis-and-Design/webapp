import { React } from "react";
import { Routes, Route, Navigate, useLocation} from "react-router-dom";
import { routes } from "./constants/routes";
import "./App.css";
import DynamicTitle from "./utils/DynamicTitle";
import AppPage from "./pages/AppPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Helmet } from "react-helmet";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const location = useLocation();
  return (
      <>
      <Helmet>
          <title>{DynamicTitle(location.pathname)}</title>
      </Helmet>
      
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />

        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.SIGNUP} element={<SignupPage />} />
        <Route path={routes.APP} element={<AppPage />} />
      </Routes>
      
      </>
  );
}

export default App;
