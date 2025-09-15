'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, LogOut, TrendingUp, Package, Truck, AlertTriangle, 
  MapPin, BarChart3, Clock, Users, Fuel, Navigation, 
  Activity, Zap, Bell, Eye, Filter, Download, RefreshCw,
  Map, Route, Gauge, Signal, Target, CheckCircle2, FileText, Plus
} from 'lucide-react';
import GoogleMapComponent from './GoogleMapComponent';
import SupplyChainMetrics from './SupplyChainMetrics';
import SuratJalanManager from './SuratJalanManager';
import LogisticsTrackingMap from './LogisticsTrackingMap';
import SPBEDetail from './SPBEDetail';
import SPBEManagement from './SPBEManagement';

// Mock data untuk dashboard
const mockSPBEData = [
  { id: 'SPBE-001', name: 'SPBE Jakarta Selatan', location: 'Jakarta', stock: 15000, capacity: 20000, status: 'normal', lat: -6.2615, lng: 106.7815 },
  { id: 'SPBE-002', name: 'SPBE Surabaya Timur', location: 'Surabaya', stock: 8500, capacity: 15000, status: 'low', lat: -7.2756, lng: 112.7378 },
  { id: 'SPBE-003', name: 'SPBE Bandung Utara', location: 'Bandung', stock: 12000, capacity: 18000, status: 'normal', lat: -6.9147, lng: 107.6098 },
  { id: 'SPBE-004', name: 'SPBE Medan Barat', location: 'Medan', stock: 2500, capacity: 12000, status: 'critical', lat: 3.5952, lng: 98.6722 },
  { id: 'SPBE-005', name: 'SPBE Makassar', location: 'Makassar', stock: 9800, capacity: 14000, status: 'normal', lat: -5.1477, lng: 119.4327 }
];

const mockVehicles = [
  { id: 'TRK-001', name: 'Truck Jakarta-01', status: 'active', position: { lat: -6.2088, lng: 106.8456 }, destination: 'SPBE Jakarta Selatan', cargo: 5000 },
  { id: 'TRK-002', name: 'Truck Surabaya-01', status: 'active', position: { lat: -7.2504, lng: 112.7688 }, destination: 'SPBE Surabaya Timur', cargo: 4200 },
  { id: 'TRK-003', name: 'Truck Bandung-01', status: 'maintenance', position: { lat: -6.9175, lng: 107.6191 }, destination: 'Depot Bandung', cargo: 0 },
  { id: 'TRK-004', name: 'Truck Medan-01', status: 'active', position: { lat: 3.5833, lng: 98.6667 }, destination: 'SPBE Medan Barat', cargo: 6000 }
];

const mockDeliveries = [
  { id: 'DEL-001', route: 'Depot Jakarta → SPBE Jakarta Selatan', status: 'in-transit', progress: 75, eta: '2 jam', driver: 'Ahmad Sutrisno' },
  { id: 'DEL-002', route: 'Depot Surabaya → SPBE Surabaya Timur', status: 'delivered', progress: 100, eta: 'Selesai', driver: 'Budi Hartono' },
  { id: 'DEL-003', route: 'Depot Bandung → SPBE Bandung Utara', status: 'scheduled', progress: 0, eta: '4 jam', driver: 'Candra Wijaya' },
  { id: 'DEL-004', route: 'Depot Medan → SPBE Medan Barat', status: 'urgent', progress: 25, eta: '6 jam', driver: 'Dedi Prakoso' }
];

