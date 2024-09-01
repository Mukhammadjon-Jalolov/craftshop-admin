"use client";

import Image from "next/image";
import styles from "../page.module.css";
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import exp from "constants";
import { useProduct } from '../../context/ProductContext';

interface Results {
  images: string[]; // Adjust this type based on the actual structure of your results
  categories: string[];
}

interface TempImage {
  src: string;
  file: File;
}

export default function EditProduct() {
    const { product } = useProduct();

    const mainImage = product?.imgUrl || '';

    const [mainImageSrc, setMainImageSrc] = useState(mainImage);
    const [editingImages, setEditingImages] = useState(false);
    const [editingFields, setEditingFields] = useState(false);
    const [extraImages, setExtraImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [modalImage, setModalImage] = useState<string | null>(null);

    useEffect(() => {
      if(!product) return;
      getExtraImages();
    }, []);
    
    const getExtraImages = async () => {
      try{
        const editdata = {
          itemId: product.id,
          imgUrl: product.imgUrl,
          category: product.category
        };

          // This request is done to get extra images of the product. Because produt item has only one image by default
          const fetchData = async () => {
              const response = await fetch('https://dreamlocation.uz/extraimages', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(editdata),
              });
              const results = await response.json();
              console.log('extra images received: ' + results);
              handleResults(results);
          }
          fetchData();

      } catch(error){
        console.error('Error verifying token:', error);
      }
    }

    const handleResults = (results: Results) => {
        setExtraImages(results.images);
        setCategories(results.categories);
    }

    const handleEditFields = () => {
      setEditingFields(true);
    }

    const cancelEditFields = () => {
      setEditingFields(false);
    }
    
    const handleImageClick = (src: string) => {
        setMainImageSrc(src);
    };

    const handleEditImages = () => {
      setEditingImages(true);
    };

    const cancelEditImages = () => {
      setEditingImages(false);
    }

    const handleImageDelete = (index: number) => {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const saveImageChanges = async () => {

    }

    const handleNewImageClick = (src: string) => {
      setModalImage(src);
    };
  
    const closeModal = () => {
      setModalImage(null);
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

    if (!product) {
      return <div>Loading...</div>; // You can return a loading state or redirect the user
    }

    return (
    <div>
      <header>
        <h1>Edit Product</h1>
      </header>
      <div className={styles.container}>
        <Image 
          id="mainImage" 
          src={`https://dreamlocation.uz/rasmlar/${encodeURIComponent(mainImageSrc)}`} 
          alt="Main Image" 
          className={styles.mainImage}
          unoptimized
          />

        <div className={styles.imageRow} id="imageRow">
          {extraImages.map((source, index) => (
            <div className={styles.imageWrapper} id={`imageWrapper${index}`} key={index}>
              <Image 
                src={`https://dreamlocation.uz/rasmlar/${encodeURIComponent(source)}`}
                alt={`Image ${index}`} 
                className={styles.imagePreview} 
                onClick={() => handleImageClick(source)} 
                unoptimized
              />
              
              {editingImages && (
                <div className={styles.imageControls}>
                  <button
                    type="button"
                    className={styles.deleteImageButton}
                    data-index={index}
                    data-src={source.split('/').pop()}
                    >
                      Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

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
                        onClick={() => handleNewImageClick(src)} 
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

        <div className={styles.buttonContainer}>
          {!editingImages && <button type="button"
            onClick={handleEditImages} id="editImgButton" className={styles.edit}>
              Change Images
          </button> }
          
          {editingImages && <button type="button"
            onClick={cancelEditImages}
            id="cancelImgButton" 
            style={{ display: editingImages ? 'inline-block' : 'none' }}>
              Cancel Edit
          </button> }

          {editingImages && <button type="button"
            onClick={saveImageChanges}
            id="saveImgButton" 
            style={{ display: editingImages ? 'inline-block' : 'none' }}>
              Save Images
          </button> }
        </div>

          <label htmlFor="itemId">Item ID</label> <br/>
          <input type="text" id="itemId" name="itemId" maxLength={50} value={product.id} required disabled />
          <br/>

          <label htmlFor="itemName">Name</label> <br/>
          {editingFields ? 
            <input type="text" id="itemName" name="itemName" maxLength={50} value={product.name} required /> : 
            <input type="text" id="itemName" name="itemName" maxLength={50} value={product.name} required disabled />
          }
          <br/>

          <label htmlFor="description">Description</label> <br/>
          {editingFields ? 
            <textarea id="description" name="description" maxLength={200} rows={3} required>{product.description}</textarea> : 
            <textarea id="description" name="description" maxLength={200} rows={3} required disabled>{product.description}</textarea>
          }
          <br/>

          <label htmlFor="category">Category</label> <br/>
          <select id="category" name="category" required value={product.category}>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <br/>

          <label htmlFor="price">Price:</label> <br/>
          {editingFields ? <input type="text" id="price" name="price" value={product.price} required /> : 
          <input type="text" id="price" name="price" value={product.price} required disabled />}
          <br/>

          <div className={styles.buttonContainer}>
            
            {!editingFields && <button 
              type="button" 
              id="editButton" 
              className={styles.edit} 
              onClick={handleEditFields}>
                Edit data
            </button>}

            {editingFields && <button 
              type="button" 
              id="cancelButton" 
              onClick={cancelEditFields}>
                Cancel Edit
            </button>}
            
            {editingFields && <button 
              type="submit" 
              id="saveButton" 
              onClick={cancelEditFields}>
                Save
            </button>}

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

          </div>
      </div>
    </div>
  );

}