// @ts-ignore
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SIGNUP } from "../../navigation/routes";
import axios from "../../api/axios";
import Spinner from "../spinner/Spinner";

interface UserLoginData {
  username: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoginForm, setUserLoginForm] = useState<UserLoginData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLoginForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  // const [token, setToken] = useState<string | null>(
  //   localStorage.getItem("token")
  // );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = userLoginForm;
    setLoading(true);
    try {
      const response = await axios.post("api/token/", {
        username,
        password,
      });
      console.log(response.data);
      const token = response.data.access;
      console.log(token);
      const { refresh } = response.data;
      console.log(refresh);
      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refresh);
      // setToken(token);

      if (response.status === 200 || 201) {
        navigate("/newsfeed"); // Redirect to login page or dashboard after signup
      } else {
        setError(response.data || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-2xl w-full max-w-sm border-t-4 border-[#884b8c]"
      >
        <h2 className="text-2xl text-center font-light mb-4">Login</h2>
        <label className="text-[#c0c0c0] text-sm">Username</label>
        <input
          type="text"
          name="username"
          value={userLoginForm.username}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Password</label>
        <input
          type="password"
          name="password"
          value={userLoginForm.password}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <button
          className="bg-[#894a8b] text-white p-2 rounded w-full"
          type="submit"
        >
          {loading ? <Spinner  /> : "Log In"}
        </button>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <div>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to={SIGNUP} className="text-[#894a8b]">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
