import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = ({
  center = [-74.5, 40],
  zoom = 9,
  markers = [],
  route = null,
  onClick,
  onMarkerClick,
  className = '',
  interactive = true,
  showUserLocation = false
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
      interactive: interactive
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    if (showUserLocation) {
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));
    }

    if (onClick) {
      map.current.on('click', onClick);
    }

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // Handle markers
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'marker';
      
      // Custom marker styling based on type
      if (marker.type === 'pickup') {
        el.style.backgroundColor = '#10B981';
      } else if (marker.type === 'dropoff') {
        el.style.backgroundColor = '#EF4444';
      } else {
        el.style.backgroundColor = '#3B82F6';
      }

      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      const markerInstance = new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${marker.title}</h3><p>${marker.description || ''}</p>`)
        )
        .addTo(map.current);

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(marker));
      }

      markersRef.current.push(markerInstance);
    });
  }, [markers]);

  // Handle route
  useEffect(() => {
    if (!map.current || !route) return;

    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3B82F6',
        'line-width': 4
      }
    });

    // Fit bounds to show the entire route
    const coordinates = route;
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.current.fitBounds(bounds, {
      padding: 50
    });
  }, [route]);

  return (
    <div
      ref={mapContainer}
      className={`h-full w-full rounded-lg overflow-hidden ${className}`}
    />
  );
};

// LiveLocation component for real-time tracking
const LiveLocation = ({
  position,
  heading,
  className = ''
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: position,
      zoom: 15
    });

    const el = document.createElement('div');
    el.className = 'location-marker';
    el.style.backgroundColor = '#3B82F6';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    marker.current = new mapboxgl.Marker(el)
      .setLngLat(position)
      .addTo(map.current);

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !marker.current) return;

    marker.current.setLngLat(position);
    map.current.setCenter(position);

    if (heading !== undefined) {
      marker.current.setRotation(heading);
    }
  }, [position, heading]);

  return (
    <div
      ref={mapContainer}
      className={`h-full w-full rounded-lg overflow-hidden ${className}`}
    />
  );
};

// Example usage:
// <Map
//   center={[-74.5, 40]}
//   zoom={12}
//   markers={[
//     {
//       coordinates: [-74.5, 40],
//       type: 'pickup',
//       title: 'Pickup Location',
//       description: '123 Main St'
//     },
//     {
//       coordinates: [-74.6, 40.1],
//       type: 'dropoff',
//       title: 'Dropoff Location',
//       description: '456 Market St'
//     }
//   ]}
//   route={[
//     [-74.5, 40],
//     [-74.55, 40.05],
//     [-74.6, 40.1]
//   ]}
//   showUserLocation={true}
//   className="h-96"
// />
//
// <LiveLocation
//   position={[-74.5, 40]}
//   heading={45}
//   className="h-96"
// />

export { Map, LiveLocation };