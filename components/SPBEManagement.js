'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, Plus, MapPin, Fuel, Package, BarChart3, 
  Eye, Edit, Trash2, Search, Filter, Download,
  CheckCircle2, AlertTriangle, Clock, Activity
} from 'lucide-react';

const mockSPBEList = [
  { 
    id: 'SPBE-001', 
    name: 'SPBE Jakarta Selatan', 
    companyName: 'PT Elpiji Nusantara Jakarta',
    location: 'Jakarta', 
    address: 'Jl. Raya Pasar Minggu No. 123, Jakarta Selatan', 
    stock: 15000, 
    capacity: 20000, 
    status: 'normal', 
    lat: -6.2615, 
    lng: 106.7815, 
    manager: 'Budi Santoso', 
    phone: '021-12345678', 
    established: '2020-01-15',
    businessLicense: 'NIB-1234567890123456',
    permits: 'SIUP/123/DKI/2020, TDP/456/DKI/2020',
    cooperationStart: '2020-01-15',
    cooperationEnd: '2025-01-14',
    cooperationStatus: 'active'
  },
  { 
    id: 'SPBE-002', 
    name: 'SPBE Surabaya Timur',
    companyName: 'CV Gas Mandiri Surabaya', 
    location: 'Surabaya', 
    address: 'Jl. Ahmad Yani No. 456, Surabaya', 
    stock: 8500, 
    capacity: 15000, 
    status: 'low', 
    lat: -7.2756, 
    lng: 112.7378, 
    manager: 'Siti Aminah', 
    phone: '031-87654321', 
    established: '2019-08-20',
    businessLicense: 'NIB-2345678901234567',
    permits: 'SIUP/789/JATIM/2019, TDP/012/JATIM/2019',
    cooperationStart: '2019-08-20',
    cooperationEnd: '2024-08-19',
    cooperationStatus: 'expires_soon'
  },
  { 
    id: 'SPBE-003', 
    name: 'SPBE Bandung Utara',
    companyName: 'PT Sumber Gas Bandung',
    location: 'Bandung', 
    address: 'Jl. Cihampelas No. 789, Bandung', 
    stock: 12000, 
    capacity: 18000, 
    status: 'normal', 
    lat: -6.9147, 
    lng: 107.6098, 
    manager: 'Ahmad Fauzi', 
    phone: '022-11223344', 
    established: '2021-03-10',
    businessLicense: 'NIB-3456789012345678',
    permits: 'SIUP/345/JABAR/2021, TDP/678/JABAR/2021',
    cooperationStart: '2021-03-10',
    cooperationEnd: '2026-03-09',
    cooperationStatus: 'active'
  },
  { 
    id: 'SPBE-004', 
    name: 'SPBE Medan Barat',
    companyName: 'UD Berkah Gas Medan',
    location: 'Medan', 
    address: 'Jl. Gatot Subroto No. 321, Medan', 
    stock: 2500, 
    capacity: 12000, 
    status: 'critical', 
    lat: 3.5952, 
    lng: 98.6722, 
    manager: 'Rina Wati', 
    phone: '061-99887766', 
    established: '2018-11-05',
    businessLicense: 'NIB-4567890123456789',
    permits: 'SIUP/901/SUMUT/2018, TDP/234/SUMUT/2018',
    cooperationStart: '2018-11-05',
    cooperationEnd: '2023-11-04',
    cooperationStatus: 'expired'
  },
  { 
    id: 'SPBE-005', 
    name: 'SPBE Makassar',
    companyName: 'PT Indo Gas Makassar',
    location: 'Makassar', 
    address: 'Jl. Sultan Alauddin No. 654, Makassar', 
    stock: 9800, 
    capacity: 14000, 
    status: 'normal', 
    lat: -5.1477, 
    lng: 119.4327, 
    manager: 'Hendra Gunawan', 
    phone: '0411-55443322', 
    established: '2020-07-18',
    businessLicense: 'NIB-5678901234567890',
    permits: 'SIUP/567/SULSEL/2020, TDP/890/SULSEL/2020',
    cooperationStart: '2020-07-18',
    cooperationEnd: '2025-07-17',
    cooperationStatus: 'active'
  }
];

