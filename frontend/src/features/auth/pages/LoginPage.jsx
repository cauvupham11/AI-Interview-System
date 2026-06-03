import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../../../assets/google.svg";
import AuthInput from "../components/AuthInput";
import PasswordToggleIcon from "../components/PasswordToggleIcon";
import { ROUTES } from "../../../shared/constants/routes";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/auth.service";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  return errors;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: form.email,
        password: form.password,
      });
      navigate(ROUTES.interviewSetup);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể đăng nhập. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-card">
      <div className="login-form-heading">
        <h1>Đăng nhập</h1>
        <p>Tiếp tục buổi luyện phỏng vấn của bạn</p>
      </div>

      <form className="login-form-fields" noValidate onSubmit={handleSubmit}>
        <AuthInput
          error={errors.email}
          icon="mail"
          label="Email"
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="example@company.com"
          type="email"
          value={form.email}
        />
        <AuthInput
          error={errors.password}
          icon="lock"
          label="Mật khẩu"
          name="password"
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="********"
          rightElement={
            <PasswordToggleIcon
              onToggle={() => setShowPassword((current) => !current)}
              visible={showPassword}
            />
          }
          type={showPassword ? "text" : "password"}
          value={form.password}
        />

        <div className="login-options-row">
          <label className="auth-check-row">
            <input
              checked={form.remember}
              className="auth-checkbox"
              onChange={(event) => updateField("remember", event.target.checked)}
              type="checkbox"
            />
            Ghi nhớ đăng nhập
          </label>
          <a className="auth-link" href="#forgot">
            Quên mật khẩu?
          </a>
        </div>

        {submitError ? <p className="auth-submit-error">{submitError}</p> : null}

        <button className="login-submit-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          <span aria-hidden="true">↪</span>
        </button>
      </form>

      <div className="login-divider">
        <span />
        <p>HOẶC ĐĂNG NHẬP VỚI</p>
        <span />
      </div>

      <button className="google-login-button" disabled type="button">
        <img className="google-icon" src={googleLogo} alt="" aria-hidden="true" />
        Google Account
      </button>

      <p className="login-register-link">
        Chưa có tài khoản? <Link to={ROUTES.register}>Đăng ký ngay</Link>
      </p>
    </div>
  );
}

export default LoginPage;
