import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginRequest, forgotPasswordRequest } from "../api/auth"; // add your API function
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Forgot password modal state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotErrors, setForgotErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);

  // 🔐 FORM VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const res = await loginRequest(email, password);

    if (res.status === "success") {
      login(res.data); 
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${res.data.names}`,
        timer: 1500,
        showConfirmButton: false
      }).then(() => navigate("/dashboard"));
    } else {
      Swal.fire({ icon: "error", title: "Login Failed", text: res.message });
    }
    setLoading(false);
  };

  // 🔑 FORGOT PASSWORD VALIDATION
  const validateForgot = () => {
    const newErrors = {};
    if (!forgotEmail.trim()) {
      newErrors.forgotEmail = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
      newErrors.forgotEmail = "Invalid email format";
    }
    setForgotErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForgot()) return;

    setForgotLoading(true);
    const res = await forgotPasswordRequest(forgotEmail);

    if (res.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Check your email",
        text: "A password reset link has been sent",
      });
      setShowForgot(false);
      setForgotEmail("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message,
      });
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-800 px-4">
      {/* LOGIN FORM */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your dashboard</p>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="email here..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* FORGOT PASSWORD LINK */}
        <p
          className="text-right text-sm text-blue-600 mt-3 cursor-pointer hover:underline"
          onClick={() => setShowForgot(true)}
        >
          Forgot Password?
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          Dummy login: <b>admin@mail.com</b> / <b>123456</b>
        </p>
      </form>

      {/* FORGOT PASSWORD MODAL */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  forgotErrors.forgotEmail
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                }`}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotErrors.forgotEmail && (
                <p className="text-red-500 text-xs mt-1">{forgotErrors.forgotEmail}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {forgotLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
