import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db;
}

// Mock data for development
const mockSPBEData = [
  { id: 'SPBE-001', name: 'SPBE Jakarta Selatan', location: 'Jakarta', stock: 15000, capacity: 20000, status: 'normal', lat: -6.2615, lng: 106.7815, lastUpdate: new Date() },
  { id: 'SPBE-002', name: 'SPBE Surabaya Timur', location: 'Surabaya', stock: 8500, capacity: 15000, status: 'low', lat: -7.2756, lng: 112.7378, lastUpdate: new Date() },
  { id: 'SPBE-003', name: 'SPBE Bandung Utara', location: 'Bandung', stock: 12000, capacity: 18000, status: 'normal', lat: -6.9147, lng: 107.6098, lastUpdate: new Date() },
  { id: 'SPBE-004', name: 'SPBE Medan Barat', location: 'Medan', stock: 2500, capacity: 12000, status: 'critical', lat: 3.5952, lng: 98.6722, lastUpdate: new Date() },
  { id: 'SPBE-005', name: 'SPBE Makassar', location: 'Makassar', stock: 9800, capacity: 14000, status: 'normal', lat: -5.1477, lng: 119.4327, lastUpdate: new Date() }
];

const mockVehicles = [
  { id: 'TRK-001', name: 'Truck Jakarta-01', status: 'active', position: { lat: -6.2088, lng: 106.8456 }, destination: 'SPBE Jakarta Selatan', cargo: 5000, driver: 'Ahmad Sutrisno' },
  { id: 'TRK-002', name: 'Truck Surabaya-01', status: 'active', position: { lat: -7.2504, lng: 112.7688 }, destination: 'SPBE Surabaya Timur', cargo: 4200, driver: 'Budi Hartono' },
  { id: 'TRK-003', name: 'Truck Bandung-01', status: 'maintenance', position: { lat: -6.9175, lng: 107.6191 }, destination: 'Depot Bandung', cargo: 0, driver: 'Candra Wijaya' },
  { id: 'TRK-004', name: 'Truck Medan-01', status: 'active', position: { lat: 3.5833, lng: 98.6667 }, destination: 'SPBE Medan Barat', cargo: 6000, driver: 'Dedi Prakoso' }
];

const mockDeliveries = [
  { id: 'DEL-001', route: 'Depot Jakarta → SPBE Jakarta Selatan', status: 'in-transit', progress: 75, eta: '2 jam', driver: 'Ahmad Sutrisno', vehicleId: 'TRK-001' },
  { id: 'DEL-002', route: 'Depot Surabaya → SPBE Surabaya Timur', status: 'delivered', progress: 100, eta: 'Selesai', driver: 'Budi Hartono', vehicleId: 'TRK-002' },
  { id: 'DEL-003', route: 'Depot Bandung → SPBE Bandung Utara', status: 'scheduled', progress: 0, eta: '4 jam', driver: 'Candra Wijaya', vehicleId: 'TRK-003' },
  { id: 'DEL-004', route: 'Depot Medan → SPBE Medan Barat', status: 'urgent', progress: 25, eta: '6 jam', driver: 'Dedi Prakoso', vehicleId: 'TRK-004' }
];

const mockAlerts = [
  { id: 'ALT-001', type: 'critical', title: 'Stok Kritis - SPBE Medan Barat', message: 'Stok LPG di SPBE Medan Barat mencapai level kritis (20%)', timestamp: new Date(), resolved: false },
  { id: 'ALT-002', type: 'warning', title: 'Keterlambatan Pengiriman', message: 'Truck TRK-003 mengalami keterlambatan 2 jam dari jadwal', timestamp: new Date(), resolved: false },
  { id: 'ALT-003', type: 'info', title: 'Maintenance Terjadwal', message: 'SPBE Bandung Utara akan maintenance sistem tanggal 25 Januari', timestamp: new Date(), resolved: true }
];

const mockMetrics = {
  supplyChain: {
    totalDeliveries: 142,
    onTimeDelivery: 89.5,
    averageDeliveryTime: 4.2,
    totalVolume: 125000,
    costPerLiter: 0.85,
    customerSatisfaction: 4.7
  },
  operational: {
    activeVehicles: 12,
    maintenanceVehicles: 3,
    totalCapacity: 95000,
    currentStock: 67500,
    utilizationRate: 71.1,
    alertsCount: 5
  }
};

