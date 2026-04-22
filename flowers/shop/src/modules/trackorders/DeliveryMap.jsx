import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Delivery Icon
const deliveryIcon = L.divIcon({
  className: 'custom-delivery-marker',
  html: `
    <div class="marker-pin-delivery">
      <span class="emoji">🚚</span>
      <div class="pulse-ring"></div>
    </div>
  `,
  iconSize: [60, 60],
  iconAnchor: [30, 30],
});

// Custom Store Icon
const storeIcon = L.divIcon({
  className: 'custom-store-marker',
  html: `
    <div style="background: white; border: 2px solid #FF4DA6; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
      🏪
    </div>
  `,
  iconSize: [45, 45],
  iconAnchor: [22, 22],
});

// Custom Destination Icon
const destIcon = L.divIcon({
  className: 'custom-dest-marker',
  html: `
    <div style="background: white; border: 2px solid #4CAF50; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
      📍
    </div>
  `,
  iconSize: [45, 45],
  iconAnchor: [22, 45], // pin tip at bottom
});

// Component to dynamically control the map view
const MapController = ({ activeCoords, trackingCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (activeCoords) {
      map.flyTo([activeCoords.lat, activeCoords.lng], 16, {
        animate: true,
        duration: 1.5,
      });
    } else if (trackingCoords) {
      // Follow the movement smoothly
      map.panTo([trackingCoords.lat, trackingCoords.lng], {
        animate: true,
        duration: 1.5,
        noMoveStart: true
      });
    }
  }, [activeCoords, trackingCoords, map]);
  return null;
};

