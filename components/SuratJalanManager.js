'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Plus, Truck, MapPin, Calendar, User, Package,
  Route, Clock, CheckCircle2, AlertCircle, Eye, Download, 
  X, Navigation, Fuel, Target, Edit
} from 'lucide-react';

const mockDrivers = [
  { id: 'DRV-001', name: 'Ahmad Sutrisno', vehicle: 'TRK-001', status: 'available' },
  { id: 'DRV-002', name: 'Budi Hartono', vehicle: 'TRK-002', status: 'on-delivery' },
  { id: 'DRV-003', name: 'Candra Wijaya', vehicle: 'TRK-003', status: 'available' },
  { id: 'DRV-004', name: 'Dedi Prakoso', vehicle: 'TRK-004', status: 'available' }
];

const mockSPBEDestinations = [
  { id: 'SPBE-001', name: 'SPBE Jakarta Selatan', address: 'Jl. Raya Pasar Minggu No. 123, Jakarta Selatan', capacity: 20000, currentStock: 15000 },
  { id: 'SPBE-002', name: 'SPBE Surabaya Timur', address: 'Jl. Ahmad Yani No. 456, Surabaya', capacity: 15000, currentStock: 8500 },
  { id: 'SPBE-003', name: 'SPBE Bandung Utara', address: 'Jl. Cihampelas No. 789, Bandung', capacity: 18000, currentStock: 12000 },
  { id: 'SPBE-004', name: 'SPBE Medan Barat', address: 'Jl. Gatot Subroto No. 321, Medan', capacity: 12000, currentStock: 2500 },
  { id: 'SPBE-005', name: 'SPBE Makassar', address: 'Jl. Sultan Alauddin No. 654, Makassar', capacity: 14000, currentStock: 9800 }
];

