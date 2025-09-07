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
        name: 'Tech Solutions Corp',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0101',
        address: '123 Tech Street, Silicon Valley, CA 94000',
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        cognitoId: 'cognito_provider_tech',
      },
      {
        id: 'dynamodb_provider_2',
        name: 'Digital Innovations Ltd',
        email: 'info@digitalinnovations.com',
        phone: '+1-555-0102',
        address: '456 Innovation Ave, Austin, TX 78701',
        status: 'active',
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-16T09:15:00Z',
        cognitoId: 'cognito_provider_digital',
      },
      {
        id: 'dynamodb_provider_3',
        name: 'Cloud Services Inc',
        email: 'support@cloudservices.com',
        phone: '+1-555-0103',
        address: '789 Cloud Plaza, Seattle, WA 98101',
        status: 'active',
        createdAt: '2024-01-17T10:30:00Z',
        updatedAt: '2024-01-17T10:30:00Z',
        cognitoId: 'cognito_provider_cloud',
      },
      {
        id: 'dynamodb_provider_4',
        name: 'Startup Solutions',
        email: 'hello@startupsolutions.com',
        phone: '+1-555-0104',
        address: '321 Startup Blvd, Miami, FL 33101',
        status: 'pending',
        createdAt: '2024-01-18T11:45:00Z',
        updatedAt: '2024-01-18T11:45:00Z',
      },
      {
        id: 'dynamodb_provider_5',
        name: 'Enterprise Systems',
        email: 'contact@enterprisesys.com',
        phone: '+1-555-0105',
        address: '654 Enterprise Way, New York, NY 10001',
        status: 'inactive',
        createdAt: '2024-01-19T13:20:00Z',
        updatedAt: '2024-01-19T13:20:00Z',
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
