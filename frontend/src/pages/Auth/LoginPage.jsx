import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Llamamos a la función login del contexto pasándole las credenciales
      await login(email, password);
      // Si llega aquí, es que fue exitoso
      navigate("/dashboard");
    } catch (err) {
      // Si falla (401, 500, etc.), capturamos el mensaje del backend
      console.error("LOGIN ERROR:", err);
      setError(err.response ? JSON.stringify(err.response.data) : err.message);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2>Bienvenido 🛠️</h2>
          <p>Ingresa a tu panel de control</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}

          <div>
            <label>Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}