const mockSuratJalan = [
  {
    id: 'SJ-001',
    number: 'SJ/PTM/2024/001',
    date: '2024-01-15',
    driver: 'Ahmad Sutrisno',
    vehicle: 'TRK-001',
    status: 'completed',
    destinations: [
      { spbe: 'SPBE Jakarta Selatan', volume: 5000, delivered: true },
      { spbe: 'SPBE Bandung Utara', volume: 3000, delivered: true }
    ],
    totalVolume: 8000,
    route: 'Jakarta → Bandung',
    notes: 'Pengiriman sesuai jadwal',
    trackingData: {
      currentLocation: { lat: -6.9147, lng: 107.6098 },
      route: [
        {
          id: 'depot-1',
          name: 'Depot Jakarta',
          position: { lat: -6.2088, lng: 106.8456 },
          status: 'completed',
          arrivalTime: '06:00',
          completedTime: '06:30',
          type: 'depot'
        },
        {
          id: 'spbe-1',
          name: 'SPBE Jakarta Selatan',
          position: { lat: -6.2615, lng: 106.7815 },
          status: 'completed',
          arrivalTime: '08:00',
          completedTime: '08:45',
          type: 'spbe',
          volume: 5000
        },
        {
          id: 'spbe-2',
          name: 'SPBE Bandung Utara',
          position: { lat: -6.9147, lng: 107.6098 },
          status: 'completed',
          arrivalTime: '12:00',
          completedTime: '12:30',
          type: 'spbe',
          volume: 3000
        }
      ],
      routePath: [
        { lat: -6.2088, lng: 106.8456 },
        { lat: -6.2615, lng: 106.7815 },
        { lat: -6.9147, lng: 107.6098 }
      ]
    }
  },
  {
    id: 'SJ-002',
    number: 'SJ/PTM/2024/002',
    date: '2024-01-16',
    driver: 'Budi Hartono',
    vehicle: 'TRK-002',
    status: 'in-progress',
    destinations: [
      { spbe: 'SPBE Surabaya Timur', volume: 4200, delivered: false }
    ],
    totalVolume: 4200,
    route: 'Surabaya',
    notes: 'Dalam perjalanan',
    trackingData: {
      currentLocation: { lat: -7.2504, lng: 112.7688 },
      route: [
        {
          id: 'depot-2',
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
          id: 'spbe-3',
          name: 'SPBE Surabaya Timur',
          position: { lat: -7.2756, lng: 112.7378 },
          status: 'in-progress',
          arrivalTime: '10:45',
          completedTime: null,
          type: 'spbe',
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
  },
  {
    id: 'SJ-003',
    number: 'SJ/PTM/2024/003',
    date: '2024-01-17',
    driver: 'Candra Wijaya',
    vehicle: 'TRK-003',
    status: 'scheduled',
    destinations: [
      { spbe: 'SPBE Medan Barat', volume: 6000, delivered: false },
      { spbe: 'SPBE Makassar', volume: 2000, delivered: false }
    ],
    totalVolume: 8000,
    route: 'Medan → Makassar',
    notes: 'Menunggu konfirmasi jadwal',
    trackingData: {
      currentLocation: { lat: 3.5952, lng: 98.6722 },
      route: [
        {
          id: 'depot-3',
          name: 'Depot Medan',
          position: { lat: 3.5833, lng: 98.6667 },
          status: 'scheduled',
          arrivalTime: '07:00',
          completedTime: null,
          type: 'depot'
        },
        {
          id: 'spbe-4',
          name: 'SPBE Medan Barat',
          position: { lat: 3.5952, lng: 98.6722 },
          status: 'scheduled',
          arrivalTime: '09:00',
          completedTime: null,
          type: 'spbe',
          volume: 6000
        },
        {
          id: 'spbe-5',
          name: 'SPBE Makassar',
          position: { lat: -5.1477, lng: 119.4327 },
          status: 'scheduled',
          arrivalTime: '18:00',
          completedTime: null,
          type: 'spbe',
          volume: 2000
        }
      ],
      routePath: [
        { lat: 3.5833, lng: 98.6667 },
        { lat: 3.5952, lng: 98.6722 },
        { lat: -5.1477, lng: 119.4327 }
      ]
    }
  }
];

export default function SuratJalanManager({ onTrackDelivery }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSJ, setSelectedSJ] = useState(null);
  const [suratJalanList, setSuratJalanList] = useState(mockSuratJalan);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 cards per page
  const [formData, setFormData] = useState({
    driver: '',
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    destinations: [{ spbe: '', volume: '', notes: '' }],
    generalNotes: ''
  });

  // Calculate pagination
  const totalPages = Math.ceil(suratJalanList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = suratJalanList.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const addDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, { spbe: '', volume: '', notes: '' }]
    });
  };

  const removeDestination = (index) => {
    const newDestinations = formData.destinations.filter((_, i) => i !== index);
    setFormData({ ...formData, destinations: newDestinations });
  };

  const updateDestination = (index, field, value) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index][field] = value;
    setFormData({ ...formData, destinations: newDestinations });
  };

  const handleCreateSuratJalan = () => {
    const newSJ = {
      id: `SJ-${String(suratJalanList.length + 1).padStart(3, '0')}`,
      number: `SJ/PTM/2024/${String(suratJalanList.length + 1).padStart(3, '0')}`,
      date: formData.date,
      driver: mockDrivers.find(d => d.id === formData.driver)?.name || '',
      vehicle: formData.vehicle,
      status: 'scheduled',
      destinations: formData.destinations
        .filter(dest => dest.spbe && dest.volume)
        .map(dest => ({
          spbe: mockSPBEDestinations.find(s => s.id === dest.spbe)?.name || '',
          volume: parseInt(dest.volume),
          delivered: false,
          notes: dest.notes
        })),
      totalVolume: formData.destinations.reduce((sum, dest) => sum + (parseInt(dest.volume) || 0), 0),
      route: formData.destinations
        .filter(dest => dest.spbe)
        .map(dest => mockSPBEDestinations.find(s => s.id === dest.spbe)?.name?.split(' ')[1] || '')
        .join(' → '),
      notes: formData.generalNotes,
      trackingData: {
        currentLocation: { lat: -6.2088, lng: 106.8456 },
        route: [],
        routePath: []
      }
    };

    setSuratJalanList([newSJ, ...suratJalanList]);
    setCurrentPage(1); // Go back to first page to see the new item
    setFormData({
      driver: '',
      vehicle: '',
      date: new Date().toISOString().split('T')[0],
      destinations: [{ spbe: '', volume: '', notes: '' }],
      generalNotes: ''
    });
    setShowCreateModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { variant: 'default', text: 'Selesai', color: 'bg-green-500' };
      case 'in-progress':
        return { variant: 'secondary', text: 'Dalam Perjalanan', color: 'bg-blue-500' };
      case 'scheduled':
        return { variant: 'outline', text: 'Terjadwal', color: 'bg-yellow-500' };
      default:
        return { variant: 'outline', text: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const getTotalVolume = () => {
    return formData.destinations.reduce((sum, dest) => sum + (parseInt(dest.volume) || 0), 0);
  };

  const handleTrackDelivery = (sj) => {
    if (onTrackDelivery) {
      onTrackDelivery(sj.trackingData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Surat Jalan</h2>
          <p className="text-gray-600">Kelola surat jalan pengiriman dengan multi-destinasi dan optimasi rute</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Buat Surat Jalan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <FileText className="w-6 h-6 mr-3" />
                Buat Surat Jalan Multi-Destinasi
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Buat surat jalan baru dengan multiple destinasi dan optimasi rute otomatis
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Driver & Vehicle Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driver" className="text-gray-700 font-medium">Pengemudi</Label>
                  <Select value={formData.driver} onValueChange={(value) => setFormData({...formData, driver: value})}>
                    <SelectTrigger className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
                      <SelectValue placeholder="Pilih pengemudi" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.filter(d => d.status === 'available').map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{driver.name} - {driver.vehicle}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 font-medium">Tanggal Pengiriman</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Destinations */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-medium text-lg">Destinasi Pengiriman</Label>
                  <Button
                    type="button"
                    onClick={addDestination}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Destinasi
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.destinations.map((destination, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Destinasi {index + 1}</h4>
                        {formData.destinations.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDestination(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">SPBE Tujuan</Label>
                          <Select 
                            value={destination.spbe} 
                            onValueChange={(value) => updateDestination(index, 'spbe', value)}
                          >
                            <SelectTrigger className="bg-white border-gray-200">
                              <SelectValue placeholder="Pilih SPBE" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSPBEDestinations.map((spbe) => (
                                <SelectItem key={spbe.id} value={spbe.id}>
                                  <div className="space-y-1">
                                    <div className="font-medium">{spbe.name}</div>
                                    <div className="text-xs text-gray-500">{spbe.address}</div>
                                    <div className="text-xs text-blue-600">
                                      Stok: {spbe.currentStock.toLocaleString()}L / {spbe.capacity.toLocaleString()}L
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-700">Volume (Liter)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={destination.volume}
                            onChange={(e) => updateDestination(index, 'volume', e.target.value)}
                            className="bg-white border-gray-200"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Label className="text-gray-700">Catatan Khusus</Label>
                        <Input
                          placeholder="Catatan untuk destinasi ini..."
                          value={destination.notes}
                          onChange={(e) => updateDestination(index, 'notes', e.target.value)}
                          className="bg-white border-gray-200 mt-1"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Volume Pengiriman</p>
                      <p className="text-2xl font-bold text-emerald-700">{getTotalVolume().toLocaleString()} L</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Destinasi</p>
                      <p className="text-2xl font-bold text-emerald-700">{formData.destinations.filter(d => d.spbe).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* General Notes */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Catatan Umum</Label>
                <Textarea
                  placeholder="Catatan umum untuk surat jalan ini..."
                  value={formData.generalNotes}
                  onChange={(e) => setFormData({...formData, generalNotes: e.target.value})}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCreateSuratJalan}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  disabled={!formData.driver || formData.destinations.filter(d => d.spbe && d.volume).length === 0}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Buat Surat Jalan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Surat Jalan List - Clean Simple Design Focused on Content */}
      <div className="space-y-4">
        {currentItems.map((sj) => {
          const statusBadge = getStatusBadge(sj.status);
          return (
            <motion.div
              key={sj.id}
              whileHover={{ scale: 1.01 }}
              className="cursor-pointer"
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{sj.number}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(sj.date).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={statusBadge.variant} 
                      className={`${statusBadge.color} text-white px-3 py-1 text-sm font-medium shadow-sm`}
                    >
                      {statusBadge.text}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Driver & Vehicle */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Pengemudi & Kendaraan</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-900">
                          <User className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">{sj.driver}</span>
                        </div>
                        <div className="flex items-center text-gray-900">
                          <Truck className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="font-medium">{sj.vehicle}</span>
                        </div>
                      </div>
                    </div>

                    {/* Route & Volume */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Rute & Volume</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-900">
                          <Route className="w-4 h-4 mr-2 text-green-500" />
                          <span className="font-medium">{sj.route}</span>
                        </div>
                        <div className="flex items-center text-gray-900">
                          <Package className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="font-bold">{sj.totalVolume.toLocaleString()} L</span>
                        </div>
                      </div>
                    </div>

                    {/* Destinations */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Destinasi ({sj.destinations.length})</h4>
                      <div className="space-y-2 max-h-20 overflow-y-auto">
                        {sj.destinations.map((dest, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center flex-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              <span className="text-sm font-medium text-gray-900 truncate">{dest.spbe}</span>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              <span className="text-xs font-bold text-gray-700">{dest.volume.toLocaleString()}L</span>
                              {dest.delivered ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => handleTrackDelivery(sj)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Lacak Pengiriman
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                      onClick={() => setSelectedSJ(sj)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, suratJalanList.length)} dari {suratJalanList.length} surat jalan
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                >
                  Sebelumnya
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={currentPage === page ? 
                        'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg transform hover:scale-110 transition-all duration-200' : 
                        'text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-200'
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedSJ} onOpenChange={() => setSelectedSJ(null)}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <FileText className="w-6 h-6 mr-3" />
              Detail Surat Jalan {selectedSJ?.number}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Informasi lengkap surat jalan dan status pengiriman
            </DialogDescription>
          </DialogHeader>
          
          {selectedSJ && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Pengemudi & Kendaraan</p>
                    <p className="font-medium text-gray-900">{selectedSJ.driver} - {selectedSJ.vehicle}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pengiriman</p>
                    <p className="font-medium text-gray-900">{new Date(selectedSJ.date).toLocaleDateString('id-ID')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={getStatusBadge(selectedSJ.status).variant} className={`${getStatusBadge(selectedSJ.status).color} text-white`}>
                      {getStatusBadge(selectedSJ.status).text}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Rute Pengiriman</p>
                    <p className="font-medium text-gray-900">{selectedSJ.route}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Total Volume</p>
                    <p className="font-medium text-gray-900">{selectedSJ.totalVolume.toLocaleString()} L</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Total Destinasi</p>
                    <p className="font-medium text-gray-900">{selectedSJ.destinations.length} lokasi</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Detail Destinasi</h4>
                <div className="space-y-3">
                  {selectedSJ.destinations.map((dest, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{dest.spbe}</p>
                          <p className="text-sm text-gray-600">Volume: {dest.volume.toLocaleString()} L</p>
                          {dest.notes && <p className="text-xs text-gray-500 mt-1">{dest.notes}</p>}
                        </div>
                        <div className="flex items-center">
                          {dest.delivered ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="w-5 h-5 mr-1" />
                              <span className="text-sm font-medium">Selesai</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <Clock className="w-5 h-5 mr-1" />
                              <span className="text-sm font-medium">Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedSJ.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Catatan Umum</p>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                    <p className="text-gray-900">{selectedSJ.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}