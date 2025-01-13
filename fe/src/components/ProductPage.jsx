import { React } from "react";
import { Outlet } from "react-router-dom";
import Section from "./Section";

const ProductPage = () => {
  const Content = () => {
    return <Outlet />;
  };

  return (
    <Section
      sectionId={"ProductPage"}
      sectionContent={Content}
    />
  );
};

export default ProductPage;