export default function SPBEManagement({ onViewDetail }) {
  const [spbeList, setSPBEList] = useState(mockSPBEList);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    location: '',
    address: '',
    capacity: '',
    manager: '',
    phone: '',
    lat: '',
    lng: '',
    businessLicense: '',
    permits: '',
    cooperationStart: '',
    cooperationEnd: ''
  });

  // Filter and search logic
  const filteredSPBE = spbeList.filter(spbe => {
    const matchesSearch = spbe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spbe.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spbe.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || spbe.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSPBE.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSPBE.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateSPBE = () => {
    const newSPBE = {
      id: `SPBE-${String(spbeList.length + 1).padStart(3, '0')}`,
      name: formData.name,
      location: formData.location,
      address: formData.address,
      stock: Math.floor(Math.random() * parseInt(formData.capacity)), // Random initial stock
      capacity: parseInt(formData.capacity),
      status: 'normal',
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      manager: formData.manager,
      phone: formData.phone,
      established: new Date().toISOString().split('T')[0]
    };

    setSPBEList([...spbeList, newSPBE]);
    setFormData({ name: '', location: '', address: '', capacity: '', manager: '', phone: '', lat: '', lng: '' });
    setShowCreateModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'normal':
        return { variant: 'default', text: 'Normal', color: 'bg-green-500' };
      case 'low':
        return { variant: 'secondary', text: 'Rendah', color: 'bg-yellow-500' };
      case 'critical':
        return { variant: 'destructive', text: 'Kritis', color: 'bg-red-500' };
      default:
        return { variant: 'outline', text: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Management SPBE</h2>
          <p className="text-gray-600">Kelola dan pantau seluruh Stasiun Pengisian Bulk Elpiji</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Tambah SPBE Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <Building2 className="w-6 h-6 mr-3" />
                Tambah SPBE Baru
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Buat dan daftarkan SPBE baru ke dalam sistem
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Nama SPBE</Label>
                  <Input
                    id="name"
                    placeholder="SPBE Jakarta Pusat"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700 font-medium">Nama Perusahaan</Label>
                  <Input
                    id="companyName"
                    placeholder="PT Elpiji Nusantara"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">Kota</Label>
                  <Input
                    id="location"
                    placeholder="Jakarta"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessLicense" className="text-gray-700 font-medium">Nomor Izin Usaha (NIB)</Label>
                  <Input
                    id="businessLicense"
                    placeholder="NIB-1234567890123456"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  placeholder="Jl. Sudirman No. 123, Jakarta Pusat"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permits" className="text-gray-700 font-medium">Perizinan</Label>
                <Textarea
                  id="permits"
                  placeholder="SIUP/123/DKI/2024, TDP/456/DKI/2024"
                  value={formData.permits}
                  onChange={(e) => setFormData({...formData, permits: e.target.value})}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-gray-700 font-medium">Kapasitas (Liter)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="20000"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manager" className="text-gray-700 font-medium">Manager</Label>
                  <Input
                    id="manager"
                    placeholder="Nama Manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Telepon</Label>
                  <Input
                    id="phone"
                    placeholder="021-12345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cooperationStart" className="text-gray-700 font-medium">Mulai Kerjasama</Label>
                  <Input
                    id="cooperationStart"
                    type="date"
                    value={formData.cooperationStart}
                    onChange={(e) => setFormData({...formData, cooperationStart: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cooperationEnd" className="text-gray-700 font-medium">Berakhir Kerjasama</Label>
                  <Input
                    id="cooperationEnd"
                    type="date"
                    value={formData.cooperationEnd}
                    onChange={(e) => setFormData({...formData, cooperationEnd: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat" className="text-gray-700 font-medium">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    placeholder="-6.2088"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lng" className="text-gray-700 font-medium">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.000001"
                    placeholder="106.8456"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCreateSPBE}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  disabled={!formData.name || !formData.location || !formData.capacity}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah SPBE
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari SPBE, lokasi, atau manager..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="critical">Kritis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SPBE Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {currentItems.map((spbe) => {
            const statusBadge = getStatusBadge(spbe.status);
            const utilizationRate = (spbe.stock / spbe.capacity) * 100;
            
            return (
              <motion.div
                key={spbe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="cursor-pointer"
              >
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        {getStatusIcon(spbe.status)}
                      </div>
                      <Badge 
                        variant={statusBadge.variant} 
                        className={`${statusBadge.color} text-white text-xs px-2 py-1`}
                      >
                        {statusBadge.text}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">{spbe.name}</CardTitle>
                    <CardDescription className="text-gray-600 flex items-center text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {spbe.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stok</span>
                        <span className="font-medium text-gray-900">{spbe.stock.toLocaleString()}L</span>
                      </div>
                      <Progress value={utilizationRate} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0L</span>
                        <span>{spbe.capacity.toLocaleString()}L</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager</span>
                        <span className="font-medium text-gray-900">{spbe.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telepon</span>
                        <span className="font-medium text-gray-900">{spbe.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        onClick={() => onViewDetail && onViewDetail(spbe)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detail
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">
                  Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSPBE.length)} dari {filteredSPBE.length} SPBE
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Sebelumnya
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 
                        'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 
                        'text-gray-700 border-gray-300 hover:bg-gray-50'
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}