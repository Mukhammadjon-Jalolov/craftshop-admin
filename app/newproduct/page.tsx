"use client";

import React, { useState, ChangeEvent, useEffect, FormEvent } from 'react';
import Image from "next/image";
import styles from "../page.module.css";
import LoadingOverlay from '../../components/LoadingOverlay';

interface CreateProductProps {
  categories: string[];
}

export default function CreateProduct() {
    
  const [itemName, setItemName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('-');
  const [price, setPrice] = useState<string>('');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('https://dreamlocation.uz/getcategories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const results = await response.json();
        setCategories(results.categories);
    }
    fetchData();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);

    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('https://dreamlocation.uz/createproduct', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.info);
        // Optionally reset form fields here
      } else {
        const errorResult = await response.text(); // Use text() to get non-JSON responses
        alert(`Failed to add product: ${errorResult}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    } finally {
        setIsLoading(false);
        setItemName('');
        setDescription('');
        setCategory('-');
        setPrice('');
        setSelectedImages([]);
    }
};


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages(prev => [...prev, ...newImages]);

      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = ''; // Reset the input
  };

  const handleImageDelete = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageClick = (src: string) => {
    setModalImage(src);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div>
        <header>
            <h1>Create product</h1>
        </header>

        {isLoading && <LoadingOverlay />}

        <div className={styles.container}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

            <label htmlFor="itemName">Item Name:</label>
            <input 
                type="text" 
                id="itemName" 
                name="itemName" 
                maxLength={50} 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)} 
                required />

            <br/>
            <label htmlFor="description">Description:</label>
            <br/>
            <textarea 
                id="description" 
                name="description" 
                maxLength={200} 
                rows={3} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required />
            <br/>

            <label htmlFor="category">Category:</label>
            <select
                id="category" 
                name="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required>
                {categories.map(category => (
                    <option key={category} value={category}>
                    {category}
                    </option>
                ))}
            </select>

            <label htmlFor="price">Price:</label>
            <input 
                type="text" 
                id="price" 
                name="price" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required />

            <label htmlFor="images">Select Images:</label>
            <input 
                type="file" 
                id="images" 
                name="images" 
                multiple 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageChange} />

            <div className={styles.imagePreview} id="imagePreview">
              {imagePreviews.map((src, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                    <Image 
                        src={src} 
                        alt={`Preview ${index}`} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleImageClick(src)} 
                        unoptimized />
                    <div 
                        className={styles.deleteIcon} 
                        style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} 
                        onClick={() => handleImageDelete(index)} >
                        X
                    </div>
                  </div>
              ))}
              <div id={styles.addImageContainer}>
                  <button 
                  type="button" 
                  id={styles.addImageButton} 
                  className="btn-select" 
                  onClick={() => document.getElementById('images')?.click()}
                  >
                  Add Image
                  </button>
              </div>
            </div>

            {modalImage && (
            <div id="imageModal" className={styles.modal} style={{ display: 'block' }}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <div className={styles.modalContent}>
                <Image 
                    id="modalImage" 
                    src={modalImage} 
                    alt="Modal Preview"
                    unoptimized />
                </div>
            </div>
            )}

            <button type="submit">Save new product</button>
        </form>
        </div>

    </div>
  );
};
