'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertTriangle, Bell, CheckCircle2, Clock, X, 
  Zap, Fuel, Truck, Building2, Activity 
} from 'lucide-react';

const mockAlerts = [
  {
    id: 'ALT-001',
    type: 'critical',
    title: 'Stok Kritis - SPBE Medan Barat',
    message: 'Stok LPG di SPBE Medan Barat mencapai level kritis (18%). Diperlukan pengiriman segera.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    resolved: false,
    category: 'inventory',
    location: 'SPBE Medan Barat',
    priority: 'high',
    actionRequired: true
  },
  {
    id: 'ALT-002',
    type: 'warning',
    title: 'Keterlambatan Pengiriman TRK-003',
    message: 'Truck TRK-003 mengalami keterlambatan 2 jam dari jadwal. ETA baru: 16:30.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    resolved: false,
    category: 'logistics',
    location: 'Rute Bandung-Cirebon',
    priority: 'medium',
    actionRequired: true
  },
  {
    id: 'ALT-003',
    type: 'info',
    title: 'Maintenance Terjadwal SPBE Bandung',
    message: 'SPBE Bandung Utara akan menjalani maintenance sistem tanggal 25 Januari 2024.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    resolved: false,
    category: 'maintenance',
    location: 'SPBE Bandung Utara',
    priority: 'low',
    actionRequired: false
  },
  {
    id: 'ALT-004',
    type: 'critical',
    title: 'Anomali Demand - Jakarta Selatan',
    message: 'Terdeteksi lonjakan demand 150% di area Jakarta Selatan. Possible supply shortage.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    resolved: false,
    category: 'demand',
    location: 'Jakarta Selatan',
    priority: 'high',
    actionRequired: true
  },
  {
    id: 'ALT-005',
    type: 'success',
    title: 'Delivery Complete - TRK-001',
    message: 'Pengiriman 5000L LPG ke SPBE Jakarta Selatan berhasil diselesaikan tepat waktu.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    resolved: true,
    category: 'logistics',
    location: 'SPBE Jakarta Selatan',
    priority: 'low',
    actionRequired: false
  }
];

