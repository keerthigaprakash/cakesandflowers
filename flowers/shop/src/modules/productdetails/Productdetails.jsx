import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../productdetails/productdetails.css';
import c1 from '../../assets/c1.jpg';
import c2 from '../../assets/c2.jpg';
import cake1 from '../../assets/cake1.jpg';
import cake2 from '../../assets/cake2.jpg';
import f2 from '../../assets/f2.jpg';
import f3 from '../../assets/f3.jpg';
import f4 from '../../assets/f4.jpg';
import f5 from '../../assets/f5.jpg';

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Sample product details
  const productDetailsData = {
    1: {
      id: 1,
      name: 'Chocolate Truffle Cake',
      price: 45,
      category: 'cakes',
      rating: 4.8,
      reviews: 245,
      description: 'Indulge in our rich and decadent chocolate truffle cake. Made with premium Belgian chocolate and topped with chocolate truffles.',
      fullDescription: 'This exquisite chocolate truffle cake is perfect for chocolate lovers. Each slice melts in your mouth with layers of chocolate sponge, silky chocolate mousse, and crispy chocolate truffles.',
      features: ['Serves 6-8 people', 'Made with premium Belgian chocolate', 'No artificial colors', 'Available for same-day delivery', 'Customizable message'],
      image:c1,
    },
    2: {
      id: 2,
      name: 'Red Rose Bouquet',
      price: 60,
      category: 'flowers',
      rating: 4.9,
      reviews: 312,
      description: 'Beautiful arrangement of 12 fresh red roses, carefully selected and wrapped with love.',
      fullDescription: 'Our exclusive red rose bouquet features 12 premium long-stem roses hand-picked from the finest growers. Each bouquet is wrapped in elegant packaging.',
      features: ['12 premium red roses', 'Fresh and fragrant', 'Includes free vase', 'Free greeting card', 'Same-day delivery available'],
      image: c2,
    },
    3: {
      id: 3,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      rating: 4.7,
      reviews: 189,
      description: 'Adorable stuffed teddy bear, perfect for any occasion.',
      fullDescription: 'A soft and cuddly teddy bear that makes the perfect gift for loved ones. Made with premium quality plush material.',
      features: ['Soft premium plush', 'Hypoallergenic', '12 inches tall', 'Perfect for all ages', 'Gift-wrapped packaging'],
      image: cake1,
    },
    4: {
      id: 4,
      name: 'Get Well Soon Package',
      price: 80,
      category: 'gifts',
      rating: 4.6,
      reviews: 156,
      description: 'Comforting cake and cheerful flowers',
      fullDescription: 'A thoughtful gift to brighten someone\'s day. Includes a comforting cake and cheerful flowers.',
      features: ['Delightful cake', 'Cheerful flowers', 'Free personalized message', 'Same-day delivery available'],
      image: f2,
    },
    5: {
      id: 5,
      name: 'Anniversary Delight',
      price: 110,
      category: 'gifts',
      rating: 4.9,
      reviews: 98,
      description: 'Elegant flowers with a decadent cake',
      fullDescription: 'Celebrate your special day with our Anniversary Delight package, featuring elegant flowers and a decadent cake.',
      features: ['Elegant flower arrangement', 'Decadent cake', 'Free anniversary card', 'Same-day delivery available'],
      image: cake2,
    },
    6: {
      id: 6,
      name: 'Sunflower Bundle',   
      price: 55,
      category: 'flowers',
      rating: 4.8,
      reviews: 210,
      description: 'Bright sunflowers for joy',
      fullDescription: 'Our vibrant sunflower bundle is sure to bring joy and sunshine to any occasion. Each bouquet includes 10 fresh sunflowers.',
      features: ['10 fresh sunflowers', 'Bright and cheerful', 'Includes free vase', 'Free greeting card', 'Same-day delivery available'],
      image: f3,
    },
    7: {
      id: 7,
      name: 'Tulip Mix',
      price: 50,
      category: 'flowers',
      rating: 4.7,
      reviews: 175,
      description: 'Colorful tulips arrangement',
      fullDescription: 'A beautiful mix of colorful tulips, perfect for brightening up any space. Each bouquet includes 15 fresh tulips in various colors.',
      features: ['15 fresh tulips', 'Colorful mix', 'Includes free vase', 'Free greeting card', 'Same-day delivery available'],
      image: f4,
    },
      8: {  
      id: 8,
      name: 'Chocolate Box',
      price: 30,
      category: 'gifts',
      rating: 4.5,
      reviews: 120,
      description: 'Premium chocolates collection',
      fullDescription: 'Indulge in our premium chocolates collection, featuring a variety of rich and decadent chocolates made with the finest ingredients.',
      features: ['Assorted premium chocolates', 'Made with high-quality ingredients', 'Perfect for gifting', 'Gift-wrapped packaging', 'Same-day delivery available'],
      image: f5,
      },
     };

  const product = productDetailsData[id] || productDetailsData[1];

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    if (onAddToCart) {
      onAddToCart(cartItem);
    }
    alert(`${product.name} (x${quantity}) added to cart! 🛒`);
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-details-content">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-large-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <h1>{product.name}</h1>
            <div className="product-rating">
              ⭐ {product.rating} ({product.reviews} reviews)
            </div>

            <div className="product-price-section">
              <span className="product-price-large">${product.price.toFixed(2)}</span>
              <span className="product-category-badge">
                {product.category === 'cakes' && '🎂 Cakes'}
                {product.category === 'flowers' && '🌹 Flowers'}
                {product.category === 'gifts' && '🎁 Gifts'}
              </span>
            </div>

            <div className="product-description-section">
              <h3>Description</h3>
              <p>{product.fullDescription}</p>
            </div>

            <div className="product-features">
              <h3>✨ Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-input">
                <button onClick={() => handleQuantityChange(quantity - 1)}>−</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
              </div>
              <span style={{ marginLeft: 'auto', fontWeight: '600', color: 'var(--dark-purple)' }}>
                Total: ${(product.price * quantity).toFixed(2)}
              </span>
            </div>

            <div className="add-to-cart-section">
              <button className="add-to-cart-large-btn" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <button className="wishlist-btn">❤️ Wishlist</button>
            </div>

            <button
              style={{
                
                padding: '12px',
                background: 'white',
                border: '2px solid var(--dark-purple)',
                color: '#cc9be9 !important',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                marginTop: '15px',
              }}
              onClick={() => navigate('/products')}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
