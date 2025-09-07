import { DynamoDBProduct } from '@/lib/aws/dynamodb';
import DynamoDBProductRepository from './dynamodb-product-repository';
import DynamoDBProductRepositoryReal from './dynamodb-product-repository-real';

// Repositorio híbrido que usa datos reales o simulados según la configuración
export class DynamoDBProductRepositoryHybrid {
  private static instance: DynamoDBProductRepositoryHybrid;
  private mockRepository: DynamoDBProductRepository;
  private realRepository: DynamoDBProductRepositoryReal;

  private constructor() {
    this.mockRepository = DynamoDBProductRepository.getInstance();
    this.realRepository = DynamoDBProductRepositoryReal.getInstance();
  }

  public static getInstance(): DynamoDBProductRepositoryHybrid {
    if (!DynamoDBProductRepositoryHybrid.instance) {
      DynamoDBProductRepositoryHybrid.instance = new DynamoDBProductRepositoryHybrid();
    }
    return DynamoDBProductRepositoryHybrid.instance;
  }

  // Determinar si usar datos reales o simulados
  private shouldUseRealData(): boolean {
    // Forzar modo real en producción
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.VERCEL === '1' ||
                        (typeof window !== 'undefined' && window.location.hostname.includes('amplifyapp.com'));
    
    if (isProduction) {
      console.log('🔧 Modo producción detectado - Forzando DynamoDB real');
      return true;
    }
    
    return process.env.DYNAMODB_CONFIGURED === 'true' && 
           !!(process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID) && 
           !!(process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY) &&
           !!(process.env.DYNAMODB_REGION || process.env.AWS_REGION);
  }

  // Obtener todos los productos
  async listAll(): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.listAll();
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.listAll();
      }
    }
    return await this.mockRepository.listAll();
  }

  // Obtener producto por ID
  async findById(id: string): Promise<DynamoDBProduct | null> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findById(id);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findById(id);
      }
    }
    return await this.mockRepository.findById(id);
  }

  // Obtener productos por proveedor
  async findByProvider(providerId: string): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findByProvider(providerId);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findByProvider(providerId);
      }
    }
    return await this.mockRepository.findByProvider(providerId);
  }

  // Obtener productos por categoría
  async findByCategory(category: string): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findByCategory(category);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findByCategory(category);
      }
    }
    return await this.mockRepository.findByCategory(category);
  }

  // Obtener productos por estado
  async findByStatus(status: 'active' | 'inactive' | 'out_of_stock'): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findByStatus(status);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findByStatus(status);
      }
    }
    return await this.mockRepository.findByStatus(status);
  }

  // Crear nuevo producto
  async create(productData: Omit<DynamoDBProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProduct> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.create(productData);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.create(productData);
      }
    }
    return await this.mockRepository.create(productData);
  }

  // Actualizar producto
  async update(id: string, productData: Partial<DynamoDBProduct>): Promise<DynamoDBProduct | null> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.update(id, productData);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.update(id, productData);
      }
    }
    return await this.mockRepository.update(id, productData);
  }

  // Eliminar producto
  async delete(id: string): Promise<boolean> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.delete(id);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.delete(id);
      }
    }
    return await this.mockRepository.delete(id);
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    byCategory: Record<string, number>;
    totalValue: number;
  }> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.getStats();
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.getStats();
      }
    }
    return await this.mockRepository.getStats();
  }

  // Buscar productos
  async search(query: string): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.search(query);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.search(query);
      }
    }
    return await this.mockRepository.search(query);
  }

  // Obtener productos activos
  async getActiveProducts(): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.getActiveProducts();
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.getActiveProducts();
      }
    }
    return await this.mockRepository.getActiveProducts();
  }

  // Obtener productos por rango de precio
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<DynamoDBProduct[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findByPriceRange(minPrice, maxPrice);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findByPriceRange(minPrice, maxPrice);
      }
    }
    return await this.mockRepository.findByPriceRange(minPrice, maxPrice);
  }

  // Obtener información del modo actual
  getMode(): 'real' | 'simulation' {
    return this.shouldUseRealData() ? 'real' : 'simulation';
  }
}

export default DynamoDBProductRepositoryHybrid;
