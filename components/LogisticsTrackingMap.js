'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, Truck, CheckCircle2, Clock, Route, 
  Navigation, Target, Package, AlertCircle, Building2
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

// Default tracking data
const defaultTrackingData = {
  id: 'default',
  number: 'Pilih Surat Jalan',
  driver: 'Tidak ada data',
  vehicle: '',
  status: 'idle',
  currentLocation: { lat: -6.2088, lng: 106.8456 },
  route: [],
  routePath: []
};

export default function LogisticsTrackingMap({ trackingData = null }) {
  const [selectedDelivery, setSelectedDelivery] = useState(trackingData || defaultTrackingData);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'drawing', 'places'],
  });

  // Update tracking data when prop changes
  useEffect(() => {
    if (trackingData) {
      setSelectedDelivery(trackingData);
    }
  }, [trackingData]);

  const getStationIcon = (station) => {
    const baseIcon = {
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    };

    if (station.type === 'depot') {
      return {
        ...baseIcon,
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        scale: 1.5,
        fillColor: station.status === 'completed' ? '#10b981' : '#6b7280',
        anchor: { x: 12, y: 24 }
      };
    } else if (station.type === 'spbe') {
      return {
        ...baseIcon,
        path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
        scale: 1.2,
        fillColor: station.status === 'completed' ? '#10b981' : 
                   station.status === 'in-progress' ? '#3b82f6' : '#6b7280',
        anchor: { x: 12, y: 12 }
      };
    } else {
      return {
        ...baseIcon,
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: station.status === 'completed' ? '#10b981' : 
                   station.status === 'in-progress' ? '#3b82f6' : '#6b7280',
      };
    }
  };

  const getTruckIcon = () => {
    return {
      path: 'M20,8h-3V4H3C1.89,4 1,4.89 1,6v12h2c0,1.66 1.34,3 3,3s3-1.34 3-3h6c0,1.66 1.34,3 3,3s3-1.34 3-3h2v-5L20,8z M6,18.5c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5s1.5,0.67 1.5,1.5S6.83,18.5 6,18.5z M18,18.5c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5s1.5,0.67 1.5,1.5S18.83,18.5 18,18.5z M17,12V9.5h2.5L21,12H17z',
      scale: 1,
      fillColor: '#ef4444',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      anchor: { x: 12, y: 12 }
    };
  };

  const confirmStationCompletion = (stationId) => {
    console.log(`Confirming completion for station: ${stationId}`);
    // Update the station status to completed
    const updatedRoute = selectedDelivery.route.map(station => 
      station.id === stationId 
        ? { ...station, status: 'completed', completedTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
        : station
    );
    
    setSelectedDelivery({
      ...selectedDelivery,
      route: updatedRoute
    });
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

  const hasTrackingData = selectedDelivery && selectedDelivery.route && selectedDelivery.route.length > 0;

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg" data-testid="logistics-tracking-map">
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
          {hasTrackingData && (
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedDelivery.number}</h3>
                  <p className="text-sm text-gray-600">{selectedDelivery.driver} - {selectedDelivery.vehicle}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {selectedDelivery.status === 'in-progress' ? 'Dalam Perjalanan' : 
                   selectedDelivery.status === 'completed' ? 'Selesai' : 'Terjadwal'}
                </Badge>
              </div>
            </div>
          )}

          {/* Map */}
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedDelivery.currentLocation || defaultCenter}
                zoom={hasTrackingData ? 8 : 6}
                options={mapOptions}
              >
                {/* Route Path */}
                {hasTrackingData && selectedDelivery.routePath && selectedDelivery.routePath.length > 0 && (
                  <Polyline
                    path={selectedDelivery.routePath}
                    options={{
                      strokeColor: '#3b82f6',
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }}
                  />
                )}

                {/* Station Markers */}
                {hasTrackingData && selectedDelivery.route.map((station) => (
                  <Marker
                    key={station.id}
                    position={station.position}
                    icon={getStationIcon(station)}
                    onClick={() => setSelectedMarker(station)}
                  />
                ))}

                {/* Current Truck Position */}
                {hasTrackingData && selectedDelivery.currentLocation && (
                  <Marker
                    position={selectedDelivery.currentLocation}
                    icon={getTruckIcon()}
                    onClick={() => setSelectedMarker({
                      id: 'truck',
                      name: `${selectedDelivery.vehicle} - ${selectedDelivery.driver}`,
                      type: 'truck',
                      status: selectedDelivery.status
                    })}
                  />
                )}

                {/* Info Window */}
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.position || selectedDelivery.currentLocation}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-3 min-w-[200px]">
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedMarker.type === 'truck' ? (
                          <Truck className="w-5 h-5 text-red-500" />
                        ) : selectedMarker.type === 'spbe' ? (
                          <Building2 className="w-5 h-5 text-blue-500" />
                        ) : (
                          <MapPin className="w-5 h-5 text-green-500" />
                        )}
                        <h4 className="font-semibold text-gray-900">{selectedMarker.name}</h4>
                      </div>
                      
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
                        
                        {selectedMarker.arrivalTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Waktu Tiba:</span>
                            <span className="font-medium">{selectedMarker.arrivalTime}</span>
                          </div>
                        )}
                        
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
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center text-gray-600">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Loading Map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Station Progress List */}
          {hasTrackingData ? (
            <>
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
                           station.type === 'spbe' ? 'SPBE' : 'Stasiun Transit'}
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
            </>
          ) : (
            <div className="text-center py-8">
              <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Surat Jalan untuk Tracking</h3>
              <p className="text-gray-600">Klik tombol "Lacak" pada kartu surat jalan untuk melihat detail rute dan progress pengiriman</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}