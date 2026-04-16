import React from 'react';
import ProductCard from '../../components/Productcard';
import './Gifts.css';
import t2 from '../../assets/t2.jpg';
import ch1 from '../../assets/ch1.jpg';
import ch2 from '../../assets/ch2.jpg';
import f4 from '../../assets/f4.jpg';
import f5 from '../../assets/f5.jpg';
import cake2 from '../../assets/cake2.jpg';
import cake1 from '../../assets/cake1.jpg';
import c2 from '../../assets/c2.jpg';

const Gifts = ({ onAddToCart }) => {
  const giftProducts = [
    {
      id: 1,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      description: 'Cute teddy bear for special ones',
      image: t2,
    },
    {
      id: 2,
      name: 'Flower & Cake Combo',
      price: 50,
      category: 'gifts',
      description: 'Beautiful bouquet with a delicious cake',
      image: f4,
    },
    {
      id: 3,
      name: 'Romantic Gift Set',
      price: 75,
      category: 'gifts',
      description: 'A perfect combination of flowers and cake for your loved one',
      image: f5,
    },
    {
      id: 4,
      name: 'Special Occasion Bundle',
      price: 100,
      category: 'gifts',
      description: 'A delightful mix of flowers, cake, and a surprise gift',
      image: cake1,
    },
    {
      id: 5,
      name: 'Romantic Gift Set',
      price: 75,
      category: 'gifts',
      description: 'A perfect combination of flowers and cake for your loved one',
      image: f5,
    },
    {
      id: 6,
      name: 'Flower & Cake Combo',
      price: 50,
      category: 'gifts',
      description: 'Beautiful bouquet with a delicious cake',
      image: f4,
    },
    {
      id: 7,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      description: 'Cute teddy bear for special ones',
      image: t2,
    },
    {
      id: 8,
      name: 'Chocolate Box',
      price: 30,
      category: 'gifts',
      description: 'Premium chocolates collection',
      image: ch1,
    },
    {
      id: 9,
      name: 'Cake & Flower Combo',
      price: 85,
      category: 'gifts',
      description: 'Perfect gift combo package',
      image: ch2,
    },
    {
      id: 10,
      name: 'Luxury Gift Hamper',
      price: 120,
      category: 'gifts',
      description: 'Assorted cakes, flowers, and chocolates',
      image: f5,
    },
    {
      id: 11,
      name: 'Love Bundle',
      price: 95,
      category: 'gifts',
      description: 'Rose bouquet with special chocolate cake',
      image: f4,
    },
    {
      id: 12,
      name: 'Birthday Surprise Box',
      price: 75,
      category: 'gifts',
      description: 'Cake, flowers, and party supplies',
      image: cake2,
    },
    {
      id: 13,
      name: 'Anniversary Delight',
      price: 110,
      category: 'gifts',
      description: 'Elegant flowers with a decadent cake',
      image: cake1,
    },
    {
      id: 14,
      name: 'Get Well Soon Package',
      price: 80,
      category: 'gifts',
      description: 'Comforting cake and cheerful flowers',
      image: c2,
    },
    {
      id: 15,
      name: 'Congratulations Set',
      price: 90,
      category: 'gifts',
      description: 'Celebrate with this wonderful gift set',
      image: f4,

    },
    {
      id: 16,
      name: 'Thank You Gift Box',
      price: 60,
      category: 'gifts',
      description: 'Show your appreciation with this thoughtful gift',
      image: f5,
    },
    {
      id: 17,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      description: 'Cute teddy bear for special ones',
      image: t2,
    },
    {
      id: 18,
      name: 'Flower & Cake Combo',
      price: 50,
      category: 'gifts',
      description: 'Beautiful bouquet with a delicious cake',
      image: f4,
    },
    {
      id: 19,
      name: 'Romantic Gift Set',
      price: 75,
      category: 'gifts',
      description: 'A perfect combination of flowers and cake for your loved one',
      image: f5,
    },
    {
      id: 20,
      name: 'Special Occasion Bundle',
      price: 100,
      category: 'gifts',
      description: 'A delightful mix of flowers, cake, and a surprise gift',
      image: cake1,
    },
    {
      id: 21,
      name: 'Romantic Gift Set',
      price: 75,
      category: 'gifts',
      description: 'A perfect combination of flowers and cake for your loved one',
      image: f5,
    },
    {
      id: 22,
      name: 'Flower & Cake Combo',
      price: 50,
      category: 'gifts',
      description: 'Beautiful bouquet with a delicious cake',
      image: f4,
    },
    {
      id: 23,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      description: 'Cute teddy bear for special ones',
      image: t2,
    },
    {
      id: 24,
      name: 'Chocolate Box',
      price: 30,
      category: 'gifts',
      description: 'Premium chocolates collection',
      image: ch1,
    },
    {
      id: 25,
      name: 'Cake & Flower Combo',
      price: 85,
      category: 'gifts',
      description: 'Perfect gift combo package',
      image: ch2,
    },
    {
      id: 26,
      name: 'Luxury Gift Hamper',
      price: 120,
      category: 'gifts',
      description: 'Assorted cakes, flowers, and chocolates',
      image: f5,
    },
    {
      id: 27,
      name: 'Love Bundle',
      price: 95,
      category: 'gifts',
      description: 'Rose bouquet with special chocolate cake',
      image: f4,
    },
    {
      id: 28,
      name: 'Birthday Surprise Box',
      price: 75,
      category: 'gifts',
      description: 'Cake, flowers, and party supplies',
      image: cake2,
    },
    {
      id: 29,
      name: 'Anniversary Delight',
      price: 110,
      category: 'gifts',
      description: 'Elegant flowers with a decadent cake',
      image: cake1,
    },
    {
      id: 30,
      name: 'Get Well Soon Package',
      price: 80,
      category: 'gifts',
      description: 'Comforting cake and cheerful flowers',
      image: c2,
    },
    {
      id: 31,
      name: 'Congratulations Set',
      price: 90,
      category: 'gifts',
      description: 'Celebrate with this wonderful gift set',
      image: f4,

    },
    {
      id: 32,
      name: 'Thank You Gift Box',
      price: 60,
      category: 'gifts',
      description: 'Show your appreciation with this thoughtful gift',
      image: f5,
    }
  ];

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    alert(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="gifts-page">
      <div className="gifts-container">
        <div className="gifts-header">
          <h1 className="gifts-title">🎁 Perfect Gifts for Every Occasion</h1>
          <p className="gifts-subtitle">
            Curated gift bundles combining beautiful flowers, delicious cakes, and special treasures
          </p>
        </div>

        <div className="gifts-grid">
          {giftProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gifts;
