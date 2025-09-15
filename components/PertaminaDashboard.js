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

// Enhanced mock data with more statistics
const enhancedStats = {
  totalSPBE: 125,
  activeSPBE: 124,
  totalCapacity: 2500000, // 2.5M liters
  totalStock: 1875000, // 1.875M liters
  dailySales: 185000, // 185K liters today
  monthlyRevenue: 4750000000, // 4.75B rupiah this month
  activeVehicles: 89,
  deliveriesCompleted: 342,
  pendingDeliveries: 28,
  averageUtilization: 75,
  criticalSPBE: 3,
  maintenanceSPBE: 1,
  topPerformingSPBE: 'SPBE Jakarta Selatan',
  efficiency: 94.2,
  fuelQuality: 99.8,
  customerSatisfaction: 96.5
};

// Enhanced mock data for maps with more locations
const enhancedSPBEData = [
  // Jakarta Region
  { id: 'SPBE-001', name: 'SPBE Jakarta Selatan', location: 'Jakarta', stock: 15000, capacity: 20000, status: 'normal', lat: -6.2615, lng: 106.7815, region: 'Jakarta', dailyThroughput: 2500 },
  { id: 'SPBE-002', name: 'SPBE Jakarta Utara', location: 'Jakarta', stock: 18000, capacity: 25000, status: 'normal', lat: -6.1244, lng: 106.8294, region: 'Jakarta', dailyThroughput: 3200 },
  { id: 'SPBE-003', name: 'SPBE Jakarta Barat', location: 'Jakarta', stock: 8500, capacity: 15000, status: 'low', lat: -6.1751, lng: 106.7650, region: 'Jakarta', dailyThroughput: 1800 },
  { id: 'SPBE-004', name: 'SPBE Jakarta Timur', location: 'Jakarta', stock: 22000, capacity: 30000, status: 'normal', lat: -6.2146, lng: 106.8451, region: 'Jakarta', dailyThroughput: 4100 },
  { id: 'SPBE-005', name: 'SPBE Jakarta Pusat', location: 'Jakarta', stock: 12000, capacity: 18000, status: 'normal', lat: -6.2088, lng: 106.8456, region: 'Jakarta', dailyThroughput: 2800 },
  
  // Surabaya Region
  { id: 'SPBE-006', name: 'SPBE Surabaya Timur', location: 'Surabaya', stock: 8500, capacity: 15000, status: 'low', lat: -7.2756, lng: 112.7378, region: 'Surabaya', dailyThroughput: 1900 },
  { id: 'SPBE-007', name: 'SPBE Surabaya Barat', location: 'Surabaya', stock: 14000, capacity: 20000, status: 'normal', lat: -7.2575, lng: 112.7521, region: 'Surabaya', dailyThroughput: 2600 },
  { id: 'SPBE-008', name: 'SPBE Surabaya Selatan', location: 'Surabaya', stock: 16500, capacity: 22000, status: 'normal', lat: -7.3194, lng: 112.7277, region: 'Surabaya', dailyThroughput: 3100 },
  
  // Bandung Region
  { id: 'SPBE-009', name: 'SPBE Bandung Utara', location: 'Bandung', stock: 12000, capacity: 18000, status: 'normal', lat: -6.9147, lng: 107.6098, region: 'Bandung', dailyThroughput: 2400 },
  { id: 'SPBE-010', name: 'SPBE Bandung Selatan', location: 'Bandung', stock: 7500, capacity: 15000, status: 'low', lat: -6.9175, lng: 107.6191, region: 'Bandung', dailyThroughput: 1600 },
  { id: 'SPBE-011', name: 'SPBE Cimahi', location: 'Bandung', stock: 13500, capacity: 20000, status: 'normal', lat: -6.8737, lng: 107.5420, region: 'Bandung', dailyThroughput: 2200 },
  
  // Medan Region
  { id: 'SPBE-012', name: 'SPBE Medan Barat', location: 'Medan', stock: 2500, capacity: 12000, status: 'critical', lat: 3.5952, lng: 98.6722, region: 'Medan', dailyThroughput: 800 },
  { id: 'SPBE-013', name: 'SPBE Medan Timur', location: 'Medan', stock: 9500, capacity: 16000, status: 'normal', lat: 3.5840, lng: 98.7065, region: 'Medan', dailyThroughput: 2100 },
  { id: 'SPBE-014', name: 'SPBE Binjai', location: 'Medan', stock: 11000, capacity: 18000, status: 'normal', lat: 3.6004, lng: 98.4855, region: 'Medan', dailyThroughput: 1900 },
  
  // Makassar Region
  { id: 'SPBE-015', name: 'SPBE Makassar', location: 'Makassar', stock: 9800, capacity: 14000, status: 'normal', lat: -5.1477, lng: 119.4327, region: 'Makassar', dailyThroughput: 2000 },
  { id: 'SPBE-016', name: 'SPBE Gowa', location: 'Makassar', stock: 8200, capacity: 15000, status: 'normal', lat: -5.2117, lng: 119.4414, region: 'Makassar', dailyThroughput: 1700 },
  
  // Semarang Region
  { id: 'SPBE-017', name: 'SPBE Semarang Tengah', location: 'Semarang', stock: 15500, capacity: 22000, status: 'normal', lat: -6.9665, lng: 110.4203, region: 'Semarang', dailyThroughput: 2800 },
  { id: 'SPBE-018', name: 'SPBE Semarang Barat', location: 'Semarang', stock: 6800, capacity: 12000, status: 'critical', lat: -6.9932, lng: 110.4036, region: 'Semarang', dailyThroughput: 1200 },
  
  // Denpasar Region
  { id: 'SPBE-019', name: 'SPBE Denpasar', location: 'Denpasar', stock: 11200, capacity: 16000, status: 'normal', lat: -8.6705, lng: 115.2126, region: 'Denpasar', dailyThroughput: 2300 },
  { id: 'SPBE-020', name: 'SPBE Badung', location: 'Denpasar', stock: 7900, capacity: 14000, status: 'low', lat: -8.5569, lng: 115.1761, region: 'Denpasar', dailyThroughput: 1500 }
];

