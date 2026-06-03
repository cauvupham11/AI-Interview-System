import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import PasswordToggleIcon from "../components/PasswordToggleIcon";
import { ROUTES } from "../../../shared/constants/routes";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/auth.service";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";
  }

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = "Bạn cần đồng ý với điều khoản và chính sách.";
  }

  return errors;
}

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate(ROUTES.interviewSetup);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể đăng ký. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-heading">
        <h1>Tạo tài khoản</h1>
        <p>Bắt đầu luyện phỏng vấn thông minh hơn</p>
      </div>

      <form className="auth-form-fields" noValidate onSubmit={handleSubmit}>
        <AuthInput
          error={errors.fullName}
          icon="user"
          label="Họ và tên"
          name="fullName"
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Nguyễn Văn A"
          value={form.fullName}
        />
        <AuthInput
          error={errors.email}
          icon="mail"
          label="Email"
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="example@email.com"
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
        <AuthInput
          error={errors.confirmPassword}
          icon="lock"
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder="********"
          rightElement={
            <PasswordToggleIcon
              onToggle={() => setShowConfirmPassword((current) => !current)}
              visible={showConfirmPassword}
            />
          }
          type={showConfirmPassword ? "text" : "password"}
          value={form.confirmPassword}
        />

        <div>
          <label className="auth-check-row">
            <input
              checked={form.acceptTerms}
              className="auth-checkbox"
              onChange={(event) => updateField("acceptTerms", event.target.checked)}
              type="checkbox"
            />
            <span>
              Tôi đồng ý với các{" "}
              <a className="auth-link" href="#terms">
                điều khoản
              </a>{" "}
              và{" "}
              <a className="auth-link" href="#policy">
                chính sách
              </a>
            </span>
          </label>
          {errors.acceptTerms ? <p className="auth-field-error">{errors.acceptTerms}</p> : null}
        </div>

        {submitError ? <p className="auth-submit-error">{submitError}</p> : null}

        <button className="auth-submit-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>
      </form>

      <p className="auth-switch">
        Đã có tài khoản? <Link to={ROUTES.login}>Đăng nhập</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
