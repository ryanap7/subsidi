'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, Package, Truck, Clock, 
  Target, BarChart3, ArrowRight, Users, Fuel 
} from 'lucide-react';

const mockMetrics = {
  totalDeliveries: 142,
  onTimeDelivery: 89.5,
  averageDeliveryTime: 4.2,
  totalVolume: 125000,
  costPerLiter: 0.85,
  customerSatisfaction: 4.7,
  fleetUtilization: 87,
  maintenanceRate: 5.2
};

const mockSPBEPerformance = [
  { name: 'SPBE Jakarta Selatan', deliveries: 45, onTime: 95, avgTime: 3.8, rating: 'excellent' },
  { name: 'SPBE Surabaya Timur', deliveries: 38, onTime: 87, avgTime: 4.5, rating: 'good' },
  { name: 'SPBE Bandung Utara', deliveries: 32, onTime: 92, avgTime: 4.1, rating: 'excellent' },
  { name: 'SPBE Medan Barat', deliveries: 27, onTime: 78, avgTime: 5.2, rating: 'needs-improvement' }
];

const mockInventoryTurnover = [
  { location: 'Jakarta', turnover: 12.5, trend: 'up', change: '+2.3' },
  { location: 'Surabaya', turnover: 10.8, trend: 'up', change: '+1.7' },
  { location: 'Bandung', turnover: 11.2, trend: 'down', change: '-0.5' },
  { location: 'Medan', turnover: 9.1, trend: 'up', change: '+3.2' }
];

export default function SupplyChainMetrics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setAnimatedValues({
        onTimeDelivery: mockMetrics.onTimeDelivery + (Math.random() - 0.5) * 2,
        fleetUtilization: mockMetrics.fleetUtilization + (Math.random() - 0.5) * 5,
        avgDeliveryTime: mockMetrics.averageDeliveryTime + (Math.random() - 0.5) * 0.5
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs-improvement': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingBadge = (rating) => {
    switch (rating) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'needs-improvement': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Ketepatan Pengiriman</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {animatedValues.onTimeDelivery?.toFixed(1) || mockMetrics.onTimeDelivery}%
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+2.1% dari bulan lalu</span>
            </div>
            <Progress value={animatedValues.onTimeDelivery || mockMetrics.onTimeDelivery} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Rata-rata Waktu Pengiriman</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {animatedValues.avgDeliveryTime?.toFixed(1) || mockMetrics.averageDeliveryTime}h
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-green-600">-0.3h lebih cepat</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: 4.0h</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Utilisasi Armada</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Truck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {animatedValues.fleetUtilization?.toFixed(0) || mockMetrics.fleetUtilization}%
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+5% efisiensi</span>
            </div>
            <Progress value={animatedValues.fleetUtilization || mockMetrics.fleetUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Kepuasan Pelanggan</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockMetrics.customerSatisfaction}/5</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.2 dari bulan lalu</span>
            </div>
            <div className="flex space-x-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(mockMetrics.customerSatisfaction) ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SPBE Performance Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center text-xl">
              <BarChart3 className="w-6 h-6 mr-3" />
              Peringkat Kinerja SPBE
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ranking berdasarkan efisiensi operasional dan performa pengiriman
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSPBEPerformance.map((spbe, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{spbe.name}</h4>
                      <p className="text-xs text-gray-600">{spbe.deliveries} pengiriman</p>
                    </div>
                  </div>
                  <Badge variant={getRatingBadge(spbe.rating)} className="text-xs shadow-sm">
                    {spbe.rating === 'excellent' ? 'Sangat Baik' : 
                     spbe.rating === 'good' ? 'Baik' : 'Perlu Perbaikan'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600">Tingkat Ketepatan</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{spbe.onTime}%</span>
                      <Progress value={spbe.onTime} className="flex-1 h-1" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Rata-rata Waktu</p>
                    <p className="font-medium text-gray-900">{spbe.avgTime}h</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Inventory Turnover Analysis */}
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center text-xl">
              <Package className="w-6 h-6 mr-3" />
              Analisis Perputaran Inventori
            </CardTitle>
            <CardDescription className="text-gray-600">
              Analisis perputaran stok per lokasi SPBE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInventoryTurnover.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{item.location}</h4>
                  <div className="flex items-center space-x-1">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">Tingkat Perputaran</p>
                    <p className="text-lg font-bold text-gray-900">{item.turnover}x</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Efisiensi</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={(item.turnover / 15) * 100} className="w-16 h-1" />
                      <span className="text-xs font-medium text-gray-900">
                        {((item.turnover / 15) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Period Selector and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center"
      >
        <div className="flex space-x-3">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 
                'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' : 
                'text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-200'
              }
            >
              {period === '7d' ? '7 Hari' : period === '30d' ? '30 Hari' : '90 Hari'}
            </Button>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analitik Detail
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Ekspor Laporan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}