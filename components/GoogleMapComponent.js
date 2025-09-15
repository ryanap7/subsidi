'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
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
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#f8fafc' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#374151' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ffffff' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e2e8f0' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f1f5f9' }]
    }
  ]
};

export default function GoogleMapComponent({ spbeData = [], vehicles = [], mapView = 'distribution' }) {
  const mapRef = useRef();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

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
    if (mapRef.current && isLoaded && spbeData.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      spbeData.forEach(spbe => {
        bounds.extend({ lat: spbe.lat, lng: spbe.lng });
      });
      
      // Only include vehicles if not SPBE-only view
      if (view !== 'spbe-only' && vehicles.length > 0) {
        vehicles.forEach(vehicle => {
          if (vehicle.position) {
            bounds.extend(vehicle.position);
          }
        });
      }
      
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [spbeData, vehicles, isLoaded, view]);

  const getSPBEMarkerIcon = (status) => {
    const baseIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    };

    switch (status) {
      case 'critical': 
        return { ...baseIcon, fillColor: '#ef4444' };
      case 'low': 
        return { ...baseIcon, fillColor: '#f59e0b' };
      default: 
        return { ...baseIcon, fillColor: '#10b981' };
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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
        <div className="text-center text-gray-600">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">Peta Distribusi Tersedia</p>
          <p className="text-sm text-gray-500 mt-2">Konfigurasi Google Maps diperlukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={6}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* SPBE Markers - Always show */}
          {spbeData.map(spbe => (
            <Marker
              key={spbe.id}
              position={{ lat: spbe.lat, lng: spbe.lng }}
              icon={getSPBEMarkerIcon(spbe.status)}
              onClick={() => handleMarkerClick(spbe, 'spbe')}
            />
          ))}

          {/* Vehicle Markers - Only show if not SPBE-only view */}
          {view !== 'spbe-only' && vehicles.map(vehicle => (
            vehicle.position && (
              <Marker
                key={vehicle.id}
                position={vehicle.position}
                icon={{
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 8,
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
              <div className="p-4 min-w-[280px]">
                {selectedType === 'spbe' ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{selectedMarker.name}</h3>
                        <p className="text-sm text-gray-600">{selectedMarker.location}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status Operasional:</span>
                        <Badge variant={
                          selectedMarker.status === 'critical' ? 'destructive' :
                          selectedMarker.status === 'low' ? 'secondary' : 'default'
                        } className="shadow-sm">
                          {selectedMarker.status === 'critical' ? 'Kritis' : 
                           selectedMarker.status === 'low' ? 'Rendah' : 'Normal'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg">
                        <div>
                          <p className="text-gray-600">Stok Saat Ini</p>
                          <p className="font-semibold text-gray-900">{selectedMarker.stock?.toLocaleString()} L</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Kapasitas Total</p>
                          <p className="font-semibold text-gray-900">{selectedMarker.capacity?.toLocaleString()} L</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tingkat Pengisian</span>
                          <span className="font-medium text-gray-900">
                            {(((selectedMarker.stock || 0) / (selectedMarker.capacity || 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${
                              selectedMarker.status === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              selectedMarker.status === 'low' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                              'bg-gradient-to-r from-emerald-500 to-green-600'
                            }`}
                            style={{ 
                              width: `${((selectedMarker.stock || 0) / (selectedMarker.capacity || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{selectedMarker.name}</h3>
                        <p className="text-sm text-gray-600">ID: {selectedMarker.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={
                          selectedMarker.status === 'active' ? 'default' :
                          selectedMarker.status === 'maintenance' ? 'secondary' : 'outline'
                        } className="shadow-sm">
                          {selectedMarker.status === 'active' ? 'Aktif' :
                           selectedMarker.status === 'maintenance' ? 'Maintenance' : 'Tidak Aktif'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg">
                        <div>
                          <p className="text-gray-600">Tujuan</p>
                          <p className="font-semibold text-gray-900">{selectedMarker.destination}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Muatan</p>
                          <p className="font-semibold text-gray-900">{selectedMarker.cargo?.toLocaleString()} L</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                        <Activity className="w-3 h-3" />
                        <span>Tracking GPS aktif</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
          <div className="text-center text-gray-600">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Loading Map...</p>
          </div>
        </div>
      )}
      
      {/* Map Legend - Only show for SPBE view */}
      {view === 'spbe-only' && isLoaded && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3 text-sm">Status SPBE</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
              <span className="text-gray-700">Status Normal</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
              <span className="text-gray-700">Stok Rendah</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
              <span className="text-gray-700">Status Kritis</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}