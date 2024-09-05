"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";

export default function ConfirmPage() {
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendRegistrationDetails = async() => {
    const formData = new FormData();

    // Append state values to FormData
    formData.append('confirmationCode', code);

    try {
      // Send the formData to the server
      const response = await fetch('https://dreamlocation.uz/api/confirmation', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (result.success) {
        alert('Images and data have been successfully updated!');
      } else {
        alert('Failed to update images and data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Craft Shop Admin Page</h1>
      </header>
      <div className={styles.container}>
        <h2>Tasdiqlash uchun SMS kodni kiriting</h2>

          <div style={{ marginBottom: '5px', position: 'relative', width: '100%' }}>
            <label htmlFor="code" style={{ display: 'block', marginBottom: '5px' }}>SMS kod</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          
          <button
            type="submit"
            onClick={sendRegistrationDetails}
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
            Kodni tasdiqlash
          </button>

      </div>
    </div>
  );
}
