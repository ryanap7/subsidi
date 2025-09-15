'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, ArrowLeft, MapPin, Fuel, TrendingUp, TrendingDown,
  Package, Truck, Calendar, Clock, Users, BarChart3, 
  Activity, CheckCircle2, AlertTriangle, DollarSign
} from 'lucide-react';

const mockLogisticsData = [
  { id: 'LOG-001', date: '2024-01-15', driver: 'Ahmad Sutrisno', vehicle: 'TRK-001', volume: 5000, status: 'delivered' },
  { id: 'LOG-002', date: '2024-01-14', driver: 'Budi Hartono', vehicle: 'TRK-002', volume: 3500, status: 'delivered' },
  { id: 'LOG-003', date: '2024-01-13', driver: 'Candra Wijaya', vehicle: 'TRK-003', volume: 4200, status: 'delivered' }
];

const mockAgentTransactions = [
  { 
    id: 'TXN-AGT-001', 
    date: '2024-01-15', 
    type: 'Penjualan ke Agen', 
    amount: 125000000, 
    volume: 5000, 
    agent: {
      name: 'Agen Jakarta Selatan - CV Mitra Gas',
      code: 'AGT-JKT-001',
      address: 'Jl. Fatmawati No. 45, Jakarta Selatan',
      phone: '021-7654321',
      pic: 'Suryanto'
    },
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Lunas',
    deliveryStatus: 'Selesai',
    invoiceNumber: 'INV/2024/001'
  },
  { 
    id: 'TXN-AGT-002', 
    date: '2024-01-14', 
    type: 'Penjualan ke Agen', 
    amount: 87500000, 
    volume: 3500, 
    agent: {
      name: 'Agen Kemang - UD Berkah Gas',
      code: 'AGT-JKT-002',
      address: 'Jl. Kemang Raya No. 89, Jakarta Selatan',
      phone: '021-5556677',
      pic: 'Dewi Sartika'
    },
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Pending',
    deliveryStatus: 'Dalam Perjalanan',
    invoiceNumber: 'INV/2024/002'
  },
  { 
    id: 'TXN-AGT-003', 
    date: '2024-01-13', 
    type: 'Penjualan ke Agen', 
    amount: 105000000, 
    volume: 4200, 
    agent: {
      name: 'Agen Blok M - PT Gas Mandiri',
      code: 'AGT-JKT-003',
      address: 'Jl. Blok M No. 123, Jakarta Selatan',
      phone: '021-7778899',
      pic: 'Bambang Wijaya'
    },
    paymentMethod: 'Cash',
    paymentStatus: 'Lunas',
    deliveryStatus: 'Selesai',
    invoiceNumber: 'INV/2024/003'
  },
  { 
    id: 'TXN-AGT-004', 
    date: '2024-01-12', 
    type: 'Penjualan ke Agen', 
    amount: 200000000, 
    volume: 8000, 
    agent: {
      name: 'Agen Bintaro - CV Elpiji Sejahtera',
      code: 'AGT-JKT-004',
      address: 'Jl. Bintaro Utama No. 67, Tangerang Selatan',
      phone: '021-1122334',
      pic: 'Sari Indah'
    },
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Lunas',
    deliveryStatus: 'Selesai',
    invoiceNumber: 'INV/2024/004'
  }
];

const mockMonthlyStats = [
  { month: 'Dec 2023', volume: 45000, revenue: 1125000000, growth: 5.2 },
  { month: 'Jan 2024', volume: 52000, revenue: 1300000000, growth: 15.6 },
  { month: 'Feb 2024', volume: 48000, revenue: 1200000000, growth: -7.7 },
  { month: 'Mar 2024', volume: 55000, revenue: 1375000000, growth: 14.6 }
];

