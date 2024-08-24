import { useState, useContext } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [enteredValues, setEnteredValues] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (identifier, value) => {
    setEnteredValues((prevValue) => ({
      ...prevValue,
      [identifier]: value,
    }));
  };

  const { login } = useContext(AuthContext);

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch( process.env.REACT_APP_BACKEND_URL + "users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enteredValues),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      login(data.user, data.token);
      return <Navigate to="/" />;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <h1>Connectez-Vous</h1>
          <label>
            Vous n'avez pas de compte? <Link to="/signup">Créer un compte</Link>
          </label>
        </div>
        <form onSubmit={authSubmitHandler} className="login-form-flex">
          <div>
            <label htmlFor="email">Adresse Courriel</label>
            <input
              type="email"
              id="email"
              placeholder="Entrez votre adresse courriel"
              value={enteredValues.email}
              onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
            />
          </div>
          <div>
            <label htmlFor="password">Mot de Passe</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Entrez votre mot de passe"
              value={enteredValues.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>
          <div className="showPassword">
            <input
              type="checkbox"
              onChange={togglePasswordVisibility}
              checked={showPassword}
            />
            <label> Montrer le mot de passe</label>
          </div>
          <div>
            <button type="submit">Connectez-Vous</button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
