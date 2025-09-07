import { DynamoDBProvider, dynamoDBUtils } from '@/lib/aws/dynamodb';

// Repositorio simulado para proveedores DynamoDB
export class DynamoDBProviderRepository {
  private static instance: DynamoDBProviderRepository;
  private providers: DynamoDBProvider[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): DynamoDBProviderRepository {
    if (!DynamoDBProviderRepository.instance) {
      DynamoDBProviderRepository.instance = new DynamoDBProviderRepository();
    }
    return DynamoDBProviderRepository.instance;
  }

  private initializeMockData() {
    this.providers = [
      {
        id: 'dynamodb_provider_1',
        name: 'Empresa ABC - Marketing Corporativo',
        email: 'pedidos@empresaabc.com',
        phone: '+52-55-1234-5678',
        address: 'Av. Reforma 123, Col. Centro, CDMX 06000',
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        cognitoId: 'cognito_client_abc',
      },
      {
        id: 'dynamodb_provider_2',
        name: 'Eventos Deportivos MX',
        email: 'merchandising@eventosdeportivos.com',
        phone: '+52-55-2345-6789',
        address: 'Stadium Plaza 456, Col. Del Valle, CDMX 03100',
        status: 'active',
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-16T09:15:00Z',
        cognitoId: 'cognito_client_sports',
      },
      {
        id: 'dynamodb_provider_3',
        name: 'Universidad Tecnológica',
        email: 'compras@universidad.edu.mx',
        phone: '+52-55-3456-7890',
        address: 'Campus Norte, Col. Universidad, CDMX 04510',
        status: 'active',
        createdAt: '2024-01-17T10:30:00Z',
        updatedAt: '2024-01-17T10:30:00Z',
        cognitoId: 'cognito_client_university',
      },
      {
        id: 'dynamodb_provider_4',
        name: 'Startup Fintech',
        email: 'branding@startupfintech.com',
        phone: '+52-55-4567-8901',
        address: 'Polanco 789, Col. Polanco, CDMX 11560',
        status: 'pending',
        createdAt: '2024-01-18T11:45:00Z',
        updatedAt: '2024-01-18T11:45:00Z',
      },
      {
        id: 'dynamodb_provider_5',
        name: 'ONG Ayuda Social',
        email: 'material@ongayuda.org',
        phone: '+52-55-5678-9012',
        address: 'Coyoacán 321, Col. Coyoacán, CDMX 04000',
        status: 'active',
        createdAt: '2024-01-19T13:20:00Z',
        updatedAt: '2024-01-19T13:20:00Z',
        cognitoId: 'cognito_client_ong',
      },
      {
        id: 'dynamodb_provider_6',
        name: 'Restaurante Cadena',
        email: 'uniformes@restaurantecadena.com',
        phone: '+52-55-6789-0123',
        address: 'Roma Norte 654, Col. Roma Norte, CDMX 06700',
        status: 'inactive',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
      },
    ];
  }

  // Obtener todos los proveedores
  async listAll(): Promise<DynamoDBProvider[]> {
    await this.simulateDelay();
    return [...this.providers];
  }

  // Obtener proveedor por ID
  async findById(id: string): Promise<DynamoDBProvider | null> {
    await this.simulateDelay();
    return this.providers.find(provider => provider.id === id) || null;
  }

  // Obtener proveedor por email
  async findByEmail(email: string): Promise<DynamoDBProvider | null> {
    await this.simulateDelay();
    return this.providers.find(provider => provider.email === email) || null;
  }

  // Obtener proveedores por estado
  async findByStatus(status: 'active' | 'inactive' | 'pending'): Promise<DynamoDBProvider[]> {
    await this.simulateDelay();
    return this.providers.filter(provider => provider.status === status);
  }

  // Crear nuevo proveedor
  async create(providerData: Omit<DynamoDBProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProvider> {
    await this.simulateDelay();
    
    const newProvider = dynamoDBUtils.createItem(providerData);
    this.providers.push(newProvider);
    
    return newProvider;
  }

  // Actualizar proveedor
  async update(id: string, providerData: Partial<DynamoDBProvider>): Promise<DynamoDBProvider | null> {
    await this.simulateDelay();
    
    const providerIndex = this.providers.findIndex(provider => provider.id === id);
    if (providerIndex === -1) return null;

    const updatedProvider = dynamoDBUtils.updateItem({
      ...this.providers[providerIndex],
      ...providerData,
    });

    this.providers[providerIndex] = updatedProvider;
    return updatedProvider;
  }

  // Eliminar proveedor
  async delete(id: string): Promise<boolean> {
    await this.simulateDelay();
    
    const providerIndex = this.providers.findIndex(provider => provider.id === id);
    if (providerIndex === -1) return false;

    this.providers.splice(providerIndex, 1);
    return true;
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }> {
    await this.simulateDelay();
    
    const total = this.providers.length;
    const active = this.providers.filter(p => p.status === 'active').length;
    const inactive = this.providers.filter(p => p.status === 'inactive').length;
    const pending = this.providers.filter(p => p.status === 'pending').length;

    return { total, active, inactive, pending };
  }

  // Buscar proveedores
  async search(query: string): Promise<DynamoDBProvider[]> {
    await this.simulateDelay();
    
    const lowercaseQuery = query.toLowerCase();
    return this.providers.filter(provider => 
      provider.name.toLowerCase().includes(lowercaseQuery) ||
      provider.email.toLowerCase().includes(lowercaseQuery) ||
      provider.address.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Obtener proveedores activos
  async getActiveProviders(): Promise<DynamoDBProvider[]> {
    await this.simulateDelay();
    return this.providers.filter(provider => provider.status === 'active');
  }

  // Simular delay de red
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
}

export default DynamoDBProviderRepository;