export default function SPBEDetail({ spbe, onBack }) {
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!spbe) return null;

  const utilizationRate = (spbe.stock / spbe.capacity) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{spbe.name}</h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {spbe.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={
                spbe.status === 'critical' ? 'destructive' :
                spbe.status === 'low' ? 'secondary' : 'default'
              } className="px-4 py-2 text-sm">
                {spbe.status === 'critical' ? 'Kritis' : spbe.status === 'low' ? 'Rendah' : 'Normal'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Kapasitas Total</CardTitle>
              <Fuel className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{spbe.capacity.toLocaleString()} L</div>
              <Progress value={100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Stok Saat Ini</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{spbe.stock.toLocaleString()} L</div>
              <Progress value={utilizationRate} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Tingkat Utilisasi</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{utilizationRate.toFixed(1)}%</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.1% dari bulan lalu
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Status Operasional</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">Online</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Sistem Normal
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-lg shadow-lg border-0 h-14 p-1">
            <TabsTrigger value="overview" className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger value="logistics" className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium">
              Logistik
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium">
              Transaksi
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium">
              Statistik
            </TabsTrigger>
          </TabsList>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Riwayat Pengiriman</CardTitle>
                <CardDescription>Data pengiriman terbaru ke SPBE ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLogisticsData.map((delivery) => (
                    <div key={delivery.id} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-900">{delivery.vehicle}</span>
                            <span className="text-sm text-gray-600">• {delivery.driver}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(delivery.date).toLocaleDateString('id-ID')}
                            </span>
                            <span className="flex items-center">
                              <Package className="w-3 h-3 mr-1" />
                              {delivery.volume.toLocaleString()} L
                            </span>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-500">
                          Selesai
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Transaksi dengan Agen</CardTitle>
                <CardDescription>Data transaksi penjualan LPG ke berbagai agen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockAgentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            <h4 className="font-bold text-lg text-gray-900">{transaction.agent.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {transaction.agent.code}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{transaction.agent.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span>PIC: {transaction.agent.pic}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(transaction.date).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex items-center">
                              <Package className="w-3 h-3 mr-1" />
                              <span>{transaction.volume.toLocaleString()} L</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-2xl text-green-600 mb-1">
                            Rp {transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{transaction.invoiceNumber}</div>
                          <div className="flex flex-col space-y-1">
                            <Badge variant={transaction.paymentStatus === 'Lunas' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.paymentStatus}
                            </Badge>
                            <Badge variant={transaction.deliveryStatus === 'Selesai' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.deliveryStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 p-4 bg-white/60 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                          <p className="font-semibold text-gray-900">{transaction.paymentMethod}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Kontak</p>
                          <p className="font-semibold text-gray-900">{transaction.agent.phone}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Harga per Liter</p>
                          <p className="font-semibold text-gray-900">Rp {(transaction.amount / transaction.volume).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Statistik Bulanan</CardTitle>
                <CardDescription>Tren volume dan pendapatan per bulan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMonthlyStats.map((stat, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{stat.month}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{stat.volume.toLocaleString()} L</span>
                            <span>Rp {stat.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {stat.growth > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`font-medium ${stat.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.growth > 0 ? '+' : ''}{stat.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Identity Information */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900">Identitas Perusahaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ID SPBE</p>
                      <p className="font-medium text-gray-900">{spbe.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nama Perusahaan</p>
                      <p className="font-medium text-gray-900">{spbe.companyName || 'PT Elpiji Nusantara'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Alamat Lengkap</p>
                      <p className="font-medium text-gray-900">{spbe.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Koordinat</p>
                      <p className="font-medium text-gray-900">{spbe.lat}, {spbe.lng}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nomor Izin Usaha (NIB)</p>
                      <p className="font-medium text-gray-900">{spbe.businessLicense || 'NIB-1234567890123456'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Perizinan</p>
                      <p className="font-medium text-gray-900 text-xs leading-relaxed">
                        {spbe.permits || 'SIUP/123/DKI/2020, TDP/456/DKI/2020, Izin Lingkungan/789/DKI/2020'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cooperation Agreement */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900">Kerjasama dengan Pertamina</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status Kerjasama</span>
                      <Badge variant={
                        spbe.cooperationStatus === 'active' ? 'default' :
                        spbe.cooperationStatus === 'expires_soon' ? 'secondary' : 'destructive'
                      }>
                        {spbe.cooperationStatus === 'active' ? 'Aktif' :
                         spbe.cooperationStatus === 'expires_soon' ? 'Akan Berakhir' : 'Berakhir'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mulai Kerjasama</span>
                      <span className="font-medium text-gray-900">
                        {spbe.cooperationStart ? new Date(spbe.cooperationStart).toLocaleDateString('id-ID') : '15 Januari 2020'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Berakhir Kerjasama</span>
                      <span className="font-medium text-gray-900">
                        {spbe.cooperationEnd ? new Date(spbe.cooperationEnd).toLocaleDateString('id-ID') : '14 Januari 2025'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Durasi Kerjasama</span>
                      <span className="font-medium text-gray-900">5 Tahun</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Perpanjangan Otomatis</span>
                      <span className="font-medium text-green-600">Ya</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Manager Operasional</span>
                      <span className="font-medium text-gray-900">{spbe.manager}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kontak Operasional</span>
                      <span className="font-medium text-gray-900">{spbe.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Terakhir Update</span>
                      <span className="font-medium text-gray-900">5 menit lalu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Summary */}
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Ringkasan Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-center mb-2">
                      <Package className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">2,500 L</p>
                    <p className="text-sm text-gray-600">Penjualan Hari Ini</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center justify-center mb-2">
                      <Truck className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">5,000 L</p>
                    <p className="text-sm text-gray-600">Pengiriman Masuk</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">Rp 62,5 Jt</p>
                    <p className="text-sm text-gray-600">Pendapatan</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-sm text-gray-600">Transaksi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}