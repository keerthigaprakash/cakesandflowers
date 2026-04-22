import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ─── Custom Icons ──────────────────────────────────────────────
const deliveryIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      position: relative;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(33, 150, 243, 0.15);
        animation: deliveryPulse 1.8s ease-out infinite;
      "></div>
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2196F3, #1565C0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 4px 15px rgba(33,150,243,0.5);
        position: relative;
        z-index: 2;
        border: 3px solid white;
      ">🚚</div>
    </div>
    <style>
      @keyframes deliveryPulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    </style>
  `,
  iconSize: [56, 56],
  iconAnchor: [28, 28],
});

const storeIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 44px; height: 44px; border-radius: 50%;
      background: white; border: 3px solid #FF4DA6;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; box-shadow: 0 4px 12px rgba(255,77,166,0.4);
    ">🏪</div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const destIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
      <div style="
        width: 44px; height: 44px; border-radius: 50%;
        background: white; border: 3px solid #4CAF50;
        display: flex; align-items: center; justify-content: center;
        font-size: 22px; box-shadow: 0 4px 12px rgba(76,175,80,0.4);
      ">🏠</div>
      <div style="width:3px;height:14px;background:#4CAF50;"></div>
    </div>
  `,
  iconSize: [44, 58],
  iconAnchor: [22, 58],
});

// ─── Smooth Map Controller ───────────────────────────────────────
// Animates map to follow the tracking position smoothly
const LiveMapController = ({ coords, autoFollow }) => {
  const map = useMap();
  const prevCoordsRef = useRef(null);

  useEffect(() => {
    if (!coords || !autoFollow) return;

    const prev = prevCoordsRef.current;
    // Only pan if moved > ~5m to prevent jitter
    if (prev) {
      const dist = map.distance([prev.lat, prev.lng], [coords.lat, coords.lng]);
      if (dist < 3) return;
    }

    map.panTo([coords.lat, coords.lng], {
      animate: true,
      duration: 0.8,
      easeLinearity: 0.25,
      noMoveStart: true,
    });
    prevCoordsRef.current = coords;
  }, [coords, autoFollow, map]);

  return null;
};

// Fits the map to show both store and destination simultaneously
const BoundsController = ({ storeCoords, destCoords, active }) => {
  const map = useMap();
  useEffect(() => {
    if (!active || !storeCoords || !destCoords) return;
    const bounds = L.latLngBounds(
      [storeCoords.lat, storeCoords.lng],
      [destCoords.lat, destCoords.lng]
    );
    map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1.2 });
  }, [active, storeCoords, destCoords, map]);
  return null;
};

// Flies to a specific point when a button is clicked
const FlyToController = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, { animate: true, duration: 1.2 });
    }
  }, [target, map]);
  return null;
};

