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
    color: 'from-purple-600 to-blue-600',
    description: 'Dashboard Eksekutif Kebijakan LPG'
  },
  'menteri': {
    name: 'Menteri Terkait',
    icon: Shield,
    color: 'from-blue-600 to-indigo-600',
    description: 'Dashboard Koordinasi Kementerian'
  },
  'pertamina-corporate': {
    name: 'Pertamina Corporate',
    icon: Building2,
    color: 'from-green-600 to-emerald-600',
    description: 'Dashboard Manajemen Korporat'
  },
  'pertamina-operational': {
    name: 'Pertamina Operasional',
    icon: HardHat,
    color: 'from-emerald-600 to-teal-600',
    description: 'Dashboard Operasional Lapangan'
  },
  'spbe': {
    name: 'SPBE',
    icon: Building2,
    color: 'from-orange-600 to-red-600',
    description: 'Stasiun Pengisian Bulk Elpiji'
  },
  'agen': {
    name: 'Agen LPG',
    icon: Users,
    color: 'from-red-600 to-pink-600',
    description: 'Dashboard Distribusi Agen'
  },
  'pangkalan': {
    name: 'Pangkalan LPG',
    icon: Store,
    color: 'from-pink-600 to-rose-600',
    description: 'Dashboard Pangkalan LPG'
  },
  'pengecer': {
    name: 'Pengecer LPG',
    icon: Truck,
    color: 'from-indigo-600 to-purple-600',
    description: 'Dashboard Pengecer'
  },
  'konsumen': {
    name: 'Konsumen',
    icon: UserCircle,
    color: 'from-cyan-600 to-blue-600',
    description: 'Dashboard Penerima Subsidi'
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userRole, setUserRole] = useState('');
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
    // Only show Pertamina dashboards for now
    if (userRole === 'pertamina-corporate' || userRole === 'pertamina-operational') {
      return <PertaminaDashboard userRole={userRole} onLogout={handleLogout} />;
    }
    
    // Placeholder for other stakeholders
    const config = stakeholderConfig[userRole];
    const IconComponent = config?.icon || UserCircle;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${config?.color} text-white`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{config?.name}</h1>
                <p className="text-blue-200">{config?.description}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Logout
            </Button>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Dashboard Dalam Pengembangan</h2>
              <p className="text-blue-200 mb-6">
                Dashboard untuk {config?.name} sedang dalam tahap pengembangan. 
                Silakan kembali lagi nanti untuk mengakses fitur lengkap.
              </p>
              <p className="text-sm text-blue-300">
                Fokus pengembangan saat ini: Dashboard Pertamina Corporate & Operasional
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4"
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              SISTEM HILIRISASI GAS LPG
            </CardTitle>
            <CardDescription className="text-blue-200">
              Portal Subsidi Tepat Sasaran
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="role" className="text-white">Pilih Role</Label>
                <Select value={loginData.role} onValueChange={(value) => setLoginData({...loginData, role: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Pilih role Anda" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {Object.entries(stakeholderConfig).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{config.name}</span>
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
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg"
                  disabled={loading || !loginData.username || !loginData.password || !loginData.role}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Masuk Sistem'
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
          className="text-center mt-6"
        >
          <p className="text-blue-200 text-sm">
            © 2024 Sistem Hilirisasi Gas LPG - Kementerian ESDM
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}