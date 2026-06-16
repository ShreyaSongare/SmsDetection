// import { red } from "@mui/material/colors";
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//     setFieldErrors({
//       ...fieldErrors,
//       [e.target.name]: "",
//     });
//   };

//   const validateForm = () => {
//     let errors = {};

//     if (!formData.name.trim()) {
//       errors.name = "Name is required";
//     } else if (formData.name.length < 3) {
//       errors.name =  <p style={{color:"red"}}>Name must be at least 3 characters</p>
//     }

//     if (!formData.email) {
//       errors.email = "Email is required";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
//     ) {
//       errors.email =  <p style={{color:"red"}}>Invalid email format</p>
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//     } else if (
//       !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
//         formData.password
//       )
//     ) {
//       errors.password =
//         <p style={{color:"red"}}>Password must be 8+ chars, include uppercase, lowercase, number & symbol </p>
//     }

//     if (!formData.confirmPassword) {
//       errors.confirmPassword = "Confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword =  <p style={{color:"red"}}>Passwords do not match</p>
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:5001/api/auth/signup",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             name: formData.name,
//             email: formData.email,
//             password: formData.password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Signup failed");
//         return;
//       }

//       setError("");
//       navigate("/login");

//     } catch (error) {
//       setError("Server not responding");
//     }
//   };

//   return (
//     <div className="form-container">
//       <form onSubmit={handleSignup} className="premium-form">

//         <h2 className="form-title">Create Account ✨</h2>

//         {/* NAME */}
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//         {fieldErrors.name && <p className="error-text">{fieldErrors.name}</p>}

//         {/* EMAIL */}
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}

//         {/* PASSWORD */}
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         {fieldErrors.password && <p className="error-text">{fieldErrors.password}</p>}

//         {/* CONFIRM PASSWORD */}
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//         />
//         {fieldErrors.confirmPassword && (
//           <p className="error-text">{fieldErrors.confirmPassword}</p>
//         )}

//         {/* BACKEND ERROR */}
//         {error && <p className="error-text">{error}</p>}

//         {/* ✅ CENTERED BUTTON */}
//         <div className="btn-wrapper">
//           <button type="submit" className="premium-btn">
//             Signup
//           </button>
//         </div>

//         <p className="form-footer">
//           Already have an account?{" "}
//           <Link to="/login">Login</Link>
//         </p>

//       </form>
//     </div>
//   );
// }















import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 3) {
      errors.name = (
        <p style={{ color: "red" }}>
          Name must be at least 3 characters
        </p>
      );
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = (
        <p style={{ color: "red" }}>Invalid email format</p>
      );
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      errors.password = (
        <p style={{ color: "red" }}>
          Password must be 8+ chars, include uppercase, lowercase, number &
          symbol
        </p>
      );
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = (
        <p style={{ color: "red" }}>Passwords do not match</p>
      );
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setError("");
      navigate("/login");

    } catch (error) {
      setError("Server not responding");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignup} className="premium-form">

        <h2 className="form-title">Create Account ✨</h2>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        {fieldErrors.name && <p className="error-text">{fieldErrors.name}</p>}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}

        {/* PASSWORD */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        {fieldErrors.password && <p className="error-text">{fieldErrors.password}</p>}

        {/* CONFIRM PASSWORD */}
        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="error-text">{fieldErrors.confirmPassword}</p>
        )}

        {/* BACKEND ERROR */}
        {error && <p className="error-text">{error}</p>}

        <div className="btn-wrapper">
          <button type="submit" className="premium-btn">
            Signup
          </button>
        </div>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </form>
    </div>
  );
}