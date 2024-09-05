"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('https://dreamlocation.uz/api/forgotpass', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, phoneNumber }),
    });

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      const { token } = data;
      
      localStorage.setItem('token', token); // Save token in localStorage
      // Handle successful login, for example, redirect to another page
      router.push('/admin');

    } else {
      // Handle login error
      alert('Login failed. Please check your credentials and try again.');
      console.log("response not ok" + response.text())
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Craft Shop Admin Page</h1>
      </header>
      <div className={styles.container}>
        <h2>Parolni tiklash</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '5px', marginTop: '20px' }}>
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
          
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              pattern="[0-9]{12}"
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
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
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}
