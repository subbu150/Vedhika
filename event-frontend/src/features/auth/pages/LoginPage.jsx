import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api";
import { useAuthStore } from "../auth.store";
import { useNavigate, Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(loginSchema),
});

  const { mutate, isPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (res) => {
      setAuth(res);
      console.log("goint to dashbasord");
      console.log(res);
      if(res.user.role === "admin" || res.user.role === "organizer"){
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      
    },
    onError: (err) => {
  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log(err.response.data);
  alert(err.response.data.message);
}

  });

return (
  <div className="auth-page">
    <div className="auth-card">

      <h2 className="auth-title"><b>వేధిక</b></h2>
      <p className="auth-subtitle">Enter the control center</p>

      <form onSubmit={handleSubmit(mutate)} className="auth-form">

       <input {...register("email")} className="auth-input" placeholder="Email" />
{errors.email && <p className="error">{errors.email.message}</p>}

<input type="password" {...register("password")} className="auth-input" placeholder="Password" />
{errors.password && <p className="error">{errors.password.message}</p>}

        <button disabled={isPending} className="auth-btn">
          {isPending ? "Logging in..." : "Login"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>

      </form>
    </div>
  </div>
);


}
