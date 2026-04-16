import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/Productcard';
import './Products.css';
import ch1 from '../../assets/ch1.jpg';
import ch2 from '../../assets/ch2.jpg';
import img from '../../assets/img.avif';
import f2 from '../../assets/f2.jpg';
import f3 from '../../assets/f3.jpg';
import f4 from '../../assets/f4.jpg';
import f5 from '../../assets/f5.jpg';
import cake1 from '../../assets/cake1.jpg';
import cake2 from '../../assets/cake2.jpg';
import cakeHome from '../../assets/cake-home.avif';
import c1 from '../../assets/c1.jpg';
import c2 from '../../assets/c2.jpg';
import t2 from '../../assets/t2.jpg';



const Products = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  
  // Update selectedCategory when URL query params change
  useEffect(() => {
    const category = searchParams.get('category') || '';
    setSelectedCategory(category);
  }, [searchParams]);
  
  // Sample products data
  const allProducts = [
    {
      id: 1,
      name: 'Chocolate Truffle Cake',
      price: 45,
      category: 'cakes',
      description: 'Rich and decadent chocolate cake',
      image: ch1,
    },
    {
      id: 2,
      name: 'Vanilla Cake',
      price: 40,
      category: 'cakes',
      description: 'Classic vanilla cake with cream',
      image: ch2,
    },
    {
      id: 3,
      name: 'Strawberry Shortcake',
      price: 50,
      category: 'cakes',
      description: 'Fresh strawberries with fluffy cake',
      image: img,
    },
    {
      id: 4,
      name: 'Red Rose Bouquet',
      price: 60,
      category: 'flowers',
      description: 'Beautiful red roses arrangement',
      image: f2,
    },
    {
      id: 5,
      name: 'Sunflower Bundle',
      price: 55,
      category: 'flowers',
      description: 'Bright sunflowers for joy',
      image: f3,
    },
    {
      id: 6,
      name: 'Tulip Mix',
      price: 50,
      category: 'flowers',
      description: 'Colorful tulips arrangement',
      image: f4,
    },
    {
      id: 7,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      description: 'Cute teddy bear for special ones',
      image: f5,
    },
    {
      id: 8,
      name: 'Chocolate Box',
      price: 30,
      category: 'gifts',
      description: 'Premium chocolates collection',
      image: ch2,
    },
     {
      id: 9,
      name: 'Chocolate Truffle Cake',
      price: 45,
      category: 'cakes',
      description: 'Rich and decadent chocolate cake',
      image: ch1,
    },
    {
      id: 10,
      name: 'Vanilla Cake',
      price: 40,
      category: 'cakes',
      description: 'Classic vanilla cake with cream',
      image: ch2,
    },
    {
      id: 11,
      name: 'Strawberry Shortcake',
      price: 50,
      category: 'cakes',
      description: 'Fresh strawberries with fluffy cake',
      image: img,
    },
    {
      id: 12,
      name: 'Red Rose Bouquet',
      price: 60,
      category: 'flowers',
      description: 'Beautiful red roses arrangement',
      image: f2,
    },
    {
      id: 13,
      name: 'Sunflower Bundle',
      price: 55,
      category: 'flowers',
      description: 'Bright sunflowers for joy',
      image: f3,
    },
    {
      id: 14,
      name: 'Tulip Mix',
      price: 50,
      category: 'flowers',
      description: 'Colorful tulips arrangement',
      image: f4,
    },
    {
      id: 15,
      name: 'Teddy Bear Gift',
      price: 35,
      category: 'gifts',
      description: 'Cute teddy bear for special ones',
      image: f5,
    },
    {
      id: 16,
      name: 'Chocolate Box',
      price: 30,
      category: 'gifts',
      description: 'Premium chocolates collection',
      image: ch2,
    },
    {
      id: 17,
      name: 'Red Velvet Cake',
      price: 48,
      category: 'cakes',
      description: 'Elegant red velvet with cream cheese frosting',
      image: cake1,
    },
    {
      id: 18,
      name: 'Carrot Cake',
      price: 42,
      category: 'cakes',
      description: 'Moist carrot cake with nuts and spices',
      image: cake2,
    },
    {
      id: 19,
      name: 'Cheesecake',
      price: 55,
      category: 'cakes',
      description: 'Creamy New York style cheesecake',
      image: cakeHome,
    },
    {
      id: 20,
      name: 'Black Forest Cake',
      price: 52,
      category: 'cakes',
      description: 'Chocolate cake with cherries and cream',
      image: c1,
    },
    {
      id: 21,
      name: 'Lemon Drizzle Cake',
      price: 38,
      category: 'cakes',
      description: 'Fresh lemon cake with zesty glaze',
      image: c2,
    },
    {
      id: 22,
      name: 'Tiramisu Cake',
      price: 50,
      category: 'cakes',
      description: 'Italian inspired layered tiramisu cake',
      image: cake1,
    },
    {
      id: 23,
      name: 'Chocolate Mousse Cake',
      price: 46,
      category: 'cakes',
      description: 'Light and fluffy chocolate mousse',
      image: cake2,
    },
    {
      id: 24,
      name: 'Coconut Cake',
      price: 43,
      category: 'cakes',
      description: 'Tropical coconut cake with white frosting',
      image: cakeHome,
    },
    {
      id: 25,
      name: 'Pistachio Cake',
      price: 49,
      category: 'cakes',
      description: 'Nutty pistachio cake with truffle filling',
      image: c1,
    },
    {
      id: 26,
      name: 'Matcha Green Tea Cake',
      price: 47,
      category: 'cakes',
      description: 'Delicate matcha green tea cake',
      image: c2,
    },
    {
      id: 27,
      name: 'Blueberry Cheesecake',
      price: 54,
      category: 'cakes',
      description: 'Creamy cheesecake with fresh blueberries',
      image: cake1,
    },
    {
      id: 28,
      name: 'Marble Cake',
      price: 41,
      category: 'cakes',
      description: 'Swirled vanilla and chocolate marble cake',
      image: cake2,
    },
    {
      id: 29,
      name: 'Strawberry Cake',
      price: 51,
      category: 'cakes',
      description: 'Fresh strawberry cake with buttercream frosting',
      image: ch1,
    },
    {
      id: 30,
      name: 'Mango Cake',
      price: 44,
      category: 'cakes',
      description: 'Tropical mango cake with light sponge',
      image: ch2,
    },
    {
      id: 31,
      name: 'Butterscotch Cake',
      price: 48,
      category: 'cakes',
      description: 'Delicious butterscotch cake with toffee bits',
      image: t2,
    },
    {
      id: 32,
      name: 'Raspberry Truffle Cake',
      price: 56,
      category: 'cakes',
      description: 'Elegant raspberry and dark chocolate combination',
      image: cakeHome,
    },
    {
      id: 33,
      name: 'Pineapple Upsidedown Cake',
      price: 39,
      category: 'cakes',
      description: 'Classic pineapple upsidedown cake',
      image: cake1,
    },
    {
      id: 34,
      name: 'Walnut Spice Cake',
      price: 45,
      category: 'cakes',
      description: 'Aromatic walnut spice cake with cream',
      image: cake2,
    },
    {
      id: 35,
      name: 'White Lily Arrangement',
      price: 65,
      category: 'flowers',
      description: 'Elegant white lilies with greenery',
      image: f2,
    },
    {
      id: 36,
      name: 'Pink Rose Garden',
      price: 58,
      category: 'flowers',
      description: 'Beautiful pink roses in a garden style',
      image: f3,
    },
    {
      id: 37,
      name: 'Lavender Dreams',
      price: 52,
      category: 'flowers',
      description: 'Soothing lavender flower arrangement',
      image: f4,
    },
    {
      id: 38,
      name: 'Cherry Blossom Mix',
      price: 54,
      category: 'flowers',
      description: 'Delicate cherry blossoms with branches',
      image: f5,
    },
    {
      id: 39,
      name: 'Peony Romance',
      price: 70,
      category: 'flowers',
      description: 'Gorgeous peonies in romantic arrangement',
      image: f2,
    },
    {
      id: 40,
      name: 'Orchid Paradise',
      price: 65,
      category: 'flowers',
      description: 'Exotic orchids in beautiful display',
      image: f3,
    },
    {
      id: 41,
      name: 'Daisy Delight',
      price: 48,
      category: 'flowers',
      description: 'Cheerful daisies for any occasion',
      image: f4,
    },
    {
      id: 42,
      name: 'Hydrangea Heaven',
      price: 62,
      category: 'flowers',
      description: 'Full hydrangea blooms in vibrant colors',
      image: f5,
    },
    {
      id: 43,
      name: 'Carnation Celebration',
      price: 50,
      category: 'flowers',
      description: 'Festive carnation mix with ribbons',
      image: f2,
    },
    {
      id: 44,
      name: 'Iris Elegance',
      price: 60,
      category: 'flowers',
      description: 'Stunning iris flowers in purple and blue',
      image: f3,
    },
    {
      id: 45,
      name: 'Sunburst Bouquet',
      price: 56,
      category: 'flowers',
      description: 'Bright and vibrant mixed flower bouquet',
      image: f4,
    },
    {
      id: 46,
      name: 'Romantic Heartbeat',
      price: 68,
      category: 'flowers',
      description: 'Heart-shaped arrangement with red flowers',
      image: f5,
    },
    {
      id: 47,
      name: 'Magnolia Bliss',
      price: 63,
      category: 'flowers',
      description: 'Stunning magnolia flowers with elegant stems',
      image: f2,
    },
    {
      id: 48,
      name: 'Wildflower Meadow',
      price: 51,
      category: 'flowers',
      description: 'Natural wildflower mix for a rustic look',
      image: f3,
    },
    {
      id: 49,
      name: 'Coral Beauty',
      price: 59,
      category: 'flowers',
      description: 'Warm coral toned flower arrangement',
      image: f4,
    },
    {
      id: 50,
      name: 'Golden Sunset',
      price: 64,
      category: 'flowers',
      description: 'Golden and orange blooms for warm vibes',
      image: f5,
    },
    {
      id: 51,
      name: 'Forget Me Not Bundle',
      price: 47,
      category: 'flowers',
      description: 'Delicate blue forget-me-not flowers',
      image: f2,
    },
    {
      id: 52,
      name: 'Tropical Paradise',
      price: 72,
      category: 'flowers',
      description: 'Exotic tropical flowers and birds of paradise',
      image: f3,
    },
    
   ];

  const filteredProducts = !selectedCategory || selectedCategory === 'all' 
    ? [] 
    : allProducts.filter(p => p.category === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    alert(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Our Products</h1>
        </div>

        {selectedCategory && selectedCategory !== 'all' && filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Please select a category from the navbar to view products. 🎂 🌹 🎁</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
