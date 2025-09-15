#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for LPG Subsidy Portal
Tests all endpoints including authentication, SPBE, vehicles, deliveries, alerts, metrics, and routes
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://subsidy-portal.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

class LPGSubsidyPortalTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.auth_token = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{API_BASE}")
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'LPG Subsidy Portal API' in data['message']:
                    self.log_test("API Root", True, "API root endpoint accessible", data)
                    return True
                else:
                    self.log_test("API Root", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("API Root", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("API Root", False, f"Connection error: {str(e)}")
            return False
    
    def test_auth_login_valid(self):
        """Test authentication login with valid credentials"""
        try:
            login_data = {
                "username": "admin_pertamina",
                "password": "secure123",
                "role": "pertamina-corporate"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'token' in data and 'user' in data:
                    self.auth_token = data['token']
                    user = data['user']
                    if user.get('role') == 'pertamina-corporate' and user.get('username') == 'admin_pertamina':
                        self.log_test("Auth Login Valid", True, "Login successful with valid credentials", data)
                        return True
                    else:
                        self.log_test("Auth Login Valid", False, "User data mismatch", data)
                        return False
                else:
                    self.log_test("Auth Login Valid", False, "Missing required fields in response", data)
                    return False
            else:
                self.log_test("Auth Login Valid", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Auth Login Valid", False, f"Request error: {str(e)}")
            return False
    
    def test_auth_login_invalid(self):
        """Test authentication login with invalid credentials"""
        try:
            login_data = {
                "username": "invalid_user",
                "password": "wrong_password",
                "role": "invalid_role"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'Invalid credentials' in data.get('message', ''):
                    self.log_test("Auth Login Invalid", True, "Correctly rejected invalid credentials", data)
                    return True
                else:
                    self.log_test("Auth Login Invalid", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Auth Login Invalid", False, f"Expected 401, got HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Auth Login Invalid", False, f"Request error: {str(e)}")
            return False
    
    def test_auth_login_missing_fields(self):
        """Test authentication login with missing fields"""
        try:
            login_data = {
                "username": "test_user"
                # Missing password and role
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 401:
                data = response.json()
                if not data.get('success'):
                    self.log_test("Auth Login Missing Fields", True, "Correctly rejected incomplete credentials", data)
                    return True
                else:
                    self.log_test("Auth Login Missing Fields", False, "Should have rejected incomplete data", data)
                    return False
            else:
                self.log_test("Auth Login Missing Fields", False, f"Expected 401, got HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Auth Login Missing Fields", False, f"Request error: {str(e)}")
            return False
    
    def test_auth_logout(self):
        """Test authentication logout"""
        try:
            response = self.session.post(f"{API_BASE}/auth/logout")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'Logout successful' in data.get('message', ''):
                    self.log_test("Auth Logout", True, "Logout successful", data)
                    return True
                else:
                    self.log_test("Auth Logout", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Auth Logout", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Auth Logout", False, f"Request error: {str(e)}")
            return False
    
    def test_spbe_get_all(self):
        """Test getting all SPBE data"""
        try:
            response = self.session.get(f"{API_BASE}/spbe")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    spbe_data = data['data']
                    if isinstance(spbe_data, list) and len(spbe_data) > 0:
                        # Check if first SPBE has required fields
                        first_spbe = spbe_data[0]
                        required_fields = ['id', 'name', 'location', 'stock', 'capacity', 'status']
                        if all(field in first_spbe for field in required_fields):
                            self.log_test("SPBE Get All", True, f"Retrieved {len(spbe_data)} SPBE records", data)
                            return True
                        else:
                            self.log_test("SPBE Get All", False, "Missing required fields in SPBE data", data)
                            return False
                    else:
                        self.log_test("SPBE Get All", False, "No SPBE data returned", data)
                        return False
                else:
                    self.log_test("SPBE Get All", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("SPBE Get All", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("SPBE Get All", False, f"Request error: {str(e)}")
            return False
    
    def test_spbe_get_specific(self):
        """Test getting specific SPBE data"""
        try:
            spbe_id = "SPBE-001"
            response = self.session.get(f"{API_BASE}/spbe/{spbe_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    spbe = data['data']
                    if spbe.get('id') == spbe_id:
                        self.log_test("SPBE Get Specific", True, f"Retrieved SPBE {spbe_id}", data)
                        return True
                    else:
                        self.log_test("SPBE Get Specific", False, "Wrong SPBE returned", data)
                        return False
                else:
                    self.log_test("SPBE Get Specific", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("SPBE Get Specific", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("SPBE Get Specific", False, f"Request error: {str(e)}")
            return False
    
    def test_spbe_get_nonexistent(self):
        """Test getting non-existent SPBE"""
        try:
            spbe_id = "SPBE-999"
            response = self.session.get(f"{API_BASE}/spbe/{spbe_id}")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'not found' in data.get('message', '').lower():
                    self.log_test("SPBE Get Nonexistent", True, "Correctly returned 404 for non-existent SPBE", data)
                    return True
                else:
                    self.log_test("SPBE Get Nonexistent", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("SPBE Get Nonexistent", False, f"Expected 404, got HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("SPBE Get Nonexistent", False, f"Request error: {str(e)}")
            return False
    
    def test_spbe_update_stock(self):
        """Test updating SPBE stock"""
        try:
            update_data = {
                "spbeId": "SPBE-001",
                "newStock": 18000
            }
            
            response = self.session.post(f"{API_BASE}/spbe/update-stock", json=update_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    updated_spbe = data['data']
                    if updated_spbe.get('stock') == 18000 and updated_spbe.get('id') == "SPBE-001":
                        self.log_test("SPBE Update Stock", True, "Stock updated successfully", data)
                        return True
                    else:
                        self.log_test("SPBE Update Stock", False, "Stock not updated correctly", data)
                        return False
                else:
                    self.log_test("SPBE Update Stock", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("SPBE Update Stock", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("SPBE Update Stock", False, f"Request error: {str(e)}")
            return False
    
    def test_vehicles_get_all(self):
        """Test getting all vehicles"""
        try:
            response = self.session.get(f"{API_BASE}/vehicles")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    vehicles = data['data']
                    if isinstance(vehicles, list) and len(vehicles) > 0:
                        first_vehicle = vehicles[0]
                        required_fields = ['id', 'name', 'status', 'position', 'destination']
                        if all(field in first_vehicle for field in required_fields):
                            self.log_test("Vehicles Get All", True, f"Retrieved {len(vehicles)} vehicles", data)
                            return True
                        else:
                            self.log_test("Vehicles Get All", False, "Missing required fields in vehicle data", data)
                            return False
                    else:
                        self.log_test("Vehicles Get All", False, "No vehicle data returned", data)
                        return False
                else:
                    self.log_test("Vehicles Get All", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Vehicles Get All", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Vehicles Get All", False, f"Request error: {str(e)}")
            return False
    
    def test_vehicles_get_specific(self):
        """Test getting specific vehicle"""
        try:
            vehicle_id = "TRK-001"
            response = self.session.get(f"{API_BASE}/vehicles/{vehicle_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    vehicle = data['data']
                    if vehicle.get('id') == vehicle_id:
                        self.log_test("Vehicles Get Specific", True, f"Retrieved vehicle {vehicle_id}", data)
                        return True
                    else:
                        self.log_test("Vehicles Get Specific", False, "Wrong vehicle returned", data)
                        return False
                else:
                    self.log_test("Vehicles Get Specific", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Vehicles Get Specific", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Vehicles Get Specific", False, f"Request error: {str(e)}")
            return False
    
    def test_vehicles_update_position(self):
        """Test updating vehicle position"""
        try:
            update_data = {
                "vehicleId": "TRK-001",
                "position": {"lat": -6.2100, "lng": 106.8500},
                "status": "active"
            }
            
            response = self.session.post(f"{API_BASE}/vehicles/update-position", json=update_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    updated_vehicle = data['data']
                    if (updated_vehicle.get('position', {}).get('lat') == -6.2100 and 
                        updated_vehicle.get('id') == "TRK-001"):
                        self.log_test("Vehicles Update Position", True, "Vehicle position updated successfully", data)
                        return True
                    else:
                        self.log_test("Vehicles Update Position", False, "Position not updated correctly", data)
                        return False
                else:
                    self.log_test("Vehicles Update Position", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Vehicles Update Position", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Vehicles Update Position", False, f"Request error: {str(e)}")
            return False
    
    def test_deliveries_get_all(self):
        """Test getting all deliveries"""
        try:
            response = self.session.get(f"{API_BASE}/deliveries")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    deliveries = data['data']
                    if isinstance(deliveries, list) and len(deliveries) > 0:
                        first_delivery = deliveries[0]
                        required_fields = ['id', 'route', 'status', 'progress', 'eta']
                        if all(field in first_delivery for field in required_fields):
                            self.log_test("Deliveries Get All", True, f"Retrieved {len(deliveries)} deliveries", data)
                            return True
                        else:
                            self.log_test("Deliveries Get All", False, "Missing required fields in delivery data", data)
                            return False
                    else:
                        self.log_test("Deliveries Get All", False, "No delivery data returned", data)
                        return False
                else:
                    self.log_test("Deliveries Get All", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Deliveries Get All", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Deliveries Get All", False, f"Request error: {str(e)}")
            return False
    
    def test_deliveries_get_specific(self):
        """Test getting specific delivery"""
        try:
            delivery_id = "DEL-001"
            response = self.session.get(f"{API_BASE}/deliveries/{delivery_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    delivery = data['data']
                    if delivery.get('id') == delivery_id:
                        self.log_test("Deliveries Get Specific", True, f"Retrieved delivery {delivery_id}", data)
                        return True
                    else:
                        self.log_test("Deliveries Get Specific", False, "Wrong delivery returned", data)
                        return False
                else:
                    self.log_test("Deliveries Get Specific", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Deliveries Get Specific", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Deliveries Get Specific", False, f"Request error: {str(e)}")
            return False
    
    def test_deliveries_update_progress(self):
        """Test updating delivery progress"""
        try:
            update_data = {
                "deliveryId": "DEL-001",
                "progress": 85,
                "status": "in-transit",
                "eta": "1 jam"
            }
            
            response = self.session.post(f"{API_BASE}/deliveries/update-progress", json=update_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    updated_delivery = data['data']
                    if (updated_delivery.get('progress') == 85 and 
                        updated_delivery.get('id') == "DEL-001"):
                        self.log_test("Deliveries Update Progress", True, "Delivery progress updated successfully", data)
                        return True
                    else:
                        self.log_test("Deliveries Update Progress", False, "Progress not updated correctly", data)
                        return False
                else:
                    self.log_test("Deliveries Update Progress", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Deliveries Update Progress", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Deliveries Update Progress", False, f"Request error: {str(e)}")
            return False
    
    def test_alerts_get_all(self):
        """Test getting all alerts"""
        try:
            response = self.session.get(f"{API_BASE}/alerts")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    alerts = data['data']
                    if isinstance(alerts, list) and len(alerts) > 0:
                        first_alert = alerts[0]
                        required_fields = ['id', 'type', 'title', 'message', 'resolved']
                        if all(field in first_alert for field in required_fields):
                            self.log_test("Alerts Get All", True, f"Retrieved {len(alerts)} alerts", data)
                            return True
                        else:
                            self.log_test("Alerts Get All", False, "Missing required fields in alert data", data)
                            return False
                    else:
                        self.log_test("Alerts Get All", False, "No alert data returned", data)
                        return False
                else:
                    self.log_test("Alerts Get All", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Alerts Get All", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Alerts Get All", False, f"Request error: {str(e)}")
            return False
    
    def test_alerts_resolve(self):
        """Test resolving an alert"""
        try:
            resolve_data = {
                "alertId": "ALT-001"
            }
            
            response = self.session.post(f"{API_BASE}/alerts/resolve", json=resolve_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    resolved_alert = data['data']
                    if (resolved_alert.get('resolved') == True and 
                        resolved_alert.get('id') == "ALT-001"):
                        self.log_test("Alerts Resolve", True, "Alert resolved successfully", data)
                        return True
                    else:
                        self.log_test("Alerts Resolve", False, "Alert not resolved correctly", data)
                        return False
                else:
                    self.log_test("Alerts Resolve", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Alerts Resolve", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Alerts Resolve", False, f"Request error: {str(e)}")
            return False
    
    def test_metrics_get_all(self):
        """Test getting all metrics"""
        try:
            response = self.session.get(f"{API_BASE}/metrics")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    metrics = data['data']
                    if 'supplyChain' in metrics and 'operational' in metrics:
                        self.log_test("Metrics Get All", True, "Retrieved all metrics", data)
                        return True
                    else:
                        self.log_test("Metrics Get All", False, "Missing metrics categories", data)
                        return False
                else:
                    self.log_test("Metrics Get All", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Metrics Get All", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Metrics Get All", False, f"Request error: {str(e)}")
            return False
    
    def test_metrics_supply_chain(self):
        """Test getting supply chain metrics"""
        try:
            response = self.session.get(f"{API_BASE}/metrics/supply-chain")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    supply_chain = data['data']
                    required_fields = ['totalDeliveries', 'onTimeDelivery', 'averageDeliveryTime']
                    if all(field in supply_chain for field in required_fields):
                        self.log_test("Metrics Supply Chain", True, "Retrieved supply chain metrics", data)
                        return True
                    else:
                        self.log_test("Metrics Supply Chain", False, "Missing required supply chain fields", data)
                        return False
                else:
                    self.log_test("Metrics Supply Chain", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Metrics Supply Chain", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Metrics Supply Chain", False, f"Request error: {str(e)}")
            return False
    
    def test_metrics_operational(self):
        """Test getting operational metrics"""
        try:
            response = self.session.get(f"{API_BASE}/metrics/operational")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    operational = data['data']
                    required_fields = ['activeVehicles', 'totalCapacity', 'currentStock', 'utilizationRate']
                    if all(field in operational for field in required_fields):
                        self.log_test("Metrics Operational", True, "Retrieved operational metrics", data)
                        return True
                    else:
                        self.log_test("Metrics Operational", False, "Missing required operational fields", data)
                        return False
                else:
                    self.log_test("Metrics Operational", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Metrics Operational", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Metrics Operational", False, f"Request error: {str(e)}")
            return False
    
    def test_routes_optimize(self):
        """Test route optimization"""
        try:
            route_data = {
                "origin": "Depot Jakarta",
                "destination": "SPBE Jakarta Selatan",
                "waypoints": ["SPBE Jakarta Utara", "SPBE Jakarta Barat"],
                "optimizeWaypoints": True
            }
            
            response = self.session.post(f"{API_BASE}/routes/optimize", json=route_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    route = data['data']
                    required_fields = ['id', 'name', 'origin', 'destination', 'distance', 'duration']
                    if all(field in route for field in required_fields):
                        self.log_test("Routes Optimize", True, "Route optimization successful", data)
                        return True
                    else:
                        self.log_test("Routes Optimize", False, "Missing required route fields", data)
                        return False
                else:
                    self.log_test("Routes Optimize", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Routes Optimize", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Routes Optimize", False, f"Request error: {str(e)}")
            return False
    
    def test_routes_optimize_missing_fields(self):
        """Test route optimization with missing required fields"""
        try:
            route_data = {
                "origin": "Depot Jakarta"
                # Missing destination
            }
            
            response = self.session.post(f"{API_BASE}/routes/optimize", json=route_data)
            
            if response.status_code == 400:
                data = response.json()
                if not data.get('success') and 'required' in data.get('message', '').lower():
                    self.log_test("Routes Optimize Missing Fields", True, "Correctly rejected incomplete route data", data)
                    return True
                else:
                    self.log_test("Routes Optimize Missing Fields", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Routes Optimize Missing Fields", False, f"Expected 400, got HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Routes Optimize Missing Fields", False, f"Request error: {str(e)}")
            return False
    
    def test_invalid_endpoint(self):
        """Test accessing invalid endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/invalid-endpoint")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'not found' in data.get('message', '').lower():
                    self.log_test("Invalid Endpoint", True, "Correctly returned 404 for invalid endpoint", data)
                    return True
                else:
                    self.log_test("Invalid Endpoint", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Invalid Endpoint", False, f"Expected 404, got HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Invalid Endpoint", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all test cases"""
        print(f"🚀 Starting comprehensive LPG Subsidy Portal API tests...")
        print(f"📍 Testing API at: {API_BASE}")
        print("=" * 80)
        
        # Test categories
        test_methods = [
            # Basic API tests
            self.test_api_root,
            
            # Authentication tests
            self.test_auth_login_valid,
            self.test_auth_login_invalid,
            self.test_auth_login_missing_fields,
            self.test_auth_logout,
            
            # SPBE tests
            self.test_spbe_get_all,
            self.test_spbe_get_specific,
            self.test_spbe_get_nonexistent,
            self.test_spbe_update_stock,
            
            # Vehicle tests
            self.test_vehicles_get_all,
            self.test_vehicles_get_specific,
            self.test_vehicles_update_position,
            
            # Delivery tests
            self.test_deliveries_get_all,
            self.test_deliveries_get_specific,
            self.test_deliveries_update_progress,
            
            # Alert tests
            self.test_alerts_get_all,
            self.test_alerts_resolve,
            
            # Metrics tests
            self.test_metrics_get_all,
            self.test_metrics_supply_chain,
            self.test_metrics_operational,
            
            # Route optimization tests
            self.test_routes_optimize,
            self.test_routes_optimize_missing_fields,
            
            # Error handling tests
            self.test_invalid_endpoint
        ]
        
        # Run all tests
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                self.log_test(test_method.__name__, False, f"Test execution error: {str(e)}")
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        print("\n📋 DETAILED RESULTS:")
        
        # Group by category
        categories = {
            'API Root': [],
            'Authentication': [],
            'SPBE Management': [],
            'Vehicle Management': [],
            'Delivery Management': [],
            'Alert System': [],
            'Metrics & Analytics': [],
            'Route Optimization': [],
            'Error Handling': []
        }
        
        for result in self.test_results:
            test_name = result['test']
            if 'API Root' in test_name:
                categories['API Root'].append(result)
            elif 'Auth' in test_name:
                categories['Authentication'].append(result)
            elif 'SPBE' in test_name:
                categories['SPBE Management'].append(result)
            elif 'Vehicles' in test_name:
                categories['Vehicle Management'].append(result)
            elif 'Deliveries' in test_name:
                categories['Delivery Management'].append(result)
            elif 'Alerts' in test_name:
                categories['Alert System'].append(result)
            elif 'Metrics' in test_name:
                categories['Metrics & Analytics'].append(result)
            elif 'Routes' in test_name:
                categories['Route Optimization'].append(result)
            else:
                categories['Error Handling'].append(result)
        
        for category, results in categories.items():
            if results:
                passed = sum(1 for r in results if r['success'])
                total = len(results)
                print(f"\n{category}: {passed}/{total} passed")
                for result in results:
                    status = "✅" if result['success'] else "❌"
                    print(f"  {status} {result['test']}")
        
        # Save results to file
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump(self.test_results, f, indent=2, default=str)
        
        print(f"\n💾 Detailed results saved to: /app/backend_test_results.json")
        return passed_tests, failed_tests, total_tests

if __name__ == "__main__":
    tester = LPGSubsidyPortalTester()
    tester.run_all_tests()