import { DynamoDBProduct } from '@/lib/aws/dynamodb';
import DynamoDBProductRepositoryReal from './dynamodb-product-repository-real';

// Repositorio de producción que SOLO usa datos reales de AWS DynamoDB
export class DynamoDBProductRepositoryProduction {
  private static instance: DynamoDBProductRepositoryProduction;
  private realRepository: DynamoDBProductRepositoryReal;

  private constructor() {
    this.realRepository = DynamoDBProductRepositoryReal.getInstance();
  }

  public static getInstance(): DynamoDBProductRepositoryProduction {
    if (!DynamoDBProductRepositoryProduction.instance) {
      DynamoDBProductRepositoryProduction.instance = new DynamoDBProductRepositoryProduction();
    }
    return DynamoDBProductRepositoryProduction.instance;
  }

  // Obtener todos los productos - SOLO datos reales
  async listAll(): Promise<DynamoDBProduct[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.listAll();
  }

  // Obtener producto por ID - SOLO datos reales
  async findById(id: string): Promise<DynamoDBProduct | null> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findById(id);
  }

  // Obtener productos por proveedor - SOLO datos reales
  async findByProvider(providerId: string): Promise<DynamoDBProduct[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findByProvider(providerId);
  }

  // Crear producto - SOLO datos reales
  async create(productData: Omit<DynamoDBProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProduct> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.create(productData);
  }

  // Actualizar producto - SOLO datos reales
  async update(id: string, productData: Partial<DynamoDBProduct>): Promise<DynamoDBProduct> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.update(id, productData);
  }

  // Eliminar producto - SOLO datos reales
  async delete(id: string): Promise<boolean> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.delete(id);
  }

  // Obtener estadísticas - SOLO datos reales
  async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.getStats();
  }

  // Buscar productos - SOLO datos reales
  async search(query: string): Promise<DynamoDBProduct[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.search(query);
  }

  // Obtener productos por categoría - SOLO datos reales
  async findByCategory(category: string): Promise<DynamoDBProduct[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findByCategory(category);
  }

  // Obtener productos por estado - SOLO datos reales
  async findByStatus(status: string): Promise<DynamoDBProduct[]> {
    console.log('🚀 Producción: Usando SOLO datos reales de DynamoDB');
    return await this.realRepository.findByStatus(status);
  }
}

export default DynamoDBProductRepositoryProduction;
