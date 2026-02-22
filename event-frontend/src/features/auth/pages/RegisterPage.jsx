import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api";
import { useAuthStore } from "../auth.store";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  /* ✅ SAME AS LOGIN BUT WITH registerSchema */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerRequest,
    onSuccess: (res) => {
      setAuth(res); // auto login
      navigate("/");
    },
    onError: (err) => {
      console.log(err)
      alert(err.response?.data?.message || "Registration failed");
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">🛰️ Create Account</h2>
        <p className="auth-subtitle">Join the mission control</p>

        <form onSubmit={handleSubmit(mutate)} className="auth-form">

          {/* NAME */}
          <input
            {...register("name")}
            placeholder="Full Name"
            className="auth-input"
          />
          {errors.name && (
            <p className="error">{errors.name.message}</p>
          )}

          {/* EMAIL */}
          <input
            {...register("email")}
            placeholder="Email"
            className="auth-input"
          />
          {errors.email && (
            <p className="error">{errors.email.message}</p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="auth-input"
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}

          <button disabled={isPending} className="auth-btn">
            {isPending ? "Creating..." : "Register"}
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
