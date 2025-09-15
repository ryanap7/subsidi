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
  Map, Route, Gauge, Signal, Target, CheckCircle2
} from 'lucide-react';
import GoogleMapComponent from '@/components/GoogleMapComponent';
import SupplyChainMetrics from '@/components/SupplyChainMetrics';
import AlertSystem from '@/components/AlertSystem';

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

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {userRole === 'pertamina-corporate' ? 'Pertamina Corporate' : 'Pertamina Operasional'}
                </h1>
                <p className="text-green-200">
                  {userRole === 'pertamina-corporate' ? 'Dashboard Manajemen Strategis' : 'Command Center Distribusi'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={onLogout} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="text-white data-[state=active]:bg-white/20">
              <Package className="w-4 h-4 mr-2" />
              Supply Chain
            </TabsTrigger>
            <TabsTrigger value="command-center" className="text-white data-[state=active]:bg-white/20">
              <Map className="w-4 h-4 mr-2" />
              Command Center
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Kapasitas</CardTitle>
                  <Fuel className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalCapacity.toLocaleString()} L</div>
                  <p className="text-xs text-green-200 mt-1">Seluruh SPBE aktif</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Stok</CardTitle>
                  <Package className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalStock.toLocaleString()} L</div>
                  <p className="text-xs text-blue-200 mt-1">Stok tersedia saat ini</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Utilisasi</CardTitle>
                  <Gauge className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.utilizationRate.toFixed(1)}%</div>
                  <Progress value={stats.utilizationRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Kendaraan Aktif</CardTitle>
                  <Truck className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.activeVehicles}</div>
                  <p className="text-xs text-purple-200 mt-1">Dari {mockVehicles.length} total kendaraan</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* SPBE Status Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Status SPBE Real-time
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Monitoring stok dan status operasional SPBE
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockSPBEData.map((spbe) => (
                      <motion.div
                        key={spbe.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => setSelectedSPBE(spbe)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-white text-sm">{spbe.name}</h3>
                            <p className="text-xs text-blue-200">{spbe.location}</p>
                          </div>
                          <Badge variant={
                            spbe.status === 'critical' ? 'destructive' :
                            spbe.status === 'low' ? 'secondary' : 'default'
                          }>
                            {spbe.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-200">Stok</span>
                            <span className="text-white">{spbe.stock.toLocaleString()}L</span>
                          </div>
                          <Progress value={(spbe.stock / spbe.capacity) * 100} className="h-2" />
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-200">Kapasitas</span>
                            <span className="text-white">{spbe.capacity.toLocaleString()}L</span>
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Status Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDeliveries.map((delivery) => (
                    <div key={delivery.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{delivery.route}</h4>
                          <p className="text-xs text-blue-200">Driver: {delivery.driver}</p>
                        </div>
                        <Badge variant={
                          delivery.status === 'urgent' ? 'destructive' :
                          delivery.status === 'delivered' ? 'default' :
                          delivery.status === 'in-transit' ? 'secondary' : 'outline'
                        }>
                          {delivery.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={delivery.progress} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-200">Progress: {delivery.progress}%</span>
                          <span className="text-white">ETA: {delivery.eta}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <AlertSystem />
            </motion.div>
          </TabsContent>

          {/* Command Center Tab */}
          <TabsContent value="command-center" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Distribution Command Center</h2>
                <p className="text-blue-200">Real-time monitoring dan kontrol distribusi LPG</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={mapView === 'distribution' ? 'default' : 'outline'}
                  onClick={() => setMapView('distribution')}
                  className="text-white border-white/20"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Distribution Map
                </Button>
                <Button
                  variant={mapView === 'supply-chain' ? 'default' : 'outline'}
                  onClick={() => setMapView('supply-chain')}
                  className="text-white border-white/20"
                >
                  <Route className="w-4 h-4 mr-2" />
                  Supply Chain
                </Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Map */}
              <div className="lg:col-span-3">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 h-[600px]">
                  <CardContent className="p-0 h-full">
                    <GoogleMapComponent 
                      spbeData={mockSPBEData}
                      vehicles={mockVehicles}
                      view={mapView}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Control Panel */}
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Live Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">SPBE Online</span>
                      <div className="flex items-center">
                        <Signal className="w-3 h-3 text-green-400 mr-1" />
                        <span className="text-xs text-white">{mockSPBEData.length}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">Truck Active</span>
                      <div className="flex items-center">
                        <Activity className="w-3 h-3 text-blue-400 mr-1" />
                        <span className="text-xs text-white">{stats.activeVehicles}/4</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">Alerts</span>
                      <div className="flex items-center">
                        <Bell className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-white">3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button size="sm" className="w-full justify-start text-xs" variant="outline">
                      <Eye className="w-3 h-3 mr-2" />
                      View All Routes
                    </Button>
                    <Button size="sm" className="w-full justify-start text-xs" variant="outline">
                      <Filter className="w-3 h-3 mr-2" />
                      Filter by Status
                    </Button>
                    <Button size="sm" className="w-full justify-start text-xs" variant="outline">
                      <Download className="w-3 h-3 mr-2" />
                      Export Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { action: 'Truck TRK-001 arrived', time: '2 min ago', status: 'success' },
                      { action: 'Low stock alert SPBE-002', time: '5 min ago', status: 'warning' },
                      { action: 'Route optimization completed', time: '10 min ago', status: 'info' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-400' :
                          activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white">{activity.action}</p>
                          <p className="text-blue-200">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                  <CardDescription className="text-blue-200">
                    Analisis kinerja distribusi dan efisiensi operasional
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { metric: 'Delivery Accuracy', value: '98.5%', trend: '+2.1%', color: 'text-green-400' },
                    { metric: 'Average Delivery Time', value: '4.2 hours', trend: '-0.3h', color: 'text-green-400' },
                    { metric: 'Fleet Utilization', value: '87%', trend: '+5%', color: 'text-green-400' },
                    { metric: 'Customer Satisfaction', value: '4.7/5', trend: '+0.2', color: 'text-green-400' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <div>
                        <p className="text-sm text-white">{item.metric}</p>
                        <p className="text-lg font-bold text-white">{item.value}</p>
                      </div>
                      <div className={`text-sm ${item.color}`}>
                        {item.trend}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Distribution Analysis</CardTitle>
                  <CardDescription className="text-blue-200">
                    Analisis pola distribusi dan optimasi rute
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { route: 'Jakarta - Surabaya', efficiency: 92, cost: 'Rp 2.5M', volume: '45K L' },
                    { route: 'Jakarta - Bandung', efficiency: 89, cost: 'Rp 1.8M', volume: '32K L' },
                    { route: 'Surabaya - Malang', efficiency: 95, cost: 'Rp 1.2M', volume: '28K L' },
                    { route: 'Bandung - Cirebon', efficiency: 87, cost: 'Rp 1.5M', volume: '25K L' }
                  ].map((route, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-white">{route.route}</h4>
                        <Badge variant="outline" className="text-xs">
                          {route.efficiency}% efficient
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-blue-200">Cost</p>
                          <p className="text-white">{route.cost}</p>
                        </div>
                        <div>
                          <p className="text-blue-200">Volume</p>
                          <p className="text-white">{route.volume}</p>
                        </div>
                      </div>
                      <Progress value={route.efficiency} className="h-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* SPBE Detail Modal */}
      <Dialog open={!!selectedSPBE} onOpenChange={() => setSelectedSPBE(null)}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              {selectedSPBE?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Detail informasi dan status operasional SPBE
            </DialogDescription>
          </DialogHeader>
          {selectedSPBE && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge variant={
                    selectedSPBE.status === 'critical' ? 'destructive' :
                    selectedSPBE.status === 'low' ? 'secondary' : 'default'
                  }>
                    {selectedSPBE.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Lokasi</p>
                  <p className="text-white">{selectedSPBE.location}</p>
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div className="space-y-3">
                <h4 className="font-medium text-white">Inventory Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stok Saat Ini</span>
                    <span className="text-white">{selectedSPBE.stock.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kapasitas Total</span>
                    <span className="text-white">{selectedSPBE.capacity.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tingkat Pengisian</span>
                    <span className="text-white">{((selectedSPBE.stock / selectedSPBE.capacity) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={(selectedSPBE.stock / selectedSPBE.capacity) * 100} className="h-3" />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat di Peta
                </Button>
                <Button className="flex-1" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lihat Trends
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}