import React, { useEffect, useState } from "react";
import "./Profil.css";
import SideBar from "../SideBar/SideBar.jsx";
import { useAuthContext } from "../../hooks/useAuthContext.js";

export default function Profil() {
  const { user, token } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `users/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setEmail(data.user.email);
          setUsername(data.user.username);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUser();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const updateUser = async () => {
    try {
      const response = await fetch( process.env.REACT_APP_BACKEND_URL + `users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          email: email
        })
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.error);
      }

      setError("Profil mis à jour");

    } catch (error) {
      console.error('Failed to update user:', error);
      setError(error.message);
    }
  };

  return (
    <>
      <SideBar />
      <div className="user-data">
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={updateUser}>Sauvegarder les modifications</button>
        { error && <div className="error">{error}</div> }
      </div>
    </>
  );
}