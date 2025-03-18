// @ts-ignore
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ADMIN, NEWSDETAILS, NEWSFEED, SIGNUP } from "./navigation/routes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Newsfeed from "./pages/Newsfeed";
import NewsDetail from "./pages/NewsDetail";
import AdminPage from "./components/admin/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={SIGNUP} element={<Signup />} />

        <Route path={NEWSFEED} element={<Newsfeed />} />

        <Route path={NEWSDETAILS} element={<NewsDetail />} />

        <Route path={ADMIN} element={<AdminPage />} />

        {/* Redirect to login if no matching route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
