//src\pages\RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      setMessage(null);
      navigate('/login'); 
    } catch (error: any) {
      setMessage('Error al registrar el usuario. Intenta con otro nombre de usuario.');
    }
  };

  return (
    <div>
      <h1>Registrarse</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;