// ─── Animated Marker (smoothly lerps between positions) ──────────
const AnimatedDeliveryMarker = ({ coords }) => {
  const markerRef = useRef(null);
  const animFrameRef = useRef(null);
  const prevRef = useRef(null);

  useEffect(() => {
    if (!coords || !markerRef.current) return;

    const target = L.latLng(coords.lat, coords.lng);

    if (!prevRef.current) {
      markerRef.current.setLatLng(target);
      prevRef.current = target;
      return;
    }

    const start = markerRef.current.getLatLng();
    const startTime = performance.now();
    const DURATION = 800; // ms

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);

      const lat = start.lat + (target.lat - start.lat) * ease;
      const lng = start.lng + (target.lng - start.lng) * ease;
      markerRef.current.setLatLng([lat, lng]);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = target;
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [coords]);

  if (!coords) return null;

  return (
    <Marker
      ref={markerRef}
      position={[coords.lat, coords.lng]}
      icon={deliveryIcon}
    >
      <Popup>
        <b style={{ color: '#2196F3' }}>🚚 Delivery in Progress</b><br />
        Lat: {coords.lat.toFixed(5)}<br />
        Lng: {coords.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
};

// ─── Main DeliveryMap Component ──────────────────────────────────
const DeliveryMap = ({ deliveryCoords, customerAddress, socketEmitter = null, orderId = null }) => {
  const storeCoords = { lat: 11.0018, lng: 77.0282 }; // Singanallur, Coimbatore

  const [destCoords, setDestCoords] = useState({ lat: 11.0168, lng: 76.9558 });
  const [liveCoords, setLiveCoords] = useState(null);        // Device GPS
  const [accuracy, setAccuracy] = useState(null);             // GPS accuracy in metres
  const [pathHistory, setPathHistory] = useState([storeCoords]);
  const [autoFollow, setAutoFollow] = useState(false);   // start in overview mode
  const [fitAll, setFitAll] = useState(true);             // show both markers on load
  const [flyTarget, setFlyTarget] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('waiting'); // 'waiting' | 'active' | 'error'
  const watchIdRef = useRef(null);

  // Effective position: prefer live device GPS > socket props
  const activeCoords = liveCoords || deliveryCoords;

  // ── Geocode destination ────────────────────────────────────────
  useEffect(() => {
    if (!customerAddress) return;

    const formatQuery = (raw) => {
      let q = raw.replace(/[\n\r]/g, ', ').replace(/\s+/g, ' ').trim();
      if (!/bus stand/i.test(q)) q += ' Bus Stand';
      if (!/tamil nadu/i.test(q)) q += ', Tamil Nadu';
      if (!/india/i.test(q)) q += ', India';
      return q;
    };

    const isValid = (item) => {
      const dn = (item.display_name || '').toLowerCase();
      const state = (item.address?.state || '').toLowerCase();
      return (
        (state.includes('tamil nadu') || dn.includes('tamil nadu')) &&
        (dn.includes('india') || (item.address?.country || '').toLowerCase().includes('india'))
      );
    };

    const geocode = async () => {
      try {
        const q = encodeURIComponent(formatQuery(customerAddress));
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${q}&addressdetails=1&countrycodes=in&limit=5`
        );
        const data = await res.json();
        const match = Array.isArray(data) ? data.find(isValid) : null;
        if (match) {
          setDestCoords({ lat: parseFloat(match.lat), lng: parseFloat(match.lon) });
        }
      } catch (e) {
        console.error('Geocode error:', e);
      }
    };

    geocode();
  }, [customerAddress]);

  // ── Device GPS Watcher ─────────────────────────────────────────
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('waiting');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setAccuracy(Math.round(pos.coords.accuracy));
        setLiveCoords(newCoords);
        setGpsStatus('active');

        // Broadcast to other viewers via socket
        if (socketEmitter && orderId) {
          socketEmitter('updateDeliveryLocation', {
            orderId,
            lat: newCoords.lat,
            lng: newCoords.lng,
          });
        }
      },
      (err) => {
        console.warn('GPS Error:', err.message);
        setGpsStatus('error');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [socketEmitter, orderId]);

  // ── Accumulate Path History ────────────────────────────────────
  useEffect(() => {
    if (!activeCoords) return;
    setPathHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.lat === activeCoords.lat && last.lng === activeCoords.lng) return prev;
      // Keep max 200 points to avoid memory issues
      const updated = [...prev, activeCoords];
      return updated.length > 200 ? updated.slice(updated.length - 200) : updated;
    });
  }, [activeCoords]);

  const handleFlyStore = () => { setFlyTarget(storeCoords); setAutoFollow(false); setFitAll(false); };
  const handleFlyDest = () => { setFlyTarget(destCoords); setAutoFollow(false); setFitAll(false); };
  const handleFollowDriver = () => { setAutoFollow(true); setFitAll(false); setFlyTarget(null); };
  const handleFitAll = () => { setFitAll(true); setAutoFollow(false); setFlyTarget(null); };

  // Re-fit when destination updates (after geocode resolves)
  useEffect(() => { setFitAll(true); }, [destCoords]);

  // Mid-point for initial center so both markers are roughly visible
  const initialCenter = [
    (storeCoords.lat + destCoords.lat) / 2,
    (storeCoords.lng + destCoords.lng) / 2,
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* ── Route Info Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 20px',
        background: 'white',
        borderRadius: '18px',
        marginBottom: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        border: '1px solid rgba(33,150,243,0.15)',
        flexWrap: 'wrap',
      }}>
        {/* Store */}
        <button
          onClick={handleFlyStore}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,77,166,0.06)', border: '1px solid rgba(255,77,166,0.2)',
            borderRadius: '12px', padding: '8px 14px', cursor: 'pointer', flex: 1, minWidth: '140px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🏪</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '10px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>From</div>
            <div style={{ fontSize: '13px', color: '#FF4DA6', fontWeight: 700 }}>Bloom & Bliss</div>
          </div>
        </button>

        <span style={{ color: '#ccc', fontSize: '20px' }}>→</span>

        {/* Destination */}
        <button
          onClick={handleFlyDest}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '12px', padding: '8px 14px', cursor: 'pointer', flex: 1, minWidth: '140px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🏠</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '10px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>To</div>
            <div style={{
              fontSize: '13px', color: '#4CAF50', fontWeight: 700,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px',
            }}>
              {customerAddress || 'Customer'}
            </div>
          </div>
        </button>

        {/* Fit All Button */}
        <button
          onClick={handleFitAll}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: fitAll ? 'linear-gradient(135deg,#9C27B0,#6A1B9A)' : '#f5f5f5',
            color: fitAll ? 'white' : '#666',
            border: 'none', borderRadius: '12px', padding: '10px 16px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            boxShadow: fitAll ? '0 4px 12px rgba(156,39,176,0.35)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          🗺️ Overview
        </button>

        {/* Follow Driver Button */}
        <button
          onClick={handleFollowDriver}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: autoFollow ? 'linear-gradient(135deg,#2196F3,#1565C0)' : '#f5f5f5',
            color: autoFollow ? 'white' : '#666',
            border: 'none', borderRadius: '12px', padding: '10px 16px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            boxShadow: autoFollow ? '0 4px 12px rgba(33,150,243,0.35)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          {autoFollow ? '📡 Following' : '🎯 Follow Driver'}
        </button>

        {/* GPS Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: gpsStatus === 'active' ? 'rgba(76,175,80,0.1)' : gpsStatus === 'error' ? 'rgba(244,67,54,0.1)' : 'rgba(255,152,0,0.1)',
          color: gpsStatus === 'active' ? '#4CAF50' : gpsStatus === 'error' ? '#F44336' : '#FF9800',
          padding: '8px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 700,
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'currentColor',
            display: 'inline-block',
            animation: gpsStatus === 'active' ? 'gpsBlinkDot 1.2s ease-in-out infinite' : 'none',
          }}></span>
          {gpsStatus === 'active' ? `GPS ±${accuracy}m` : gpsStatus === 'error' ? 'GPS Off' : 'GPS…'}
        </div>
      </div>

      {/* ── Map ── */}
      <div style={{
        height: '420px', width: '100%', borderRadius: '22px',
        overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        border: '1px solid rgba(33,150,243,0.2)',
      }}>
        <MapContainer
          center={initialCenter}
          zoom={15}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          {/* Dark map tiles for premium look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Store Marker */}
          <Marker position={[storeCoords.lat, storeCoords.lng]} icon={storeIcon}>
            <Popup>
              <strong style={{ color: '#FF4DA6' }}>🏪 Bloom & Bliss Store</strong><br />
              Singanallur, Coimbatore<br />
              <em>Order dispatch point</em>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={[destCoords.lat, destCoords.lng]} icon={destIcon}>
            <Popup>
              <strong style={{ color: '#4CAF50' }}>🏠 Delivery Destination</strong><br />
              {customerAddress || 'Customer Location'}<br />
              <em>Your order arrives here</em>
            </Popup>
          </Marker>

          {/* GPS Accuracy Circle */}
          {liveCoords && accuracy && (
            <Circle
              center={[liveCoords.lat, liveCoords.lng]}
              radius={accuracy}
              pathOptions={{
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '5, 5',
              }}
            />
          )}

          {/* Animated Delivery Truck Marker */}
          {activeCoords && <AnimatedDeliveryMarker coords={activeCoords} />}

          {/* ── Planned Route: Store → Destination (always visible) */}
          <Polyline
            positions={[
              [storeCoords.lat, storeCoords.lng],
              [destCoords.lat, destCoords.lng],
            ]}
            pathOptions={{
              color: '#9E9E9E',
              weight: 4,
              opacity: 0.45,
              dashArray: '6, 10',
            }}
          />

          {/* ── Traveled trail: history of driver's actual path */}
          {pathHistory.length > 1 && (
            <Polyline
              positions={pathHistory.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: '#2196F3', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
            />
          )}

          {/* ── Remaining route: driver → destination (dashed pink) */}
          {activeCoords && (
            <Polyline
              positions={[
                [activeCoords.lat, activeCoords.lng],
                [destCoords.lat, destCoords.lng],
              ]}
              pathOptions={{ color: '#FF4DA6', weight: 3.5, opacity: 0.7, dashArray: '10, 8' }}
            />
          )}

          {/* Fit-all bounds — shows both store + destination */}
          <BoundsController storeCoords={storeCoords} destCoords={destCoords} active={fitAll} />

          {/* Auto-follow driver */}
          <LiveMapController coords={autoFollow ? activeCoords : null} autoFollow={autoFollow} />

          {/* Fly to individual marker on button click */}
          {flyTarget && <FlyToController target={flyTarget} />}
        </MapContainer>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes gpsBlinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default DeliveryMap;