const DeliveryMap = ({ deliveryCoords, customerAddress }) => {
  const [activeLocation, setActiveLocation] = useState(null); // 'store' | 'dest' | null
  const [liveUserCoords, setLiveUserCoords] = useState(null); // Hardware GPS

  // Fixed coordinates for Singanallur, Coimbatore
  const storeCoords = { lat: 11.0018, lng: 77.0282 };
  const [destCoords, setDestCoords] = useState({ lat: 11.0168, lng: 76.9558 }); // Default nearby destination

  // Geocode destination address
  useEffect(() => {
    if (!customerAddress) return;

    const isValidRegionAndCity = (item, originalInput) => {
      if (!item) return false;
      const address = item.address || {};
      const displayName = (item.display_name || '').toLowerCase();
      
      // Strictly resolve within Tamil Nadu, India
      const state = (address.state || '').toLowerCase();
      const country = (address.country || '').toLowerCase();
      const isTamilNadu = state.includes('tamil nadu') || displayName.includes('tamil nadu');
      const isIndia = country.includes('india') || displayName.includes('india');
      
      if (!isTamilNadu || !isIndia) return false;

      // Extract city/town from the result and ensure it matches the INTENDED city
      const resultCity = (address.city || address.town || address.village || address.county || '').toLowerCase();
      const inputLower = (originalInput || '').toLowerCase();
      
      // The destination must belong to the intended city (validate against original input)
      if (resultCity && !inputLower.includes(resultCity)) {
        return false;
      }

      return true;
    };

    const formatAddress = (rawAddress) => {
      if (!rawAddress) return '';
      // Basic cleaning
      let cleanAddress = rawAddress.replace(/[\n\r]/g, ', ').replace(/\s+/g, ' ').trim();
      
      // Extract pincode (6 digits in India)
      const pinMatch = cleanAddress.match(/\b\d{6}\b/);
      const pincode = pinMatch ? pinMatch[0] : '';
      if (pincode) {
        cleanAddress = cleanAddress.replace(pincode, '').replace(/,\s*$/, '').trim();
      }

      // Clean up multiple commas
      cleanAddress = cleanAddress.replace(/,(\s*,)+/g, ',').replace(/,\s*$/, '');

      const lower = cleanAddress.toLowerCase();
      
      // Intelligently resolve to central landmark (e.g., Bus Stand) to avoid random matches
      if (!lower.includes('bus stand')) {
        cleanAddress += ' bus stand';
      }

      // Automatically refine if unclear by ensuring essential components are present
      if (!lower.includes('tamil nadu')) cleanAddress += ', Tamil Nadu';
      if (!lower.includes('india')) cleanAddress += ', India';

      // Re-append pincode at the end
      if (pincode) cleanAddress += ` ${pincode}`;
      
      // Final formatting cleanup
      return cleanAddress.replace(/,(\s*,)+/g, ',').replace(/,\s*$/, '').trim();
    };

    const fetchGeocode = async () => {
      try {
        // First clean and format the input into a structured address with central landmark bias
        const structuredAddress = formatAddress(customerAddress);
        
        let query = encodeURIComponent(structuredAddress);
        let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&countrycodes=in&limit=5`);
        let data = await response.json();
        
        // Pass the original customerAddress to validate the intended city dynamically
        let validResult = Array.isArray(data) ? data.find(item => isValidRegionAndCity(item, customerAddress)) : null;

        if (validResult) {
          setDestCoords({
            lat: parseFloat(validResult.lat),
            lng: parseFloat(validResult.lon)
          });
          setActiveLocation('dest');
        } else {
          console.warn("Geocoding failed: Location not found using structured address, or city name mismatch.");
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    fetchGeocode();
  }, [customerAddress]);

  // Track continuous movement traveled
  const [pathHistory, setPathHistory] = useState([storeCoords]);

  // Priority to hardware Live GPS, fallback to provided props
  const trackingCoords = liveUserCoords || deliveryCoords;

  // Initialize browser Geolocation native tracker
  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator) {
      console.log('📍 Initializing Native High-Accuracy GPS Tracking...');
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('📍 Hardware GPS update:', newCoords);
          setLiveUserCoords(newCoords);
        },
        (error) => {
          console.error("Hardware Geolocation Error:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000
        }
      );
    }
    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Track the history of the tracked coordinates seamlessly
  useEffect(() => {
    if (trackingCoords) {
      setPathHistory(prev => {
        const last = prev[prev.length - 1];
        if (last && last.lat === trackingCoords.lat && last.lng === trackingCoords.lng) {
          return prev;
        }
        return [...prev, trackingCoords];
      });
    }
  }, [trackingCoords]);

  // Default to store if no trackingCoords yet
  const initialCenter = trackingCoords ? [trackingCoords.lat, trackingCoords.lng] : [storeCoords.lat, storeCoords.lng];

  const handleStoreClick = () => {
    setActiveLocation('store');
  };

  const handleDestClick = () => {
    setActiveLocation('dest');
  };

  // Determine which coords to focus on
  const getActiveCoords = () => {
    if (activeLocation === 'store') return storeCoords;
    if (activeLocation === 'dest') return destCoords;
    return null;
  };

  // Refs for Opening Popups Programmatically
  const storeMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);

  useEffect(() => {
    if (activeLocation === 'store' && storeMarkerRef.current) {
      storeMarkerRef.current.openPopup();
    } else if (activeLocation === 'dest' && destMarkerRef.current) {
      destMarkerRef.current.openPopup();
    }
  }, [activeLocation]);

  return (
    <div style={{ margin: '25px 0' }}>
      <div className="delivery-route-info" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '15px 20px',
        background: 'white',
        borderRadius: '16px',
        marginBottom: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,77,166,0.2)',
        fontFamily: 'inherit',
        cursor: 'pointer'
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, padding: '10px', borderRadius: '12px', background: activeLocation === 'store' ? 'rgba(255,77,166,0.05)' : 'transparent', transition: 'all 0.3s' }}
          onClick={handleStoreClick}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,77,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏪</div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Starting Point</div>
            <div style={{ fontSize: '15px', color: '#FF4DA6', fontWeight: 600 }}>Bloom & Bliss Store</div>
          </div>
        </div>

        <div style={{ color: '#FF4DA6', padding: '0 15px', fontSize: '24px' }}>
          →
        </div>

        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end', textAlign: 'right', padding: '10px', borderRadius: '12px', background: activeLocation === 'dest' ? 'rgba(76,175,80,0.05)' : 'transparent', transition: 'all 0.3s' }}
          onClick={handleDestClick}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Destination</div>
            <div style={{ fontSize: '15px', color: '#4CAF50', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={customerAddress || 'Customer Location'}>
              {customerAddress || 'Customer Location'}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(76,175,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📍</div>
        </div>
      </div>

      <div className="delivery-map-container" style={{ height: '400px', width: '100%', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,77,166,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <MapContainer
        center={initialCenter}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Store Marker */}
        <Marker 
          position={[storeCoords.lat, storeCoords.lng]} 
          icon={storeIcon}
          ref={storeMarkerRef}
          eventHandlers={{
             click: handleStoreClick,
          }}
        >
          <Popup>
            <strong style={{ color: '#FF4DA6' }}>🏪 Bloom & Bliss Store</strong><br />
            Singanallur, Coimbatore<br />
            <em>Starting point for your order.</em>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker 
          position={[destCoords.lat, destCoords.lng]} 
          icon={destIcon}
          ref={destMarkerRef}
          eventHandlers={{
             click: handleDestClick,
          }}
        >
          <Popup>
            <strong style={{ color: '#4CAF50' }}>📍 Destination</strong><br />
            {customerAddress || 'Customer Location'}<br />
            <em>Your items will arrive here.</em>
          </Popup>
        </Marker>

        {/* Path Traveled Polyline - Actively drawn from history */}
        {pathHistory.length > 1 && (
          <Polyline 
            positions={pathHistory.map(p => [p.lat, p.lng])} 
            color="#2196F3" 
            weight={5} 
            opacity={0.8}
          />
        )}

        {/* Illustrative Route to Destination - Shown when destination is active */}
        {activeLocation === 'dest' && (
          <Polyline 
            positions={[
              trackingCoords ? [trackingCoords.lat, trackingCoords.lng] : [storeCoords.lat, storeCoords.lng],
              [destCoords.lat, destCoords.lng]
            ]} 
            color="#FF4DA6" 
            weight={4} 
            dashArray="10, 10" // dashed look
            opacity={0.6}
          />
        )}

        {/* Dynamic Delivery Driver Marker (based on Live Hardware GPS or props) */}
        {trackingCoords && (
          <Marker position={[trackingCoords.lat, trackingCoords.lng]} icon={deliveryIcon}>
            <Popup>
              <b>{liveUserCoords ? "Live Tracking (Device GPS)" : "Delivery in Progress"}</b><br />
              {liveUserCoords ? "This is your hardware GPS location." : "Your order is on the way!"}
            </Popup>
          </Marker>
        )}

        <MapController activeCoords={getActiveCoords()} trackingCoords={trackingCoords} />
      </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryMap;

