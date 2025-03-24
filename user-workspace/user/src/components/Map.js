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
  showUserLocation = false,
  onLocationSelect
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const selectionMarkerRef = useRef(null);

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
        trackUserLocation: true,
        showUserLocation: true
      }));
    }

    if (onClick) {
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onClick([lng, lat]);

        // If location selection is enabled, show a marker
        if (onLocationSelect) {
          if (selectionMarkerRef.current) {
            selectionMarkerRef.current.remove();
          }

          const el = document.createElement('div');
          el.className = 'selection-marker';
          el.style.backgroundColor = '#3B82F6';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

          selectionMarkerRef.current = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map.current);

          // Reverse geocode the location
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                onLocationSelect({
                  coordinates: [lng, lat],
                  address: data.features[0].place_name
                });
              }
            });
        }
      });
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
      } else if (marker.type === 'driver') {
        el.style.backgroundColor = '#F59E0B';
        el.style.borderRadius = '0';
        el.style.transform = 'rotate(45deg)';
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

// DriverTracker component for tracking assigned driver
const DriverTracker = ({
  driverLocation,
  pickupLocation,
  dropoffLocation,
  className = ''
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const driverMarker = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !pickupLocation || !dropoffLocation) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: driverLocation || pickupLocation,
      zoom: 14
    });

    // Add pickup marker
    new mapboxgl.Marker({ color: '#10B981' })
      .setLngLat(pickupLocation)
      .addTo(map.current);

    // Add dropoff marker
    new mapboxgl.Marker({ color: '#EF4444' })
      .setLngLat(dropoffLocation)
      .addTo(map.current);

    // Add driver marker
    if (driverLocation) {
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.style.backgroundColor = '#F59E0B';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '0';
      el.style.transform = 'rotate(45deg)';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      driverMarker.current = new mapboxgl.Marker(el)
        .setLngLat(driverLocation)
        .addTo(map.current);
    }

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // Update driver location
  useEffect(() => {
    if (!map.current || !driverMarker.current || !driverLocation) return;

    driverMarker.current.setLngLat(driverLocation);
    map.current.setCenter(driverLocation);
  }, [driverLocation]);

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
//   showUserLocation={true}
//   onLocationSelect={(location) => {
//     console.log('Selected location:', location);
//   }}
//   className="h-96"
// />
//
// <DriverTracker
//   driverLocation={[-74.5, 40]}
//   pickupLocation={[-74.5, 40]}
//   dropoffLocation={[-74.6, 40.1]}
//   className="h-96"
// />

export { Map, DriverTracker };