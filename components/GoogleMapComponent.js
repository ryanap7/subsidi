'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Truck, Navigation, Fuel, MapPin, Activity } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -6.2088,
  lng: 106.8456, // Jakarta
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#1f2937' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca3af' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1f2937' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#374151' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#4b5563' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#6b7280' }]
    }
  ]
};

// Mock route data
const mockRoutes = [
  {
    id: 'route-1',
    path: [
      { lat: -6.2088, lng: 106.8456 },
      { lat: -6.2200, lng: 106.8300 },
      { lat: -6.2615, lng: 106.7815 }
    ],
    color: '#10b981',
    vehicle: 'TRK-001'
  },
  {
    id: 'route-2',
    path: [
      { lat: -7.2504, lng: 112.7688 },
      { lat: -7.2600, lng: 112.7500 },
      { lat: -7.2756, lng: 112.7378 }
    ],
    color: '#3b82f6',
    vehicle: 'TRK-002'
  }
];

export default function GoogleMapComponent({ spbeData = [], vehicles = [], view = 'distribution' }) {
  const mapRef = useRef();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'drawing', 'places'],
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = undefined;
  }, []);

  const handleMarkerClick = useCallback((item, type) => {
    setSelectedMarker(item);
    setSelectedType(type);
  }, []);

  // Fit map bounds to show all markers
  useEffect(() => {
    if (mapRef.current && isLoaded && (spbeData.length > 0 || vehicles.length > 0)) {
      const bounds = new window.google.maps.LatLngBounds();
      
      spbeData.forEach(spbe => {
        bounds.extend({ lat: spbe.lat, lng: spbe.lng });
      });
      
      vehicles.forEach(vehicle => {
        if (vehicle.position) {
          bounds.extend(vehicle.position);
        }
      });
      
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [spbeData, vehicles, isLoaded]);

  useEffect(() => {
    if (isLoaded && mockRoutes.length > 0) {
      Promise.all(
        mockRoutes.map(route =>
          new Promise((resolve) => {
            const service = new google.maps.DirectionsService();
            service.route(
              {
                origin: route.path[0],
                destination: route.path[route.path.length - 1],
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  resolve({ id: route.id, color: route.color, result });
                } else {
                  resolve(null);
                }
              }
            );
          })
        )
      ).then(results => {
        setDirections(results.filter(Boolean));
      });
    }
  }, [isLoaded, mockRoutes]);


  const getSPBEMarkerColor = (status) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'low': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getVehicleMarkerColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-lg">
        <div className="text-center text-white">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-500" />
          <p className="text-lg font-medium">Map Configuration Required</p>
          <p className="text-sm text-slate-400 mt-2">Google Maps API key not found</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">Loading map…</div>;
  }

  console.log(directions)

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* SPBE Markers */}
        {spbeData.map(spbe => (
          <Marker
            key={spbe.id}
            position={{ lat: spbe.lat, lng: spbe.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: getSPBEMarkerColor(spbe.status),
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            onClick={() => handleMarkerClick(spbe, 'spbe')}
          />
        ))}

        {/* Vehicle Markers */}
        {vehicles.map(vehicle => (
          vehicle.position && (
            <Marker
              key={vehicle.id}
              position={vehicle.position}
              icon={{
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: getVehicleMarkerColor(vehicle.status),
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                rotation: 0,
              }}
              onClick={() => handleMarkerClick(vehicle, 'vehicle')}
            />
          )
        ))}

        {/* Route Polylines */}
        {view === 'supply-chain' && directions.map(d => (
          <DirectionsRenderer
            key={d.id}
            directions={d.result}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: d.color,
                strokeOpacity: 0.8,
                strokeWeight: 4,
              },
            }}
          />
        ))}

        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={selectedType === 'spbe' ? 
              { lat: selectedMarker.lat, lng: selectedMarker.lng } : 
              selectedMarker.position
            }
            onCloseClick={() => {
              setSelectedMarker(null);
              setSelectedType(null);
            }}
          >
            <div className="p-3 min-w-[250px]">
              {selectedType === 'spbe' ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedMarker.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMarker.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={
                        selectedMarker.status === 'critical' ? 'destructive' :
                        selectedMarker.status === 'low' ? 'secondary' : 'default'
                      }>
                        {selectedMarker.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Stok Saat Ini</p>
                        <p className="font-medium">{selectedMarker.stock?.toLocaleString()} L</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Kapasitas</p>
                        <p className="font-medium">{selectedMarker.capacity?.toLocaleString()} L</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${((selectedMarker.stock || 0) / (selectedMarker.capacity || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Tingkat Pengisian: {(((selectedMarker.stock || 0) / (selectedMarker.capacity || 1)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedMarker.name}</h3>
                      <p className="text-sm text-gray-600">ID: {selectedMarker.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={
                        selectedMarker.status === 'active' ? 'default' :
                        selectedMarker.status === 'maintenance' ? 'secondary' : 'outline'
                      }>
                        {selectedMarker.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Tujuan</p>
                        <p className="font-medium">{selectedMarker.destination}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Muatan</p>
                        <p className="font-medium">{selectedMarker.cargo?.toLocaleString()} L</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Activity className="w-3 h-3" />
                      <span>Live tracking aktif</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg">
        <h4 className="font-medium text-gray-800 mb-2 text-sm">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>SPBE Normal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>SPBE Low Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>SPBE Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-green-500"></div>
            <span>Truck Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}