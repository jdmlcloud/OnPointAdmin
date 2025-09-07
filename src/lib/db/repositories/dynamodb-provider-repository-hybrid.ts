import { DynamoDBProvider } from '@/lib/aws/dynamodb';
import DynamoDBProviderRepository from './dynamodb-provider-repository';
import DynamoDBProviderRepositoryReal from './dynamodb-provider-repository-real';

// Repositorio híbrido que usa datos reales o simulados según la configuración
export class DynamoDBProviderRepositoryHybrid {
  private static instance: DynamoDBProviderRepositoryHybrid;
  private mockRepository: DynamoDBProviderRepository;
  private realRepository: DynamoDBProviderRepositoryReal;

  private constructor() {
    this.mockRepository = DynamoDBProviderRepository.getInstance();
    this.realRepository = DynamoDBProviderRepositoryReal.getInstance();
  }

  public static getInstance(): DynamoDBProviderRepositoryHybrid {
    if (!DynamoDBProviderRepositoryHybrid.instance) {
      DynamoDBProviderRepositoryHybrid.instance = new DynamoDBProviderRepositoryHybrid();
    }
    return DynamoDBProviderRepositoryHybrid.instance;
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

  // Obtener todos los proveedores
  async listAll(): Promise<DynamoDBProvider[]> {
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

  // Obtener proveedor por ID
  async findById(id: string): Promise<DynamoDBProvider | null> {
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

  // Obtener proveedor por email
  async findByEmail(email: string): Promise<DynamoDBProvider | null> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findByEmail(email);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findByEmail(email);
      }
    }
    return await this.mockRepository.findByEmail(email);
  }

  // Obtener proveedores por estado
  async findByStatus(status: 'active' | 'inactive' | 'pending'): Promise<DynamoDBProvider[]> {
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

  // Crear nuevo proveedor
  async create(providerData: Omit<DynamoDBProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProvider> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.create(providerData);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.create(providerData);
      }
    }
    return await this.mockRepository.create(providerData);
  }

  // Actualizar proveedor
  async update(id: string, providerData: Partial<DynamoDBProvider>): Promise<DynamoDBProvider | null> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.update(id, providerData);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.update(id, providerData);
      }
    }
    return await this.mockRepository.update(id, providerData);
  }

  // Eliminar proveedor
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
    pending: number;
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

  // Buscar proveedores
  async search(query: string): Promise<DynamoDBProvider[]> {
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

  // Obtener proveedores activos
  async getActiveProviders(): Promise<DynamoDBProvider[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.getActiveProviders();
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.getActiveProviders();
      }
    }
    return await this.mockRepository.getActiveProviders();
  }

  // Obtener información del modo actual
  getMode(): 'real' | 'simulation' {
    return this.shouldUseRealData() ? 'real' : 'simulation';
  }
}

export default DynamoDBProviderRepositoryHybrid;
