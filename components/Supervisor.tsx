"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Craft Shop Supervisor Page</h1>
      </header>
      
      <div className={styles.container}>
        <h2>Supervisor page</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: 'auto' }}>
            <a href="/register" style={{ textDecoration: 'none', color: 'blue' }}>Products</a>
            <a href="/forgot-password" style={{ textDecoration: 'none', color: 'blue' }}>Shoppers</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: 'auto' }}>
            <a href="/register" style={{ textDecoration: 'none', color: 'blue' }}>Pending shoppers</a>
            <a href="/forgot-password" style={{ textDecoration: 'none', color: 'blue' }}>Monitoring</a>
        </div>

      </div>
    </div>
  );
}
