import { DynamoDBUser } from '@/lib/aws/dynamodb';
import DynamoDBUserRepositoryReal from './dynamodb-user-repository-real';

// Repositorio de producción que SOLO usa datos reales de AWS DynamoDB
export class DynamoDBUserRepositoryProduction {
  private static instance: DynamoDBUserRepositoryProduction;
  private realRepository: DynamoDBUserRepositoryReal;

  private constructor() {
    this.realRepository = DynamoDBUserRepositoryReal.getInstance();
  }

  public static getInstance(): DynamoDBUserRepositoryProduction {
    if (!DynamoDBUserRepositoryProduction.instance) {
      DynamoDBUserRepositoryProduction.instance = new DynamoDBUserRepositoryProduction();
    }
    return DynamoDBUserRepositoryProduction.instance;
  }

  // Obtener todos los usuarios - SOLO datos reales
  async listAll(): Promise<DynamoDBUser[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.listAll();
  }

  // Obtener usuario por ID - SOLO datos reales
  async findById(id: string): Promise<DynamoDBUser | null> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findById(id);
  }

  // Obtener usuario por email - SOLO datos reales
  async findByEmail(email: string): Promise<DynamoDBUser | null> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findByEmail(email);
  }

  // Crear usuario - SOLO datos reales
  async create(userData: Omit<DynamoDBUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBUser> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.create(userData);
  }

  // Actualizar usuario - SOLO datos reales
  async update(id: string, userData: Partial<DynamoDBUser>): Promise<DynamoDBUser | null> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.update(id, userData);
  }

  // Eliminar usuario - SOLO datos reales
  async delete(id: string): Promise<boolean> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.delete(id);
  }

  // Obtener estadísticas - SOLO datos reales
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
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.getStats();
  }

  // Buscar usuarios - SOLO datos reales
  async search(query: string): Promise<DynamoDBUser[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.search(query);
  }

  // Obtener usuarios por rol - SOLO datos reales
  async findByRole(role: 'admin' | 'user' | 'provider'): Promise<DynamoDBUser[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findByRole(role);
  }
}

export default DynamoDBUserRepositoryProduction;
