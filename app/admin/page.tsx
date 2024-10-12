"use client";

import Image from "next/image";
import styles from "../page.module.css";
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useProduct } from '../../context/ProductContext';
import Supervisor from '../../components/Supervisor';

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  category: string;
  vendor: string;
}

export default function Home() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token');

    try{
      if (token) {

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const role = decodedToken.role;

        if(role == 'admin'){
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        // Make authenticated requests or handle token
        const fetchData = async () => {
          const response = await fetch('https://dreamlocation.uz/verify-token', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
          });
  
          if(response.ok){
            getAllData();
          } else {
            setIsAdmin(false);
            router.push('/login');
          }
        }
        fetchData();
      } else {
        router.push('/login');
      }
    } catch(error){
      console.error('Error verifying token:', error);
      router.push('/login');
    }
  }, [router]);

  const getAllData = async () => {
    try {
      const response = await fetch('https://dreamlocation.uz/api/data');
      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Error fetching items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleEditClick = (item: Item) => {
    console.log(item);
    //setProduct(item);
    localStorage.removeItem('editingproduct');
    localStorage.setItem('editingproduct', JSON.stringify(item));
    if(localStorage.getItem('editingproduct')){
      router.push('/editproduct');
    }
  }

  return (
    <>
    {isAdmin ? <Supervisor /> : 
    <>
    <header>
      <h1>Admin Page</h1>
      <a href="/logout" className={styles.logout}>Logout</a>
    </header>
      <div className={styles.container}>
        <a href="/newproduct">Add Item</a>
        <div className={styles.cards}>
          {items.map(item => (
            <div key={item.id} className={styles.card}>
              <Image
                src={`https://dreamlocation.uz/rasmlar/${encodeURIComponent(item.imgUrl)}`}
                alt={item.name}
                unoptimized />
              <div className={styles.cardContent}>
                <div className={styles.cardDetails}>
                  <div className={styles.cardTitle}>{item.name}</div>
                  <div className={styles.cardDescription}>{item.description}</div>
                  <div className={styles.cardPrice}>Narxi: {item.price}</div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.edit}
                    onClick={() => handleEditClick(item)}
                    style={{
                      padding: '8px 16px',
                      marginRight: '10px',
                      backgroundColor: '#0070f3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button className={styles.delete} onClick={() => console.log('Delete functionality here')}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div></>
    }
    </>
  );
}
