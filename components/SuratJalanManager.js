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
    notes: 'Pengiriman sesuai jadwal'
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
    notes: 'Dalam perjalanan'
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
    notes: 'Menunggu konfirmasi jadwal'
  }
];

export default function SuratJalanManager() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSJ, setSelectedSJ] = useState(null);
  const [suratJalanList, setSuratJalanList] = useState(mockSuratJalan);
  const [formData, setFormData] = useState({
    driver: '',
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    destinations: [{ spbe: '', volume: '', notes: '' }],
    generalNotes: ''
  });

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
      notes: formData.generalNotes
    };

    setSuratJalanList([newSJ, ...suratJalanList]);
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

      {/* Surat Jalan List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suratJalanList.map((sj) => {
          const statusBadge = getStatusBadge(sj.status);
          return (
            <motion.div
              key={sj.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-gray-900">{sj.number}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {new Date(sj.date).toLocaleDateString('id-ID')}
                      </CardDescription>
                    </div>
                    <Badge variant={statusBadge.variant} className={`${statusBadge.color} text-white`}>
                      {statusBadge.text}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>{sj.driver} - {sj.vehicle}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Route className="w-4 h-4 mr-2" />
                      <span>{sj.route}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-2" />
                      <span>{sj.totalVolume.toLocaleString()} L</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Destinasi ({sj.destinations.length}):</p>
                    <div className="space-y-1">
                      {sj.destinations.map((dest, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{dest.spbe}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{dest.volume.toLocaleString()}L</span>
                            {dest.delivered ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Clock className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-3 border-t">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => setSelectedSJ(sj)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Detail
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Unduh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

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
                  <p className="text-sm text-gray-600 mb-2">Catatan</p>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedSJ.notes}</p>
                </div>
              )}
              
              <div className="flex space-x-3 pt-4 border-t">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Navigation className="w-4 h-4 mr-2" />
                  Lacak Pengiriman
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Download className="w-4 h-4 mr-2" />
                  Unduh PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}