// Enhanced vehicle/truck data with routes
const enhancedVehicleData = [
  { id: 'TRK-001', driver: 'Ahmad Sutrisno', currentLat: -6.2088, currentLng: 106.8456, destination: 'SPBE Jakarta Selatan', status: 'en-route', capacity: 5000, currentLoad: 4500, eta: '14:30' },
  { id: 'TRK-002', driver: 'Budi Hartono', currentLat: -6.1751, currentLng: 106.7650, destination: 'SPBE Jakarta Barat', status: 'loading', capacity: 6000, currentLoad: 0, eta: '15:45' },
  { id: 'TRK-003', driver: 'Candra Wijaya', currentLat: -7.2756, currentLng: 112.7378, destination: 'SPBE Surabaya Timur', status: 'en-route', capacity: 4500, currentLoad: 4200, eta: '16:15' },
  { id: 'TRK-004', driver: 'Dedi Kurniawan', currentLat: -6.9147, currentLng: 107.6098, destination: 'SPBE Bandung Utara', status: 'delivered', capacity: 5500, currentLoad: 0, eta: 'Completed' },
  { id: 'TRK-005', driver: 'Eko Prasetyo', currentLat: 3.5952, currentLng: 98.6722, destination: 'SPBE Medan Barat', status: 'critical-delivery', capacity: 7000, currentLoad: 6500, eta: '13:45' }
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

          {/* Overview Tab - Enhanced Statistics */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <Badge className="bg-blue-500 text-white">Live</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{enhancedStats.totalSPBE}</h3>
                <p className="text-sm text-gray-600">Total SPBE</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {enhancedStats.activeSPBE} Active
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <Fuel className="w-8 h-8 text-green-600" />
                  <Badge className="bg-green-500 text-white">{enhancedStats.averageUtilization}%</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{(enhancedStats.totalStock / 1000000).toFixed(1)}M</h3>
                <p className="text-sm text-gray-600">Total Stok (L)</p>
                <div className="mt-2 flex items-center text-xs text-blue-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {enhancedStats.averageUtilization}% Utilized
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl shadow-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-8 h-8 text-purple-600" />
                  <Badge className="bg-purple-500 text-white">Today</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{(enhancedStats.dailySales / 1000).toFixed(0)}K</h3>
                <p className="text-sm text-gray-600">Penjualan Harian (L)</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs yesterday
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-2xl shadow-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <Truck className="w-8 h-8 text-orange-600" />
                  <Badge className="bg-orange-500 text-white">Active</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{enhancedStats.activeVehicles}</h3>
                <p className="text-sm text-gray-600">Kendaraan Aktif</p>
                <div className="mt-2 flex items-center text-xs text-blue-600">
                  <Activity className="w-3 h-3 mr-1" />
                  {enhancedStats.deliveriesCompleted} deliveries
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-2xl shadow-lg border border-teal-200">
                <div className="flex items-center justify-between mb-3">
                  <BarChart3 className="w-8 h-8 text-teal-600" />
                  <Badge className="bg-teal-500 text-white">{enhancedStats.efficiency}%</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Rp {(enhancedStats.monthlyRevenue / 1000000000).toFixed(1)}B</h3>
                <p className="text-sm text-gray-600">Pendapatan Bulan Ini</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Efficiency {enhancedStats.efficiency}%
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-2xl shadow-lg border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <Badge className="bg-red-500 text-white">Alert</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{enhancedStats.criticalSPBE}</h3>
                <p className="text-sm text-gray-600">SPBE Kritis</p>
                <div className="mt-2 flex items-center text-xs text-yellow-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Needs attention
                </div>
              </motion.div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Gauge className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Operational Efficiency</span>
                        <span className="text-sm font-bold text-green-600">{enhancedStats.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${enhancedStats.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Fuel Quality</span>
                        <span className="text-sm font-bold text-blue-600">{enhancedStats.fuelQuality}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                          style={{ width: `${enhancedStats.fuelQuality}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                        <span className="text-sm font-bold text-purple-600">{enhancedStats.customerSatisfaction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500"
                          style={{ width: `${enhancedStats.customerSatisfaction}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operations Summary */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Operations Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h4 className="text-2xl font-bold text-blue-600">{enhancedStats.deliveriesCompleted}</h4>
                      <p className="text-xs text-gray-600">Deliveries Completed</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <h4 className="text-2xl font-bold text-orange-600">{enhancedStats.pendingDeliveries}</h4>
                      <p className="text-xs text-gray-600">Pending Deliveries</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Top Performing SPBE</span>
                      <span className="text-sm font-medium text-green-600">{enhancedStats.topPerformingSPBE}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Maintenance Required</span>
                      <span className="text-sm font-medium text-yellow-600">{enhancedStats.maintenanceSPBE} SPBE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Utilization</span>
                      <span className="text-sm font-medium text-blue-600">{enhancedStats.averageUtilization}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SPBE Status Distribution */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    SPBE Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">Normal Operation</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">118</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-medium text-gray-700">Low Stock</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">4</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">Critical</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">{enhancedStats.criticalSPBE}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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

            {/* SPBE Status Cards - Enhanced with more data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 flex items-center text-xl">
                      <Building2 className="w-6 h-6 mr-3" />
                      Status SPBE Nasional
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500 text-white">
                        {enhancedSPBEData.filter(spbe => spbe.status === 'normal').length} Normal
                      </Badge>
                      <Badge className="bg-yellow-500 text-white">
                        {enhancedSPBEData.filter(spbe => spbe.status === 'low').length} Rendah
                      </Badge>
                      <Badge className="bg-red-500 text-white">
                        {enhancedSPBEData.filter(spbe => spbe.status === 'critical').length} Kritis
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    Monitoring real-time {enhancedSPBEData.length} SPBE di seluruh Indonesia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto">
                    {enhancedSPBEData.map((spbe) => (
                      <motion.div
                        key={spbe.id}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => handleSPBECardClick(spbe)}
                      >
                        <Card className={`transition-all duration-300 hover:shadow-lg ${
                          spbe.status === 'critical' ? 'border-l-4 border-red-500 bg-red-50/50' :
                          spbe.status === 'low' ? 'border-l-4 border-yellow-500 bg-yellow-50/50' :
                          'border-l-4 border-green-500 bg-green-50/50'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{spbe.name}</h3>
                              <Badge 
                                variant={spbe.status === 'critical' ? 'destructive' : spbe.status === 'low' ? 'secondary' : 'default'}
                                className="text-xs"
                              >
                                {spbe.status === 'critical' ? 'Kritis' : spbe.status === 'low' ? 'Rendah' : 'Normal'}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Stok:</span>
                                <span className="font-medium">{spbe.stock.toLocaleString()}L</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Kapasitas:</span>
                                <span className="font-medium">{spbe.capacity.toLocaleString()}L</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Throughput:</span>
                                <span className="font-medium">{spbe.dailyThroughput?.toLocaleString() || '0'}L/hari</span>
                              </div>
                              <Progress 
                                value={(spbe.stock / spbe.capacity) * 100} 
                                className="h-2" 
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{spbe.region}</span>
                                <span>{((spbe.stock / spbe.capacity) * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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