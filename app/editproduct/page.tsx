"use client";

import Image from "next/image";
import styles from "../page.module.css";
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import exp from "constants";
import { useProduct } from '../../context/ProductContext';
import LoadingOverlay from '../../components/LoadingOverlay';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  category: string;
  vendor: string;
}

interface ImageResult {
  imgUrl: string;
}

interface Results {
  images: ImageResult[];
}

interface Translations {
  nameEn: string;
  nameRu: string;
  descEn: string;
  descRu: string;
}

interface TempImage {
  src: string;
  file: File;
}

export default function EditProduct() {

    const [currentProduct, setProduct] = useState<Product>();
    const [currentOriginalProduct, setOriginalProduct] = useState<Product>();
    const [mainImageSrc, setMainImageSrc] = useState('');
    const [editingImages, setEditingImages] = useState(false);
    const [editingFields, setEditingFields] = useState(false);
    const [extraImages, setExtraImages] = useState<string[]>([]);
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [tobeDeletedImg, setDeletingImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [originalTranslations, setOriginalTranslations] = useState<Translations>();
    const [nameEn, setEnglishName] = useState('');
    const [nameRu, setRusName] = useState('');
    const [descEn, setEnglishDesc] = useState('');
    const [descRu, setRusDesc] = useState('');

    useEffect(() => {
      const storedProduct = localStorage.getItem('editingproduct');
      if (storedProduct) {
        const parsedProduct = JSON.parse(storedProduct) as Product;
        setMainImageSrc(parsedProduct.imgUrl);
        
        // This is how the editing product is read from LocalStorage
        setProduct(parsedProduct);
        setOriginalProduct(parsedProduct);  // This will be used if user Cancels editing

        getExtraImages(parsedProduct.id, parsedProduct.imgUrl); // Ensure `id` exists
        getTranslations(parsedProduct.id);

      } else {
        console.error('No product found in localStorage');
      }
    }, []);

    useEffect(() => {
      getCategories(); // Separate effect to get categories
    }, []); // Only fetch categories once on mount
    
    const getExtraImages = async (itemId: number, mainImg: string) => {
      try{
        const editdata = {
          productId: itemId
        };

        // This request is done to get extra images of the product. Because produt item has only one image by default
        const fetchData = async () => {
            const response = await fetch('https://dreamlocation.uz/getimages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editdata),
            });
            const results = await response.json();
            console.log(results);

            if(results.images){
              handleResults(results, mainImg);
            }
        }
        fetchData();

      } catch(error){
        console.error('Error getting extra images:', error);
      }
    }

    const getCategories = async () => {
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
    }

    const getTranslations = async (currentId: number) => {

      console.log("getTranslations function started");

      try{
        const response = await fetch('https://dreamlocation.uz/api/getTranslations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentId: currentId}),
        });
        const results = await response.json();
        console.log(results, " translation results and current id: ", currentId);

        setOriginalTranslations(results);

        setEnglishName(results.nameEn);
        setRusName(results.nameRu);
        setEnglishDesc(results.descEn);
        setRusDesc(results.descRu);

      } catch(error){
        console.error('Error getting translations:', error);
      }
    }

    const handleResults = (results: Results, mainImg: string) => {
      const imageUrls = results.images.map((image: ImageResult) => image.imgUrl);
      imageUrls.unshift(mainImg);
      setExtraImages(imageUrls);
      setOriginalImages(imageUrls);
    }

    const handleEditFields = () => {
      setEditingFields(true);
    }

    const cancelEditFields = () => {
      setProduct(currentOriginalProduct);
      setEditingFields(false);
    }
    
    const handleImageClick = (src: string) => {
        setMainImageSrc(src);
    };

    const handleEditImages = () => {
      setEditingImages(true);
    };

    const handleDeleteImages = (img: string) => {
      setDeletingImages((prevImages) => {
        if (prevImages.includes(img)) return prevImages;
        return [...prevImages, img];
      });
      setExtraImages((prevImages) => prevImages.filter(image => image !== img));
    };

    const cancelEditImages = () => {
      setEditingImages(false);
      setImagePreviews([]);
      setExtraImages(originalImages);
      setSelectedImages([]);
      setDeletingImages([]);

      setEnglishName(originalTranslations?.nameEn || '');
      setRusName(originalTranslations?.nameRu || '');
      setEnglishDesc(originalTranslations?.descEn || '');
      setRusDesc(originalTranslations?.descRu || '');
    }

    const handleImageDelete = (index: number) => {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const saveImageChanges = async () => {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('itemId', currentProduct!.id.toString());
      formData.append('nameUz', currentProduct!.name);
      
      selectedImages.forEach((file, index) => {
        formData.append('newImages', file);
      });
      formData.append('deletedImages', JSON.stringify(tobeDeletedImg));

      // Make the POST request
      try {
        const response = await fetch('https://dreamlocation.uz/updateimages', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Handle the response
          console.log('Images updated successfully');
          setIsLoading(false);
          window.alert('Images updated successfully');
        } else {
          console.error('Failed to update images');
        }
      } catch (error) {
        console.error('Error:', error);
      }

      console.log(selectedImages);
      console.log(tobeDeletedImg);
    }

    const saveProductDetails = async() => {
      setIsLoading(true);

      const payload = {
        itemId: currentProduct!.id,
        nameUz: currentProduct!.name,
        descUz: currentProduct!.description,

        englishName: nameEn,
        englishDesc: descEn,
        rusName: nameRu,
        rusDesc: descRu,

        category: currentProduct!.category,
        price: currentProduct!.price,
      };

      console.log("payload to update product ", payload);

      try {
        const response = await fetch('https://dreamlocation.uz/updateproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
    
        const result = await response.json();
        console.log('Response:', result);

        if (response.ok) {
          setIsLoading(false);
          alert('Images and data have been successfully updated!');
          // Setting editing false
          setEditingFields(false);
        } else {
          alert('Failed to update images and data.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
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

    if (!currentProduct) {
      return <div>Loading...</div>; // You can return a loading state or redirect the user
    }

    return (
    <div>
      <header>
        <h2><a href="/admin" > Home </a></h2>
        <h2>Edit Product</h2>
      </header>

      {isLoading && <LoadingOverlay />}
      
      <div className={styles.container}>
        <Image 
          id="mainImage" 
          src={`https://dreamlocation.uz/rasmlar/${encodeURIComponent(mainImageSrc)}`} 
          alt="Main Image" 
          className={styles.mainImage}
          unoptimized
          />

        <div className={styles.imageRow} id="imageRow">

          {extraImages.length > 0 && extraImages.map((source, index) => (
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
                    onClick={() => handleDeleteImages(source)}
                    >
                      Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {editingImages && 
        (<><label htmlFor="images">Select Images:</label>
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
                  onClick={() => handleImageDelete(index)}>
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
          </div></>)
        }

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

          <label htmlFor="itemId">ID</label> <br/>
          <input type="text" id="itemId" name="itemId" maxLength={50} value={currentProduct.id} required disabled />
          <br/>

              <label htmlFor="nameUz"><strong>Maxsulot nomi</strong></label> <br/>
              <label htmlFor="nameUz">O&apos;zbek tilida</label> <br/>
              {editingFields ? 
                <input 
                  type="text" 
                  id="nameUz" 
                  name="nameUz" 
                  maxLength={50} 
                  onChange={(e) => setProduct({ ...currentProduct, name: e.target.value })} // Update only the 'name' field
                  value={currentProduct.name} required /> : 
                <input 
                  type="text" 
                  id="nameUz" 
                  name="nameUz" 
                  maxLength={50} 
                  value={currentProduct.name} required disabled />
              }
              <br/>
              <label htmlFor="nameEn">Inglizchasi</label> <br/>
              {editingFields ? 
                <input 
                  type="text" 
                  id="nameEn" 
                  name="nameEn" 
                  maxLength={50} 
                  onChange={(e) => setEnglishName(e.target.value)} // Update only the 'name' field
                  value={nameEn} required /> : 
                <input 
                  type="text" 
                  id="nameEn" 
                  name="nameEn" 
                  maxLength={50} 
                  value={nameEn} required disabled />
              }
              <br/>
              <label htmlFor="nameRu">Ruschasi</label> <br/>
              {editingFields ? 
                <input 
                  type="text" 
                  id="nameRu" 
                  name="nameRu" 
                  maxLength={50} 
                  onChange={(e) => setRusName(e.target.value)} // Update only the 'name' field
                  value={nameRu} required /> : 
                <input 
                  type="text" 
                  id="nameRu" 
                  name="nameRu" 
                  maxLength={50} 
                  value={nameRu} required disabled />
              }
              <br/>

          <label htmlFor="description"><strong>Ta&apos;rifi</strong></label> <br/>
                <label htmlFor="description">O&apos;zbek tilida</label> <br/>
                {editingFields ? 
                  <textarea 
                    id="description" 
                    name="description" 
                    maxLength={200} 
                    rows={3}
                    value={currentProduct.description || ''} // Use value attribute to control the textarea
                    onChange={(e) => setProduct({ ...currentProduct, description: e.target.value })} // Update only the 'name' field 
                    required /> : 
                  <textarea 
                    id="description" 
                    name="description" 
                    maxLength={200} 
                    rows={3} 
                    required disabled>{currentProduct.description}</textarea>
                }
                <br/>
                <label htmlFor="descriptionEn">Inglizchasi</label> <br/>
                  {editingFields ? 
                    <textarea 
                      id="descriptionEn" 
                      name="descriptionEn" 
                      maxLength={200} 
                      rows={3}
                      value={descEn} // Use value attribute to control the textarea
                      onChange={(e) => setEnglishDesc(e.target.value)} // Update only the 'name' field 
                      required /> : 
                    <textarea 
                      id="descriptionEn" 
                      name="descriptionEn" 
                      maxLength={200} 
                      rows={3} 
                      value={descEn}
                      required disabled />
                  }
                <br/>
                <label htmlFor="descriptionRu">Ruschasi</label> <br/>
                  {editingFields ? 
                    <textarea 
                      id="descriptionRu" 
                      name="descriptionRu" 
                      maxLength={200} 
                      rows={3}
                      value={descRu} // Use value attribute to control the textarea
                      onChange={(e) => setRusDesc(e.target.value)} // Update only the 'name' field 
                      required /> : 
                    <textarea 
                      id="descriptionRu" 
                      name="descriptionRu" 
                      maxLength={200} 
                      rows={3} 
                      value={descRu}
                      required disabled />
                  }
                <br/>

          <label htmlFor="category">Kategoriya</label> <br/>
          {editingFields ? 
            <select 
              id="category" 
              name="category" 
              value={currentProduct.category}
              onChange={(e) => setProduct({ ...currentProduct, category: e.target.value })} // Update selected category
              required>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                    {category}
                </option>
              ))}
            </select> : 
            <select id="category" name="category" required value={currentProduct.category} disabled>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select> }
          <br/>

          <label htmlFor="price">Narxi</label> <br/>
            {editingFields ? 
              <input
                type="number" 
                id="price" 
                name="price" 
                value={currentProduct.price} 
                onChange={(e) => setProduct({ ...currentProduct, price: Number(e.target.value) })} // Update only the 'name' field
                required /> : 
              <input type="text" id="price" name="price" value={currentProduct.price} required disabled />}
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
              onClick={saveProductDetails}>
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