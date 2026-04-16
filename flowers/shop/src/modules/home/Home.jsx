import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/Productcard';

// Images
import flower1 from '../../assets/flower1.jpg';
import cake1 from '../../assets/cake1.jpg';
import gift1 from '../../assets/gift1.jpg';
import t1 from '../../assets/t1.jpg';
import f3 from '../../assets/f3.jpg';
import c2 from '../../assets/c2.jpg';
import sc1 from '../../assets/sc1.jpg';
import sc2 from '../../assets/sc2.avif';
import sc3 from '../../assets/sc3.avif';

import Homepage from '../../assets/Homepage.avif';
import img from '../../assets/img.avif';
import card from '../../assets/card.avif';
import plant from '../../assets/plant.avif';
import same from '../../assets/same.avif';
import FlowersCard from '../../assets/Flowers-card.avif';
import International from '../../assets/International.avif';

import birthday from '../../assets/birthday.avif';
import anniversary from '../../assets/anniversary.avif';
import gifthim from '../../assets/gifthim.avif';
import gifther from '../../assets/gifther.avif';

import './Home.css';

const Home = ({ onAddToCart }) => {
  const navigate = useNavigate();

  const featuredProducts = [
    { id: 1, name: 'Chocolate Truffle Cake', price: 45, category: 'cakes', description: 'Rich and decadent chocolate cake', image: cake1 },
    { id: 2, name: 'Red Rose Bouquet', price: 60, category: 'flowers', description: 'Beautiful red roses arrangement', image: flower1 },
    { id: 3, name: 'Teddy Bear Gift', price: 35, category: 'gifts', description: 'Cute teddy bear for special ones', image: t1 },
    { id: 4, name: 'Vanilla Cake', price: 40, category: 'cakes', description: 'Classic vanilla cake with cream', image: gift1 },
    { id: 5, name: 'Sunflower Bundle', price: 55, category: 'flowers', description: 'Bright sunflowers for joy', image: f3 },
    { id: 6, name: 'Chocolate Box', price: 30, category: 'gifts', description: 'Premium chocolates collection', image: c2 },
    { id: 7, name: 'Strawberry Shortcake', price: 50, category: 'cakes', description: 'Fresh strawberries with fluffy cake', image: sc1 },
    { id: 8, name: 'Tulip Mix', price: 50, category: 'flowers', description: 'Colorful tulips arrangement', image: sc2 },
    { id: 9, name: 'Luxury Gift Set', price: 75, category: 'gifts', description: 'Premium gift set with curated items', image: sc3 },
    { id: 10, name: 'Red Velvet Cake', price: 48, category: 'cakes', description: 'Elegant red velvet with cream cheese frosting', image: cake1 },
    { id: 11, name: 'White Lily Arrangement', price: 65, category: 'flowers', description: 'Elegant white lilies with greenery', image: flower1 },
    { id: 12, name: 'Perfume Gift Set', price: 55, category: 'gifts', description: 'Luxurious perfume collection for special occasions', image: t1 },
  ];

  const handleAddToCart = (product) => {
    if (onAddToCart) onAddToCart(product);
    alert(`${product.name} added to cart! 🛒`);
  };

  // Hero Slider
  const HeroSlider = () => {
    const images = [sc1, sc2, sc3];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className="hero-slider">
        <div
          className="hero-slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Slide ${index}`} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <HeroSlider />
        <h1 className="hero-title">Fresh Cakes, Beautiful Flowers & Perfect Gifts</h1>
        <p className="hero-subtitle">Your one-stop destination for celebrating life's special moments</p>

        {/* Collections Images */}
        <div className="colloction">
          <img src={FlowersCard} alt="flowers" />             
          <img src={Homepage} alt="homepage" />
          <img src={img} alt="img" />
          <img src={card} alt="card" />
          <img src={plant} alt="plant" />
          <img src={same} alt="same" />
          <img src={International} alt="international" />
        </div>

        <div className="colloction-name">
          <h3>Flowers</h3>
          <h3>Cakes</h3>
          <h3>Gifts</h3>  
          <h3>Combos</h3>
          <h3>Plants</h3>
          <h3>Same Day Delivery</h3>
          <h3>International Delivery</h3>
        </div>

        <div className="hero-buttons">
          <button className="hero-btn hero-primary-btn" onClick={() => navigate('/products')}>✨ Shop Now</button>
          <button className="hero-btn hero-secondary-btn" onClick={() => navigate('/gifts')}>🎁 View Gifts</button>
        </div>
      </section>

      {/* Shop By Occasions */}
      <section className="shop-love">
        <h2>Shop By Occasions & Relations</h2>
        <p>Surprise Your Loved Ones</p>
         </section><br/>
        <div className="love-img">
          <img src={birthday} alt="birthday" />
          <img src={anniversary} alt="anniversary" />
          <img src={gifthim} alt="gift-for-him" />
          <img src={gifther} alt="gift-for-her" />
        </div><br/>
         <div className="love-head">
          <h3 className='gift1'>Birthday</h3>
          <h3 className='gift2'>Anniversary</h3>
          <h3 className='gift3'> Gift For Him</h3>
          <h3 className='gift4'>Gift For Her</h3>
         </div>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Our Collections</h2>
        <div className="categories-grid"> 
          <div className="category-card" onClick={() => navigate('/products?category=cakes')}>
            <div className="category-header"><img src={cake1} alt="cake" /></div>
            <div className="category-body">
              <h3 className="category-name">Delicious Cakes</h3>
              <p className="category-description">Freshly baked cakes for birthdays, anniversaries, and celebrations. Custom designs available.</p>
              <button className="category-btn">Browse Cakes</button>
            </div>
          </div>

          
          

          <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={flower1} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>

            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={plant} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>



            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={c2} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>


            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={t1} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>


            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={sc3} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>



            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={f3} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>



            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={c2} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>


            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={flower1} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>


            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={flower1} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>


            <div className="category-card" onClick={() => navigate('/products?category=flowers')}>
            <div className="category-header"><img src={flower1} alt="flower" /></div>
            <div className="category-body">
              <h3 className="category-name">Beautiful Flowers</h3>
              <p className="category-description">Hand-picked fresh flowers arranged with care. Perfect for any occasion.</p>
              <button className="category-btn">Browse Flowers</button>
            </div>
          </div>

          <div className="category-card" onClick={() => navigate('/gifts')}>
            <div className="category-header"><img src={gift1} alt="gift" /></div>
            <div className="category-body">
              <h3 className="category-name">Special Gifts</h3>
              <p className="category-description">Carefully curated gifts including teddy bears, chocolates, and combo bundles.</p>
              <button className="category-btn">Browse Gifts</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
        <button className="view-all-btn" onClick={() => navigate('/products')}>View All Products →</button>
      </section>
    </div>
  );
};

export default Home;