// Authentication endpoints
async function handleAuth(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'auth') {
    if (segments[1] === 'login' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { username, password, role } = body;
        
        // Simple mock authentication
        if (username && password && role) {
          const mockUser = {
            id: `user_${Date.now()}`,
            username,
            role,
            name: getStakeholderName(role),
            permissions: getPermissions(role)
          };
          
          return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: mockUser,
            token: `mock_token_${Date.now()}`
          });
        }
        
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid request body' },
          { status: 400 }
        );
      }
    }
    
    if (segments[1] === 'logout' && request.method === 'POST') {
      return NextResponse.json({
        success: true,
        message: 'Logout successful'
      });
    }
  }
  
  return null;
}

// SPBE endpoints
async function handleSPBE(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'spbe') {
    if (request.method === 'GET') {
      if (segments[1]) {
        // Get specific SPBE
        const spbe = mockSPBEData.find(s => s.id === segments[1]);
        if (!spbe) {
          return NextResponse.json(
            { success: false, message: 'SPBE not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: spbe });
      } else {
        // Get all SPBE
        return NextResponse.json({ success: true, data: mockSPBEData });
      }
    }
    
    if (segments[1] === 'update-stock' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { spbeId, newStock } = body;
        
        const spbeIndex = mockSPBEData.findIndex(s => s.id === spbeId);
        if (spbeIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'SPBE not found' },
            { status: 404 }
          );
        }
        
        mockSPBEData[spbeIndex].stock = newStock;
        mockSPBEData[spbeIndex].lastUpdate = new Date();
        
        // Update status based on stock level
        const utilizationRate = (newStock / mockSPBEData[spbeIndex].capacity) * 100;
        if (utilizationRate < 20) {
          mockSPBEData[spbeIndex].status = 'critical';
        } else if (utilizationRate < 40) {
          mockSPBEData[spbeIndex].status = 'low';
        } else {
          mockSPBEData[spbeIndex].status = 'normal';
        }
        
        return NextResponse.json({
          success: true,
          message: 'Stock updated successfully',
          data: mockSPBEData[spbeIndex]
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid request body' },
          { status: 400 }
        );
      }
    }
  }
  
  return null;
}

// Vehicle endpoints
async function handleVehicles(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'vehicles') {
    if (request.method === 'GET') {
      if (segments[1]) {
        // Get specific vehicle
        const vehicle = mockVehicles.find(v => v.id === segments[1]);
        if (!vehicle) {
          return NextResponse.json(
            { success: false, message: 'Vehicle not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: vehicle });
      } else {
        // Get all vehicles
        return NextResponse.json({ success: true, data: mockVehicles });
      }
    }
    
    if (segments[1] === 'update-position' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { vehicleId, position, status } = body;
        
        const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);
        if (vehicleIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Vehicle not found' },
            { status: 404 }
          );
        }
        
        if (position) {
          mockVehicles[vehicleIndex].position = position;
        }
        
        if (status) {
          mockVehicles[vehicleIndex].status = status;
        }
        
        mockVehicles[vehicleIndex].lastUpdate = new Date();
        
        return NextResponse.json({
          success: true,
          message: 'Vehicle updated successfully',
          data: mockVehicles[vehicleIndex]
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid request body' },
          { status: 400 }
        );
      }
    }
  }
  
  return null;
}

// Delivery endpoints
async function handleDeliveries(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'deliveries') {
    if (request.method === 'GET') {
      if (segments[1]) {
        const delivery = mockDeliveries.find(d => d.id === segments[1]);
        if (!delivery) {
          return NextResponse.json(
            { success: false, message: 'Delivery not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: delivery });
      } else {
        return NextResponse.json({ success: true, data: mockDeliveries });
      }
    }
    
    if (segments[1] === 'update-progress' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { deliveryId, progress, status, eta } = body;
        
        const deliveryIndex = mockDeliveries.findIndex(d => d.id === deliveryId);
        if (deliveryIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Delivery not found' },
            { status: 404 }
          );
        }
        
        if (progress !== undefined) {
          mockDeliveries[deliveryIndex].progress = progress;
        }
        
        if (status) {
          mockDeliveries[deliveryIndex].status = status;
        }
        
        if (eta) {
          mockDeliveries[deliveryIndex].eta = eta;
        }
        
        return NextResponse.json({
          success: true,
          message: 'Delivery updated successfully',
          data: mockDeliveries[deliveryIndex]
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid request body' },
          { status: 400 }
        );
      }
    }
  }
  
  return null;
}

// Alerts endpoints
async function handleAlerts(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'alerts') {
    if (request.method === 'GET') {
      return NextResponse.json({ success: true, data: mockAlerts });
    }
    
    if (segments[1] === 'resolve' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { alertId } = body;
        
        const alertIndex = mockAlerts.findIndex(a => a.id === alertId);
        if (alertIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Alert not found' },
            { status: 404 }
          );
        }
        
        mockAlerts[alertIndex].resolved = true;
        mockAlerts[alertIndex].resolvedAt = new Date();
        
        return NextResponse.json({
          success: true,
          message: 'Alert resolved successfully',
          data: mockAlerts[alertIndex]
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid request body' },
          { status: 400 }
        );
      }
    }
  }
  
  return null;
}

