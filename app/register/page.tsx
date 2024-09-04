"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";
import GoogleMapComponent from '../../components/GoogleMapComponent';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendRegistrationDetails = async() => {
    const formData = new FormData();

    // Append state values to FormData
    formData.append('username', username);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    if(location){
      formData.append('lat', String(location.lat));
      formData.append('lon', String(location.lng));
    }

    try {
      // Send the formData to the server
      const response = await fetch('https://dreamlocation.uz/api/register', {
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
        <h2>Foydalanuvchi ma'lumotlari</h2>

          <div style={{ marginBottom: '5px', marginTop: '20px'}}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Foydalanuvchi nomi (login)</label>
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
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Telefon raqamingiz</label>
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

          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '5px' }}>Manzil</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '5px', position: 'relative', width: '100%' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Xaritada joyingizni belgilang</label>
            <GoogleMapComponent onLocationSelect={handleLocationSelect} selectedLocation={location} />
            {location && (
              <div>
                <p>Selected Location:</p>
                <p>Latitude: {location.lat}</p>
                <p>Longitude: {location.lng}</p>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '5px', marginTop: '20px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Ustaxona nomi</label>
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
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Parol</label>
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

          <div style={{ marginBottom: '5px', position: 'relative', width: '100%' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Parolni yana kiriting</label>
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
            Ro'yxatdan o'tish
          </button>

      </div>
    </div>
  );
}
