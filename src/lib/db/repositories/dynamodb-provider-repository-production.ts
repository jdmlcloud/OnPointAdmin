import { DynamoDBProvider } from '@/lib/aws/dynamodb';
import DynamoDBProviderRepositoryReal from './dynamodb-provider-repository-real';

// Repositorio de producción que SOLO usa datos reales de AWS DynamoDB
export class DynamoDBProviderRepositoryProduction {
  private static instance: DynamoDBProviderRepositoryProduction;
  private realRepository: DynamoDBProviderRepositoryReal;

  private constructor() {
    this.realRepository = DynamoDBProviderRepositoryReal.getInstance();
  }

  public static getInstance(): DynamoDBProviderRepositoryProduction {
    if (!DynamoDBProviderRepositoryProduction.instance) {
      DynamoDBProviderRepositoryProduction.instance = new DynamoDBProviderRepositoryProduction();
    }
    return DynamoDBProviderRepositoryProduction.instance;
  }

  // Obtener todos los proveedores - SOLO datos reales
  async listAll(): Promise<DynamoDBProvider[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.listAll();
  }

  // Obtener proveedor por ID - SOLO datos reales
  async findById(id: string): Promise<DynamoDBProvider | null> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findById(id);
  }

  // Obtener proveedor por email - SOLO datos reales
  async findByEmail(email: string): Promise<DynamoDBProvider | null> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findByEmail(email);
  }

  // Crear proveedor - SOLO datos reales
  async create(providerData: Omit<DynamoDBProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProvider> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.create(providerData);
  }

  // Actualizar proveedor - SOLO datos reales
  async update(id: string, providerData: Partial<DynamoDBProvider>): Promise<DynamoDBProvider> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.update(id, providerData);
  }

  // Eliminar proveedor - SOLO datos reales
  async delete(id: string): Promise<boolean> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.delete(id);
  }

  // Obtener estadísticas - SOLO datos reales
  async getStats(): Promise<{ total: number; active: number; inactive: number; pending: number }> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.getStats();
  }
}

export default DynamoDBProviderRepositoryProduction;
