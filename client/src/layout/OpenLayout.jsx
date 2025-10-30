import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import ScrollToTop from "../utils/ScrollToTop";
import WebSocketIndicator from "../components/WebSocketIndicator";

export const OpenLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <WebSocketIndicator />
      {/* <Footer /> */}
    </>
  );
};