export default function PertaminaDashboard({ userRole, onLogout }) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSPBE, setSelectedSPBE] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapView, setMapView] = useState('distribution');
  const [trackingData, setTrackingData] = useState(null);
  const [showSPBEDetail, setShowSPBEDetail] = useState(false);
  const [selectedSPBEForDetail, setSelectedSPBEForDetail] = useState(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getTotalStats = () => {
    const totalCapacity = mockSPBEData.reduce((sum, spbe) => sum + spbe.capacity, 0);
    const totalStock = mockSPBEData.reduce((sum, spbe) => sum + spbe.stock, 0);
    const utilizationRate = (totalStock / totalCapacity) * 100;
    const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
    
    return { totalCapacity, totalStock, utilizationRate, activeVehicles };
  };

  const handleSPBECardClick = (spbe) => {
    setSelectedSPBEForDetail(spbe);
    setShowSPBEDetail(true);
  };

  const handleTrackDelivery = (tracking) => {
    setTrackingData(tracking);
  };

  const stats = getTotalStats();

  // Show SPBE Detail if selected
  if (showSPBEDetail && selectedSPBEForDetail) {
    return (
      <SPBEDetail 
        spbe={selectedSPBEForDetail} 
        onBack={() => {
          setShowSPBEDetail(false);
          setSelectedSPBEForDetail(null);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pertamina</h1>
                <p className="text-gray-600">Pusat Kendali Distribusi dan Manajemen Operasional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:border-yellow-300 transform hover:scale-105 transition-all duration-200"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                      <Bell className="w-6 h-6 mr-3 text-yellow-500" />
                      Sistem Alert & Notifikasi
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Pemantauan real-time alert dan notifikasi sistem operasional
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {[
                      { id: 1, type: 'critical', title: 'Stok Kritis - SPBE Medan Barat', message: 'Stok LPG mencapai level kritis (18%). Diperlukan pengiriman segera.', time: '5 menit lalu' },
                      { id: 2, type: 'warning', title: 'Keterlambatan Pengiriman TRK-003', message: 'Truck TRK-003 mengalami keterlambatan 2 jam dari jadwal.', time: '15 menit lalu' },
                      { id: 3, type: 'info', title: 'Maintenance Terjadwal SPBE Bandung', message: 'SPBE Bandung Utara akan menjalani maintenance sistem.', time: '2 jam lalu' }
                    ].map((alert) => (
                      <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                        alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge variant={
                            alert.type === 'critical' ? 'destructive' :
                            alert.type === 'warning' ? 'secondary' : 'outline'
                          }>
                            {alert.type === 'critical' ? 'Kritis' : alert.type === 'warning' ? 'Peringatan' : 'Info'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-200"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Perbarui Data
              </Button>
              <Button 
                onClick={onLogout} 
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar Sistem
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-lg shadow-lg border-0 h-14 p-1">
            <TabsTrigger 
              value="overview" 
              className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg h-full flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ringkasan Operasional</span>
            </TabsTrigger>
            <TabsTrigger 
              value="supply-chain" 
              className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg h-full flex items-center justify-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Manajemen Rantai Pasok</span>
            </TabsTrigger>
            <TabsTrigger 
              value="spbe-management" 
              className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg h-full flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Management SPBE</span>
            </TabsTrigger>
            <TabsTrigger 
              value="logistics" 
              className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg h-full flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Manajemen Logistik</span>
            </TabsTrigger>
            <TabsTrigger 
              value="command-center" 
              className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg h-full flex items-center justify-center space-x-2"
            >
              <Map className="w-4 h-4" />
              <span>Pusat Kendali Distribusi</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-32">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Kapasitas Nasional</CardTitle>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Fuel className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCapacity.toLocaleString()} L</div>
                  <p className="text-xs text-gray-500 mt-2">Seluruh SPBE Aktif</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-32">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Stok Tersedia</CardTitle>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalStock.toLocaleString()} L</div>
                  <p className="text-xs text-gray-500 mt-2">Stok Real-time</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-32">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Tingkat Utilisasi</CardTitle>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
                    <Gauge className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.utilizationRate.toFixed(1)}%</div>
                  <Progress value={stats.utilizationRate} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-32">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Armada Operasional</CardTitle>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeVehicles}</div>
                  <p className="text-xs text-gray-500 mt-2">Dari {mockVehicles.length} Total Unit</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* SPBE Status Grid - Fixed card heights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center text-xl">
                    <Building2 className="w-6 h-6 mr-3" />
                    Monitoring Status SPBE Real-time
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Pemantauan komprehensif tingkat stok dan status operasional seluruh SPBE
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockSPBEData.map((spbe) => (
                      <motion.div
                        key={spbe.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg h-48 flex flex-col justify-between"
                        onClick={() => handleSPBECardClick(spbe)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{spbe.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{spbe.location}</p>
                          </div>
                          <Badge variant={
                            spbe.status === 'critical' ? 'destructive' :
                            spbe.status === 'low' ? 'secondary' : 'default'
                          } className="shadow-sm ml-2 flex-shrink-0">
                            {spbe.status === 'critical' ? 'Kritis' : spbe.status === 'low' ? 'Rendah' : 'Normal'}
                          </Badge>
                        </div>
                        <div className="space-y-3 flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Stok Tersedia</span>
                            <span className="font-medium text-gray-900">{spbe.stock.toLocaleString()}L</span>
                          </div>
                          <Progress value={(spbe.stock / spbe.capacity) * 100} className="h-3" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Kapasitas Total</span>
                            <span className="font-medium text-gray-900">{spbe.capacity.toLocaleString()}L</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Supply Chain Tab */}
          <TabsContent value="supply-chain" className="space-y-6">
            <SupplyChainMetrics />
            
            {/* Logistics Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center text-xl">
                    <Truck className="w-6 h-6 mr-3" />
                    Status Pengiriman Terkini
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Pemantauan real-time seluruh aktivitas distribusi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDeliveries.map((delivery) => (
                    <div key={delivery.id} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{delivery.route}</h4>
                          <p className="text-xs text-gray-600">Pengemudi: {delivery.driver}</p>
                        </div>
                        <Badge variant={
                          delivery.status === 'urgent' ? 'destructive' :
                          delivery.status === 'delivered' ? 'default' :
                          delivery.status === 'in-transit' ? 'secondary' : 'outline'
                        } className="shadow-sm ml-2 flex-shrink-0">
                          {delivery.status === 'urgent' ? 'Mendesak' : 
                           delivery.status === 'delivered' ? 'Selesai' :
                           delivery.status === 'in-transit' ? 'Dalam Perjalanan' : 'Terjadwal'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={delivery.progress} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Progress: {delivery.progress}%</span>
                          <span className="font-medium text-gray-900">ETA: {delivery.eta}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* SPBE Management Tab */}
          <TabsContent value="spbe-management" className="space-y-6">
            <SPBEManagement onViewDetail={handleSPBECardClick} />
          </TabsContent>

          {/* Logistics Tab - Enhanced with tracking map */}
          <TabsContent value="logistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <SuratJalanManager onTrackDelivery={handleTrackDelivery} />
              </div>
              <div>
                <LogisticsTrackingMap trackingData={trackingData} />
              </div>
            </div>
          </TabsContent>

          {/* Command Center Tab - Full Map Only */}
          <TabsContent value="command-center" className="space-y-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[calc(100vh-200px)]"
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 flex items-center text-xl">
                      <Map className="w-6 h-6 mr-3" />
                      Pusat Kendali Distribusi
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMapView(mapView === 'distribution' ? 'supply-chain' : 'distribution')}
                        className="text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-200"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {mapView === 'distribution' ? 'Lihat Supply Chain' : 'Lihat Distribusi'}
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {mapView === 'distribution' 
                      ? 'Peta distribusi real-time dengan lokasi SPBE dan status operasional'
                      : 'Visualisasi rantai pasok dan jalur distribusi LPG'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 h-[calc(100%-80px)]">
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-inner">
                    <GoogleMapComponent mapView={mapView} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* SPBE Detail Modal */}
      <Dialog open={!!selectedSPBE} onOpenChange={() => setSelectedSPBE(null)}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Building2 className="w-6 h-6 mr-3" />
              {selectedSPBE?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Informasi detail dan status operasional SPBE
            </DialogDescription>
          </DialogHeader>
          {selectedSPBE && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Status Operasional</p>
                  <Badge variant={
                    selectedSPBE.status === 'critical' ? 'destructive' :
                    selectedSPBE.status === 'low' ? 'secondary' : 'default'
                  }>
                    {selectedSPBE.status === 'critical' ? 'Kritis' : selectedSPBE.status === 'low' ? 'Rendah' : 'Normal'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Lokasi</p>
                  <p className="font-medium text-gray-900">{selectedSPBE.location}</p>
                </div>
              </div>
              
              <Separator className="bg-gray-200" />
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 text-lg">Detail Inventori</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stok Saat Ini</span>
                    <span className="font-medium text-gray-900">{selectedSPBE.stock.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kapasitas Total</span>
                    <span className="font-medium text-gray-900">{selectedSPBE.capacity.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tingkat Pengisian</span>
                    <span className="font-medium text-gray-900">{((selectedSPBE.stock / selectedSPBE.capacity) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={(selectedSPBE.stock / selectedSPBE.capacity) * 100} className="h-4" />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat di Peta
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analisis Trend
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}