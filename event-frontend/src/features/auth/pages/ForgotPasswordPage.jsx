import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import api from "../../../api/client";

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    await api.post("/auth/forgot-password", data);
    alert("Reset link sent to your email");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">🔐 Password Recovery</h2>
        <p className="auth-subtitle">We’ll send a reset link to your email</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

          <input
            {...register("email")}
            placeholder="Email"
            className="auth-input"
          />

          <button className="auth-btn">
            Send Reset Link
          </button>

          <div className="auth-links">
            <span />
            <Link to="/login">Back to login</Link>
          </div>

        </form>

      </div>
    </div>
  );
}
