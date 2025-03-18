// @ts-ignore
import React, { useState } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

interface UserSignupData{
    username: string;
    first_name: string;
    last_name: string;
    password: string;
}


const Signup = () => {
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSignupForm, setUserSignupForm] = useState<UserSignupData>(
    {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
    }
  );

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSignupForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/register/", userSignupForm);
      if (response.status === 200 || 201) {
        navigate("/"); // Redirect to login page or dashboard after signup
      } else {
        setErrors(response.data || "Sign up failed");
      }
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
        <h2 className="text-2xl text-center font-light mb-4">SignUp</h2>
        <label className="text-[#c0c0c0] text-sm">First Name</label>
        <input
          type="text"
          name="first_name"
          value={userSignupForm.first_name}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={userSignupForm.last_name}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Username</label>
        <input
          type="text"
          name="username"
          value={userSignupForm.username}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Password</label>
        <input
          type="password"
          name="password"
          value={userSignupForm.password}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <button
          className="bg-[#894a8b] text-white p-2 rounded w-full"
          type="submit"
        >
          {loading ? <Spinner /> : "Sign Up"}
        </button>
        {errors && <p className="text-red-500 text-center mt-2">{errors}</p>}
        <div>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-[#894a8b]">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
