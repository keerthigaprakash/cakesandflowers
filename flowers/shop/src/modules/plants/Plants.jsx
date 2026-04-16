import React from 'react';
import './Plants.css';
import pl1 from '../../assets/pl1.jpg';
import pl2 from '../../assets/pl2.jpg';
import pl3 from '../../assets/pl3.jpg';
import pl4 from '../../assets/pl4.jpg';
import pl5 from '../../assets/pl5.jpg';
import pl6 from '../../assets/pl6.jpg';
import pl7 from '../../assets/pl7.jpg';
import pl8 from '../../assets/pl8.jpg';

const samplePlants = [
  { id: 1, name: 'Snake Plant', description: 'Perfect for low light environments.', price: 350, image: pl1 },
  { id: 2, name: 'Peace Lily', description: 'Elegant and air-purifying.', price: 450, image: pl2 },
  { id: 3, name: 'Monstera Deliciosa', description: 'Tropical beauty with split leaves.', price: 600, image: pl3 },
  { id: 4, name: 'Fiddle Leaf Fig', description: 'Trendy statement plant for indoors.', price: 750, image: pl4 },
  { id: 5, name: 'Aloe Vera', description: 'Healing succulent, easy to grow.', price: 250, image: pl5 },
  { id: 6, name: 'Rubber Plant', description: 'Hardy plant with glossy dark leaves.', price: 400, image: pl6 },
  { id: 7, name: 'ZZ Plant', description: 'Almost impossible to kill.', price: 500, image: pl7 },
  { id: 8, name: 'Pothos', description: 'Cascading beauty for any shelf.', price: 300, image: pl8 },
];

const Plants = () => {
  return (
    <div className="plants-page">
      <div className="plants-container">
        <div className="plants-header">
          <h1 className="plants-title">🌿 Indoor Plants Collection</h1>
          <p className="plants-subtitle">Bring nature indoors with our beautiful, air-purifying plants</p>
        </div>

        <div className="plants-grid">
          {samplePlants.map((plant) => (
            <div className="plant-sample-card" key={plant.id}>
              <div className="plant-card-image">
                <img src={plant.image} alt={plant.name} />
              </div>
              <div className="plant-card-body">
                <h3>{plant.name}</h3>
                <p>{plant.description}</p>
                <span className="plant-price">₹{plant.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plants;
