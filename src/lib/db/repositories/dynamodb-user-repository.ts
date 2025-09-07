import { DynamoDBUser, dynamoDBUtils } from '@/lib/aws/dynamodb';

// Repositorio simulado para usuarios DynamoDB
export class DynamoDBUserRepository {
  private static instance: DynamoDBUserRepository;
  private users: DynamoDBUser[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): DynamoDBUserRepository {
    if (!DynamoDBUserRepository.instance) {
      DynamoDBUserRepository.instance = new DynamoDBUserRepository();
    }
    return DynamoDBUserRepository.instance;
  }

  private initializeMockData() {
    this.users = [
      {
        id: 'dynamodb_user_1',
        email: 'admin@onpoint.com',
        name: 'Administrador OnPoint',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        cognitoId: 'cognito_admin_123',
      },
      {
        id: 'dynamodb_user_2',
        email: 'provider1@example.com',
        name: 'Proveedor Principal',
        role: 'provider',
        status: 'active',
        createdAt: '2024-01-16T09:30:00Z',
        updatedAt: '2024-01-16T09:30:00Z',
        cognitoId: 'cognito_provider_456',
      },
      {
        id: 'dynamodb_user_3',
        email: 'user1@example.com',
        name: 'Usuario Cliente',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-17T14:20:00Z',
        updatedAt: '2024-01-17T14:20:00Z',
        cognitoId: 'cognito_user_789',
      },
      {
        id: 'dynamodb_user_4',
        email: 'pending@example.com',
        name: 'Usuario Pendiente',
        role: 'user',
        status: 'pending',
        createdAt: '2024-01-18T11:45:00Z',
        updatedAt: '2024-01-18T11:45:00Z',
      },
    ];
  }

  // Obtener todos los usuarios
  async listAll(): Promise<DynamoDBUser[]> {
    await this.simulateDelay();
    return [...this.users];
  }

  // Obtener usuario por ID
  async findById(id: string): Promise<DynamoDBUser | null> {
    await this.simulateDelay();
    return this.users.find(user => user.id === id) || null;
  }

  // Obtener usuario por email
  async findByEmail(email: string): Promise<DynamoDBUser | null> {
    await this.simulateDelay();
    return this.users.find(user => user.email === email) || null;
  }

  // Obtener usuarios por rol
  async findByRole(role: 'admin' | 'user' | 'provider'): Promise<DynamoDBUser[]> {
    await this.simulateDelay();
    return this.users.filter(user => user.role === role);
  }

  // Crear nuevo usuario
  async create(userData: Omit<DynamoDBUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBUser> {
    await this.simulateDelay();
    
    const newUser = dynamoDBUtils.createItem(userData);
    this.users.push(newUser);
    
    return newUser;
  }

  // Actualizar usuario
  async update(id: string, userData: Partial<DynamoDBUser>): Promise<DynamoDBUser | null> {
    await this.simulateDelay();
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    const updatedUser = dynamoDBUtils.updateItem({
      ...this.users[userIndex],
      ...userData,
    });

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // Eliminar usuario
  async delete(id: string): Promise<boolean> {
    await this.simulateDelay();
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    byRole: {
      admin: number;
      user: number;
      provider: number;
    };
  }> {
    await this.simulateDelay();
    
    const total = this.users.length;
    const active = this.users.filter(u => u.status === 'active').length;
    const inactive = this.users.filter(u => u.status === 'inactive').length;
    const pending = this.users.filter(u => u.status === 'pending').length;
    
    const byRole = {
      admin: this.users.filter(u => u.role === 'admin').length,
      user: this.users.filter(u => u.role === 'user').length,
      provider: this.users.filter(u => u.role === 'provider').length,
    };

    return { total, active, inactive, pending, byRole };
  }

  // Buscar usuarios
  async search(query: string): Promise<DynamoDBUser[]> {
    await this.simulateDelay();
    
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Simular delay de red
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
}

export default DynamoDBUserRepository;
