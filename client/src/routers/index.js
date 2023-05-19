import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "../pages/Login";
import UserSignUp from "../pages/SignUp";
import HomePage from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import ViewBook from "../pages/ViewBook";

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<UserLogin />} />
      </Routes>
      <Routes>
        <Route exact path="/signup" element={<UserSignUp />} />
      </Routes>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
      </Routes>
      <Routes>
        <Route
          exact
          path="/view/:bookId"
          element={
            <MainLayout>
              <ViewBook pageState='view'/>
            </MainLayout>
          }
        />
      </Routes>

      <Routes>
        <Route
          exact
          path="/create"
          element={
            <MainLayout>
              <ViewBook pageState='create'/>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
