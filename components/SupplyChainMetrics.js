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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">On-Time Delivery</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {animatedValues.onTimeDelivery?.toFixed(1) || mockMetrics.onTimeDelivery}%
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+2.1% from last month</span>
            </div>
            <Progress value={animatedValues.onTimeDelivery || mockMetrics.onTimeDelivery} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {animatedValues.avgDeliveryTime?.toFixed(1) || mockMetrics.averageDeliveryTime}h
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingDown className="h-3 w-3 text-green-400" />
              <span className="text-green-400">-0.3h faster</span>
            </div>
            <p className="text-xs text-blue-200 mt-1">Target: 4.0h</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Fleet Utilization</CardTitle>
            <Truck className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {animatedValues.fleetUtilization?.toFixed(0) || mockMetrics.fleetUtilization}%
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+5% efficiency</span>
            </div>
            <Progress value={animatedValues.fleetUtilization || mockMetrics.fleetUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Customer Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockMetrics.customerSatisfaction}/5</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+0.2 from last month</span>
            </div>
            <div className="flex space-x-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(mockMetrics.customerSatisfaction) ? 'bg-yellow-400' : 'bg-gray-600'
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
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              SPBE Performance Ranking
            </CardTitle>
            <CardDescription className="text-blue-200">
              Ranking berdasarkan efisiensi operasional dan delivery performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSPBEPerformance.map((spbe, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{spbe.name}</h4>
                      <p className="text-xs text-blue-200">{spbe.deliveries} deliveries</p>
                    </div>
                  </div>
                  <Badge variant={getRatingBadge(spbe.rating)} className="text-xs">
                    {spbe.rating.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-blue-200">On-time Rate</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{spbe.onTime}%</span>
                      <Progress value={spbe.onTime} className="flex-1 h-1" />
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-200">Avg Time</p>
                    <p className="text-white font-medium">{spbe.avgTime}h</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Inventory Turnover Analysis */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Inventory Turnover Analysis
            </CardTitle>
            <CardDescription className="text-blue-200">
              Analisis perputaran stok per lokasi SPBE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInventoryTurnover.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-white">{item.location}</h4>
                  <div className="flex items-center space-x-1">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-blue-200">Turnover Rate</p>
                    <p className="text-lg font-bold text-white">{item.turnover}x</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-200">Efficiency</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={(item.turnover / 15) * 100} className="w-16 h-1" />
                      <span className="text-xs text-white">
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
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="text-white border-white/20"
            >
              {period === '7d' ? '7 Hari' : period === '30d' ? '30 Hari' : '90 Hari'}
            </Button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-white border-white/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Detail Analytics
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white/20">
            Export Report
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}