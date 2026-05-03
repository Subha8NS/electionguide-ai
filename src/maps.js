/**
 * Map Integration — Leaflet + OpenStreetMap (No API Key Required)
 *
 * Renders an interactive map with demo polling station markers.
 * Uses free OpenStreetMap tiles and the Leaflet library.
 */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths when bundled by Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ── Demo Election Resource Locations ────────────────────────
const DEMO_LOCATIONS = [
  { lat: 28.6139, lng: 77.2090, name: 'Election Commission of India HQ', type: 'office' },
  { lat: 28.6280, lng: 77.2195, name: 'Connaught Place Polling Station', type: 'polling' },
  { lat: 28.5921, lng: 77.2272, name: 'Lodhi Road Registration Office', type: 'office' },
  { lat: 28.6353, lng: 77.2250, name: 'Mandi House Polling Station', type: 'polling' },
  { lat: 28.6129, lng: 77.2295, name: 'India Gate Voter Help Center', type: 'help' },
  { lat: 28.6437, lng: 77.2161, name: 'Civil Lines Polling Station', type: 'polling' },
  { lat: 28.6023, lng: 77.2091, name: 'Sarojini Nagar Registration Office', type: 'office' },
  { lat: 28.6508, lng: 77.2334, name: 'Old Delhi Voter Help Center', type: 'help' },
];

// Color-coded marker icons
function createMarkerIcon(type) {
  const colors = { polling: '#10B981', office: '#FF9933', help: '#6366F1' };
  const color = colors[type] || '#3B82F6';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50%;
      background: ${color}; border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
    ">${type === 'polling' ? '🗳️' : type === 'office' ? '🏛️' : '❓'}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

/**
 * Initializes the Leaflet map inside the given container.
 */
export function initMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Clear any placeholder content
  container.innerHTML = '';

  // Dark-themed tile layer from CartoDB (free, no key)
  const darkTiles = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }
  );

  const map = L.map(containerId, {
    center: [28.6139, 77.2090], // New Delhi
    zoom: 13,
    layers: [darkTiles],
    zoomControl: true,
    attributionControl: true,
  });

  // Style the zoom control to match our dark theme
  map.zoomControl.setPosition('topright');

  // Add markers for demo locations
  DEMO_LOCATIONS.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], {
      icon: createMarkerIcon(loc.type),
      title: loc.name,
    }).addTo(map);

    const typeLabel = { polling: 'Polling Station', office: 'Registration Office', help: 'Voter Help Center' };
    marker.bindPopup(`
      <div style="font-family: 'Inter', sans-serif; min-width: 180px;">
        <strong style="font-size: 13px;">${loc.name}</strong><br/>
        <span style="font-size: 11px; color: #666;">${typeLabel[loc.type]}</span>
      </div>
    `);
  });

  // Add a legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div style="background: rgba(10,10,26,0.9); backdrop-filter: blur(8px); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); font-family: 'Inter', sans-serif; font-size: 11px; color: #ccc;">
        <div style="font-weight: 700; margin-bottom: 6px; color: #f0f0f5;">📍 Map Legend</div>
        <div style="display:flex; align-items:center; gap:6px; margin:3px 0;"><span style="width:10px;height:10px;border-radius:50%;background:#10B981;display:inline-block;"></span> Polling Station</div>
        <div style="display:flex; align-items:center; gap:6px; margin:3px 0;"><span style="width:10px;height:10px;border-radius:50%;background:#FF9933;display:inline-block;"></span> Registration Office</div>
        <div style="display:flex; align-items:center; gap:6px; margin:3px 0;"><span style="width:10px;height:10px;border-radius:50%;background:#6366F1;display:inline-block;"></span> Voter Help Center</div>
      </div>
    `;
    return div;
  };
  legend.addTo(map);

  return map;
}
