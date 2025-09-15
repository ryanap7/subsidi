'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, Truck, CheckCircle2, Clock, Route, 
  Navigation, Target, Package, AlertCircle
} from 'lucide-react';
import { GoogleMap, Marker, Polyline, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
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

// Mock tracking data
const mockTrackingData = [
  {
    id: 'SJ-002',
    number: 'SJ/PTM/2024/002',
    driver: 'Budi Hartono',
    vehicle: 'TRK-002',
    status: 'in-progress',
    currentLocation: { lat: -7.2504, lng: 112.7688 },
    route: [
      {
        id: 'depot',
        name: 'Depot Surabaya',
        position: { lat: -7.2575, lng: 112.7521 },
        status: 'completed',
        arrivalTime: '08:00',
        completedTime: '08:30',
        type: 'depot'
      },
      {
        id: 'station-1',
        name: 'Stasiun Transit Gresik',
        position: { lat: -7.1563, lng: 112.6536 },
        status: 'completed',
        arrivalTime: '09:15',
        completedTime: '09:30',
        type: 'station'
      },
      {
        id: 'spbe-1',
        name: 'SPBE Surabaya Timur',
        position: { lat: -7.2756, lng: 112.7378 },
        status: 'in-progress',
        arrivalTime: '10:45',
        completedTime: null,
        type: 'destination',
        volume: 4200
      }
    ],
    routePath: [
      { lat: -7.2575, lng: 112.7521 },
      { lat: -7.2300, lng: 112.7200 },
      { lat: -7.1563, lng: 112.6536 },
      { lat: -7.2000, lng: 112.7000 },
      { lat: -7.2756, lng: 112.7378 }
    ]
  }
];

export default function LogisticsTrackingMap() {
  const [selectedDelivery, setSelectedDelivery] = useState(mockTrackingData[0]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'drawing', 'places'],
  });

  const getStationIcon = (station) => {
    const baseIcon = {
      scale: 10,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    };

    if (station.type === 'depot') {
      return {
        ...baseIcon,
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: station.status === 'completed' ? '#10b981' : '#6b7280',
      };
    } else if (station.type === 'destination') {
      return {
        ...baseIcon,
        scale: 12,
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: station.status === 'completed' ? '#10b981' : 
                   station.status === 'in-progress' ? '#3b82f6' : '#6b7280',
      };
    } else {
      return {
        ...baseIcon,
        scale: 8,
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: station.status === 'completed' ? '#10b981' : 
                   station.status === 'in-progress' ? '#3b82f6' : '#6b7280',
      };
    }
  };

  const confirmStationCompletion = (stationId) => {
    // Simulate confirming station completion
    console.log(`Confirming completion for station: ${stationId}`);
    // In real app, this would update the backend and refresh the tracking data
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg h-[500px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-600">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Peta Tracking Tersedia</p>
            <p className="text-sm mt-2">Konfigurasi Google Maps diperlukan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center text-xl">
            <Navigation className="w-6 h-6 mr-3" />
            Tracking Pengiriman Logistik
          </CardTitle>
          <CardDescription className="text-gray-600">
            Pemantauan rute dan status pengiriman dengan konfirmasi stasiun
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Delivery Info */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedDelivery.number}</h3>
                <p className="text-sm text-gray-600">{selectedDelivery.driver} - {selectedDelivery.vehicle}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Dalam Perjalanan
              </Badge>
            </div>
          </div>

          {/* Map */}
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedDelivery.currentLocation}
                zoom={10}
                options={mapOptions}
              >
                {/* Route Path */}
                <Polyline
                  path={selectedDelivery.routePath}
                  options={{
                    strokeColor: '#3b82f6',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  }}
                />

                {/* Station Markers */}
                {selectedDelivery.route.map((station) => (
                  <Marker
                    key={station.id}
                    position={station.position}
                    icon={getStationIcon(station)}
                    onClick={() => setSelectedMarker(station)}
                  />
                ))}

                {/* Current Truck Position */}
                <Marker
                  position={selectedDelivery.currentLocation}
                  icon={{
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 8,
                    fillColor: '#ef4444',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    rotation: 45,
                  }}
                />

                {/* Info Window */}
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.position}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-3 min-w-[200px]">
                      <h4 className="font-semibold text-gray-900 mb-2">{selectedMarker.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            selectedMarker.status === 'completed' ? 'text-green-600' :
                            selectedMarker.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {selectedMarker.status === 'completed' ? 'Selesai' :
                             selectedMarker.status === 'in-progress' ? 'Dalam Proses' : 'Terjadwal'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waktu Tiba:</span>
                          <span className="font-medium">{selectedMarker.arrivalTime}</span>
                        </div>
                        {selectedMarker.completedTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Selesai:</span>
                            <span className="font-medium text-green-600">{selectedMarker.completedTime}</span>
                          </div>
                        )}
                        {selectedMarker.volume && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Volume:</span>
                            <span className="font-medium">{selectedMarker.volume.toLocaleString()}L</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Station Progress List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Progress Stasiun</h4>
            {selectedDelivery.route.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200"
              >
                <div className="flex-shrink-0">
                  {station.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : station.status === 'in-progress' ? (
                    <Clock className="w-6 h-6 text-blue-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-gray-900">{station.name}</h5>
                    <div className="text-xs text-gray-500">
                      {station.type === 'depot' ? 'Depot' :
                       station.type === 'destination' ? 'Tujuan' : 'Stasiun Transit'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Tiba: {station.arrivalTime} 
                      {station.completedTime && (
                        <span className="text-green-600 ml-2">
                          | Selesai: {station.completedTime}
                        </span>
                      )}
                    </div>
                    {station.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => confirmStationCompletion(station.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xs"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Konfirmasi Selesai
                      </Button>
                    )}
                  </div>
                  {station.volume && (
                    <div className="text-xs text-gray-500 mt-1">
                      Volume: {station.volume.toLocaleString()}L
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress Keseluruhan</span>
              <span className="text-sm font-bold text-emerald-700">
                {selectedDelivery.route.filter(s => s.status === 'completed').length}/{selectedDelivery.route.length} Stasiun
              </span>
            </div>
            <Progress 
              value={(selectedDelivery.route.filter(s => s.status === 'completed').length / selectedDelivery.route.length) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}