export default function AlertSystem() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all'); // all, critical, warning, info, resolved
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [newAlertsCount, setNewAlertsCount] = useState(0);

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newAlert = generateRandomAlert();
        setAlerts(prev => [newAlert, ...prev]);
        setNewAlertsCount(prev => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomAlert = () => {
    const types = ['warning', 'info', 'critical'];
    const categories = ['inventory', 'logistics', 'maintenance', 'demand', 'performance'];
    const locations = ['SPBE Jakarta Selatan', 'SPBE Surabaya Timur', 'SPBE Bandung Utara', 'SPBE Medan Barat'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      id: `ALT-${Date.now()}`,
      type,
      title: `${type === 'critical' ? 'URGENT: ' : ''}${category.toUpperCase()} Alert - ${location}`,
      message: `Automated alert generated for ${category} monitoring at ${location}`,
      timestamp: new Date(),
      resolved: false,
      category,
      location,
      priority: type === 'critical' ? 'high' : type === 'warning' ? 'medium' : 'low',
      actionRequired: type === 'critical' || type === 'warning'
    };
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, resolvedAt: new Date() } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getFilteredAlerts = () => {
    if (filter === 'all') return alerts;
    if (filter === 'resolved') return alerts.filter(alert => alert.resolved);
    return alerts.filter(alert => !alert.resolved && alert.type === filter);
  };

  const getAlertIcon = (type, category) => {
    if (type === 'success') return CheckCircle2;
    if (type === 'critical') return AlertTriangle;
    if (category === 'inventory') return Fuel;
    if (category === 'logistics') return Truck;
    if (category === 'maintenance') return Building2;
    if (category === 'performance') return Activity;
    return Bell;
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'success': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return timestamp.toLocaleDateString('id-ID');
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const criticalCount = unresolvedAlerts.filter(alert => alert.type === 'critical').length;
  const warningCount = unresolvedAlerts.filter(alert => alert.type === 'warning').length;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-white">Alert & Notification System</CardTitle>
            {newAlertsCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {newAlertsCount} baru
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewAlertsCount(0)}
            className="text-white border-white/20"
          >
            Mark All Read
          </Button>
        </div>
        <CardDescription className="text-blue-200">
          Real-time monitoring alerts dan notifikasi sistem
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Alert Summary */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-red-500/20 border border-red-500/30">
            <div className="text-lg font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-red-300">Critical</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
            <div className="text-lg font-bold text-yellow-400">{warningCount}</div>
            <div className="text-xs text-yellow-300">Warning</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <div className="text-lg font-bold text-blue-400">{unresolvedAlerts.length}</div>
            <div className="text-xs text-blue-300">Active</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-500/20 border border-green-500/30">
            <div className="text-lg font-bold text-green-400">{alerts.filter(a => a.resolved).length}</div>
            <div className="text-xs text-green-300">Resolved</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-4">
          {['all', 'critical', 'warning', 'info', 'resolved'].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="text-white border-white/20 text-xs"
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <ScrollArea className="h-64">
          <div className="space-y-2">
            <AnimatePresence>
              {getFilteredAlerts().map((alert) => {
                const IconComponent = getAlertIcon(alert.type, alert.category);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-white/5 transition-all ${getAlertColor(alert.type)} ${
                      alert.resolved ? 'opacity-60' : ''
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-white truncate">
                              {alert.title}
                            </h4>
                            <Badge variant={getBadgeVariant(alert.priority)} className="text-xs">
                              {alert.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimestamp(alert.timestamp)}
                              </span>
                              <span>{alert.location}</span>
                            </div>
                            {!alert.resolved && alert.actionRequired && (
                              <Badge variant="outline" className="text-xs">
                                Action Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        {!alert.resolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              resolveAlert(alert.id);
                            }}
                            className="h-8 w-8 p-0 text-green-400 hover:bg-green-500/20"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.id);
                          }}
                          className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-500/20"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-white border-white/20">
              <Zap className="w-4 h-4 mr-2" />
              Auto-resolve
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white/20">
              Configure Alerts
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            Last updated: {new Date().toLocaleTimeString('id-ID')}
          </Badge>
        </div>
      </CardContent>

      {/* Alert Detail Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedAlert && (() => {
                const IconComponent = getAlertIcon(selectedAlert.type, selectedAlert.category);
                return <IconComponent className="w-5 h-5 mr-2" />;
              })()}
              {selectedAlert?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Alert Details & Recommended Actions
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge variant={selectedAlert.resolved ? 'default' : getBadgeVariant(selectedAlert.priority)}>
                    {selectedAlert.resolved ? 'Resolved' : selectedAlert.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-white">{selectedAlert.location}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="text-white capitalize">{selectedAlert.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Priority</p>
                  <p className="text-white capitalize">{selectedAlert.priority}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-400 mb-2">Description</p>
                <p className="text-white">{selectedAlert.message}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-400 mb-2">Timestamp</p>
                <p className="text-white">{selectedAlert.timestamp.toLocaleString('id-ID')}</p>
              </div>
              
              {selectedAlert.actionRequired && !selectedAlert.resolved && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Recommended Actions:</h4>
                  <ul className="text-sm text-yellow-100 space-y-1">
                    {selectedAlert.type === 'critical' && selectedAlert.category === 'inventory' && (
                      <>
                        <li>• Schedule immediate LPG delivery to location</li>
                        <li>• Contact nearest available truck for emergency dispatch</li>
                        <li>• Notify distribution coordinator</li>
                      </>
                    )}
                    {selectedAlert.type === 'warning' && selectedAlert.category === 'logistics' && (
                      <>
                        <li>• Contact driver for status update</li>
                        <li>• Check for traffic or route issues</li>
                        <li>• Notify destination SPBE of delay</li>
                      </>
                    )}
                    {selectedAlert.category === 'demand' && (
                      <>
                        <li>• Analyze demand pattern and causes</li>
                        <li>• Increase supply allocation to area</li>
                        <li>• Monitor for potential shortages</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                {!selectedAlert.resolved && (
                  <Button 
                    onClick={() => {
                      resolveAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}