"use client";

import Image from "next/image";
import styles from "../page.module.css";
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';


export default function LogoutPage(){

    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem('editingproduct');
        localStorage.removeItem('regprocess');
        localStorage.removeItem('token');
    
        router.push('/login');
    }, []);

    return(
        <>
            <header>
                <h1>CraftShop App</h1>
            </header>
            <div className={styles.container}>
            </div>
        </>
    );
}