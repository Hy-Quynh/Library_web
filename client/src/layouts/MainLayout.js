import React from "react";
import Header from "../components/Header";

export default function MainLayout(props) {
  return (
    <div
      style={{ background: "#f0f0f0", minHeight: "100vh", overflow: "auto" }}
    >
      <Header />
      {props.children}
    </div>
  );
}