// Metrics endpoints
async function handleMetrics(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'metrics') {
    if (request.method === 'GET') {
      if (segments[1] === 'supply-chain') {
        return NextResponse.json({ success: true, data: mockMetrics.supplyChain });
      } else if (segments[1] === 'operational') {
        return NextResponse.json({ success: true, data: mockMetrics.operational });
      } else {
        return NextResponse.json({ success: true, data: mockMetrics });
      }
    }
  }
  
  return null;
}

// Routes optimization endpoint
async function handleRoutes(request, path) {
  const segments = path.filter(Boolean);
  
  if (segments[0] === 'routes' && segments[1] === 'optimize' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { origin, destination, waypoints, optimizeWaypoints } = body;
      
      if (!origin || !destination) {
        return NextResponse.json(
          { success: false, message: 'Origin and destination are required' },
          { status: 400 }
        );
      }
      
      // Mock route optimization response
      const optimizedRoute = {
        id: `route_${Date.now()}`,
        name: `${origin} to ${destination}`,
        origin,
        destination,
        waypoints: waypoints || [],
        distance: '125 km',
        duration: '2 hours 15 minutes',
        fuel_cost: 'Rp 150,000',
        optimized: optimizeWaypoints,
        status: 'calculated',
        path: [
          { lat: -6.2088, lng: 106.8456 },
          { lat: -6.2200, lng: 106.8300 },
          { lat: -6.2615, lng: 106.7815 }
        ]
      };
      
      return NextResponse.json({
        success: true,
        message: 'Route optimized successfully',
        data: optimizedRoute
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }
  }
  
  return null;
}

// Helper functions
function getStakeholderName(role) {
  const names = {
    'presiden': 'Presiden Republik Indonesia',
    'menteri': 'Menteri Terkait',
    'pertamina-corporate': 'Pertamina Corporate',
    'pertamina-operational': 'Pertamina Operasional',
    'spbe': 'SPBE',
    'agen': 'Agen LPG',
    'pangkalan': 'Pangkalan LPG',
    'pengecer': 'Pengecer LPG',
    'konsumen': 'Konsumen'
  };
  return names[role] || 'Unknown Role';
}

function getPermissions(role) {
  const permissions = {
    'presiden': ['view_all', 'executive_reports'],
    'menteri': ['view_ministry', 'policy_reports'],
    'pertamina-corporate': ['view_supply_chain', 'manage_distribution', 'view_analytics'],
    'pertamina-operational': ['view_operations', 'track_vehicles', 'manage_deliveries'],
    'spbe': ['view_inventory', 'manage_stock'],
    'agen': ['view_orders', 'manage_distribution'],
    'pangkalan': ['view_stock', 'manage_sales'],
    'pengecer': ['view_inventory', 'sales_reports'],
    'konsumen': ['view_subsidy', 'track_usage']
  };
  return permissions[role] || [];
}

// Main handler
export async function GET(request) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/').pop()?.split('/') || [];
  
  try {
    // Try each handler
    const authResult = await handleAuth(request, path);
    if (authResult) return authResult;
    
    const spbeResult = await handleSPBE(request, path);
    if (spbeResult) return spbeResult;
    
    const vehicleResult = await handleVehicles(request, path);
    if (vehicleResult) return vehicleResult;
    
    const deliveryResult = await handleDeliveries(request, path);
    if (deliveryResult) return deliveryResult;
    
    const alertResult = await handleAlerts(request, path);
    if (alertResult) return alertResult;
    
    const metricsResult = await handleMetrics(request, path);
    if (metricsResult) return metricsResult;
    
    const routeResult = await handleRoutes(request, path);
    if (routeResult) return routeResult;
    
    // Default API info
    if (path.length === 0) {
      return NextResponse.json({
        message: 'LPG Subsidy Portal API',
        version: '1.0.0',
        endpoints: [
          '/api/auth/login',
          '/api/auth/logout',
          '/api/spbe',
          '/api/vehicles',
          '/api/deliveries',
          '/api/alerts',
          '/api/metrics',
          '/api/routes/optimize'
        ]
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Endpoint not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}

export async function PUT(request) {
  return GET(request);
}

export async function DELETE(request) {
  return GET(request);
}