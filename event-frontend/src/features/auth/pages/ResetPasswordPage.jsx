import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../api/client";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    await api.post(`/auth/reset-password/${token}`, {
      password: data.password,
    });

    alert("Password updated successfully");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">🚀 Reset Password</h2>
        <p className="auth-subtitle">Set a new secure password</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

          <input
            type="password"
            {...register("password")}
            placeholder="New Password"
            className="auth-input"
          />

          <button className="auth-btn">
            Reset Password
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
