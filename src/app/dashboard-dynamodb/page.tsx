'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Users, 
  Building2, 
  Package, 
  Activity, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface DynamoDBStatus {
  connected: boolean;
  region: string;
  tables: {
    users: boolean;
    providers: boolean;
    products: boolean;
    orders: boolean;
  };
  lastChecked: string;
  error?: string;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byRole: {
    admin: number;
    user: number;
    provider: number;
  };
}

interface ProviderStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  outOfStock: number;
  byCategory: Record<string, number>;
  totalValue: number;
}

interface DynamoDBStats {
  database: DynamoDBStatus;
  users: UserStats;
  providers: ProviderStats;
  products: ProductStats;
  summary: {
    totalUsers: number;
    totalProviders: number;
    totalProducts: number;
    totalValue: number;
    activeUsers: number;
    activeProviders: number;
    activeProducts: number;
  };
}

interface DynamoDBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export default function DashboardDynamoDBPage() {
  const [stats, setStats] = useState<DynamoDBStats | null>(null);
  const [products, setProducts] = useState<DynamoDBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Forzar modo real en producción
      const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('amplifyapp.com');
      const forceReal = isProduction ? '?forceReal=true' : '';
      
      const [statsResponse, productsResponse] = await Promise.all([
        fetch(`/api/dynamodb/stats${forceReal}`),
        fetch(`/api/dynamodb/products${forceReal}`)
      ]);
      
      const statsData = await statsResponse.json();
      const productsData = await productsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      } else {
        setError(statsData.message || 'Error al obtener estadísticas');
      }

      if (productsData.success) {
        setProducts(productsData.data);
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching DynamoDB data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getTableStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Cargando estadísticas de DynamoDB...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchStats} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Database className="h-8 w-8 text-blue-600" />
            <span>Dashboard DynamoDB</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Monitoreo y estadísticas de AWS DynamoDB
          </p>
        </div>
        <Button onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Estado de Conexión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Estado de Conexión</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Conexión DynamoDB</p>
                <p className="text-sm text-gray-600">Región: {stats.database.region}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(stats.database.connected)}
                <Badge variant={stats.database.connected ? 'default' : 'destructive'}>
                  {stats.database.connected ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Estado de Tablas</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Users</span>
                  {getTableStatusIcon(stats.database.tables.users)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Providers</span>
                  {getTableStatusIcon(stats.database.tables.providers)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Products</span>
                  {getTableStatusIcon(stats.database.tables.products)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Orders</span>
                  {getTableStatusIcon(stats.database.tables.orders)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.summary.activeUsers} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.totalProviders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.summary.activeProviders} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.summary.activeProducts} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.summary.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Inventario total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Estadísticas Detalladas */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="providers">Proveedores</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="products-list">Lista de Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.users.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.users.inactive}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.users.pending}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.users.byRole.admin}</div>
                  <p className="text-sm text-gray-600">Administradores</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.users.byRole.user}</div>
                  <p className="text-sm text-gray-600">Usuarios</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.users.byRole.provider}</div>
                  <p className="text-sm text-gray-600">Proveedores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.providers.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.providers.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.providers.inactive}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.providers.pending}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.products.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.products.inactive}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.products.outOfStock}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.products.byCategory).map(([category, count]) => (
                  <div key={category} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <p className="text-sm text-gray-600">{category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products-list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lista de Productos en AWS DynamoDB
              </CardTitle>
              <CardDescription>
                Productos almacenados en la tabla real de AWS DynamoDB
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Total de productos: {products.length}
                    </p>
                    <Button 
                      onClick={fetchStats} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{product.name}</h3>
                              <Badge 
                                variant={
                                  product.status === 'active' ? 'default' :
                                  product.status === 'inactive' ? 'secondary' : 'destructive'
                                }
                              >
                                {product.status === 'active' ? 'Activo' :
                                 product.status === 'inactive' ? 'Inactivo' : 'Sin Stock'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-muted-foreground">
                                Categoría: {product.category}
                              </span>
                              <span className="text-muted-foreground">
                                ID: {product.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
                  <p className="text-muted-foreground mb-4">
                    No se encontraron productos en la tabla de AWS DynamoDB
                  </p>
                  <Button onClick={fetchStats} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Información de Última Actualización */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Última actualización: {new Date(stats.database.lastChecked).toLocaleString()}</span>
            <Badge variant={stats.database.connected ? "default" : "outline"}>
              {stats.database.connected ? "Modo Real AWS" : "Modo Simulación"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
