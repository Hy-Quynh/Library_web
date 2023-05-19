import * as React from "react";
import ListBook from "./components/ListBook";
import "./style.css";

function HomePage() {
  return (
    <div
      style={{ padding: "80px", background: "#f0f0f0" }}
      className="listbook-frame"
    >
      <ListBook />
    </div>
  );
}
export default HomePage;
