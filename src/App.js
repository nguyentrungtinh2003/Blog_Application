import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Pages//Header";
import { UserProvider } from "./Pages/UserContext";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import "bootstrap/dist/css/bootstrap.min.css";
import UserPage from "./Pages/UserPage";
import AdminPage from "./Pages/AdminPage";
import PostManager from "./Pages/PostManage";
import Home from "./Pages/Home";
import PostDetail from "./Pages/PostDetail";
import Footer from "./Pages/Footer";
import AdminEditUser from "./Pages/AdminEditUser";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/view/:id" element={<PostDetail />} />
          <Route path="/editUser/:id" element={<AdminEditUser />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
