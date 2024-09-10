"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // Send login request to server
        const response = await fetch('https://dreamlocation.uz/api/login', {
            method: 'POST',
            credentials: 'include', // Allows cookies (if used)
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Parse response
        const result = await response.json();

        // Check if the request was successful
        if (response.ok) {
            const { token } = result;

            // Save token in localStorage
            localStorage.setItem('token', token);
            setIsLoading(false);
            // Redirect user to the admin page after successful login
            router.push('/admin');
        } else {
            // If login fails, alert the user and log the issue
            alert('Login failed. Please check your credentials and try again.');
            console.log("Login error:", result?.message || result?.error || "Unknown error");
        }
    } catch (error) {
        // Handle any unexpected errors during the login process
        console.error("Error during login:", error);
        alert('An error occurred. Please try again later.');
    }
};

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Craft Shop Admin Page</h1>
      </header>
      
      <div className={styles.container}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '5px', position: 'relative', width: '100%' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: 'auto' }}>
            <a href="/register" style={{ textDecoration: 'none', color: 'blue' }}>Register</a>
            <a href="/forgot-password" style={{ textDecoration: 'none', color: 'blue' }}>Forgot Password</a>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
