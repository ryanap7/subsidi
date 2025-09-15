'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Building2, Users, Shield, Truck, Store, UserCircle, Crown, HardHat } from 'lucide-react';
import PertaminaDashboard from '@/components/PertaminaDashboard';

// Stakeholder configurations - users won't see others
const stakeholderConfig = {
  'presiden': {
    name: 'Presiden Republik Indonesia',
    icon: Crown,
    color: 'from-purple-600 via-purple-500 to-indigo-600',
    description: 'Pusat Kendali Kebijakan Strategis LPG Nasional'
  },
  'menteri': {
    name: 'Kementerian ESDM',
    icon: Shield,
    color: 'from-blue-600 via-blue-500 to-cyan-600',
    description: 'Koordinasi Lintas Kementerian dan Regulasi'
  },
  'pertamina': {
    name: 'Pertamina',
    icon: Building2,
    color: 'from-emerald-600 via-green-500 to-teal-600',
    description: 'Manajemen Distribusi dan Operasional Terpadu'
  },
  'spbe': {
    name: 'SPBE',
    icon: Truck,
    color: 'from-orange-600 via-orange-500 to-red-600',
    description: 'Stasiun Pengisian Bulk Elpiji'
  },
  'agen': {
    name: 'Agen LPG',
    icon: Users,
    color: 'from-red-600 via-pink-500 to-rose-600',
    description: 'Jaringan Distribusi Regional'
  },
  'pangkalan': {
    name: 'Pangkalan LPG',
    icon: Store,
    color: 'from-pink-600 via-rose-500 to-red-600',
    description: 'Titik Distribusi Tingkat Pangkalan'
  },
  'pengecer': {
    name: 'Pengecer LPG',
    icon: HardHat,
    color: 'from-indigo-600 via-purple-500 to-pink-600',
    description: 'Retail dan Penjualan Langsung'
  },
  'konsumen': {
    name: 'Konsumen',
    icon: UserCircle,
    color: 'from-cyan-600 via-blue-500 to-indigo-600',
    description: 'Penerima Manfaat Subsidi LPG'
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // Auto-login for demo
  const [userRole, setUserRole] = useState('pertamina'); // Auto-login as Pertamina
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (loginData.username && loginData.password && loginData.role) {
        setUserRole(loginData.role);
        setCurrentView('dashboard');
      }
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setCurrentView('login');
    setUserRole('');
    setLoginData({ username: '', password: '', role: '' });
  };

  if (currentView === 'dashboard') {
    // Show Pertamina dashboard
    if (userRole === 'pertamina') {
      return <PertaminaDashboard userRole={userRole} onLogout={handleLogout} />;
    }
    
    // Placeholder for other stakeholders
    const config = stakeholderConfig[userRole];
    const IconComponent = config?.icon || UserCircle;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${config?.color} text-white shadow-lg`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{config?.name}</h1>
                <p className="text-gray-600">{config?.description}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Keluar Sistem
            </Button>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${config?.color} mx-auto mb-6 flex items-center justify-center`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Dalam Pengembangan</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Sistem dashboard untuk <span className="font-semibold text-gray-900">{config?.name}</span> sedang dalam tahap pengembangan lanjutan. 
                Platform ini akan segera diluncurkan dengan fitur-fitur canggih untuk mendukung operasional Anda.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <p className="text-sm text-blue-700 font-medium">
                  🚀 Prioritas Pengembangan: Sistem Pertamina telah tersedia dengan fitur lengkap
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            >
              <Building2 className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              SISTEM HILIRISASI GAS LPG
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Portal Manajemen Subsidi Tepat Sasaran
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="role" className="text-gray-700 font-medium">Pilih Peran Akses</Label>
                <Select value={loginData.role} onValueChange={(value) => setLoginData({...loginData, role: value})}>
                  <SelectTrigger className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 text-gray-900 h-12 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <SelectValue placeholder="Pilih peran akses Anda" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-xl">
                    {Object.entries(stakeholderConfig).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <SelectItem key={key} value={key} className="text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 py-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{config.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-gray-700 font-medium">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan nama pengguna"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 text-gray-900 placeholder:text-gray-500 h-12 hover:from-blue-50 hover:to-indigo-50 focus:from-blue-50 focus:to-indigo-50 transition-all duration-200"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700 font-medium">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 text-gray-900 placeholder:text-gray-500 pr-12 h-12 hover:from-blue-50 hover:to-indigo-50 focus:from-blue-50 focus:to-indigo-50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:from-emerald-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold py-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 h-12"
                  disabled={loading || !loginData.username || !loginData.password || !loginData.role}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Akses Sistem'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 text-sm">
            © 2024 Sistem Hilirisasi Gas LPG - Kementerian Energi dan Sumber Daya Mineral
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}