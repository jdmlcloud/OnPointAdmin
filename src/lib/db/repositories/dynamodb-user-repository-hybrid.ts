import { DynamoDBUser } from '@/lib/aws/dynamodb';
import DynamoDBUserRepository from './dynamodb-user-repository';
import DynamoDBUserRepositoryReal from './dynamodb-user-repository-real';

// Repositorio híbrido que usa datos reales o simulados según la configuración
export class DynamoDBUserRepositoryHybrid {
  private static instance: DynamoDBUserRepositoryHybrid;
  private realRepository: DynamoDBUserRepositoryReal;
  private mockRepository: DynamoDBUserRepository;

  private constructor() {
    this.realRepository = DynamoDBUserRepositoryReal.getInstance();
    this.mockRepository = DynamoDBUserRepository.getInstance();
  }

  public static getInstance(): DynamoDBUserRepositoryHybrid {
    if (!DynamoDBUserRepositoryHybrid.instance) {
      DynamoDBUserRepositoryHybrid.instance = new DynamoDBUserRepositoryHybrid();
    }
    return DynamoDBUserRepositoryHybrid.instance;
  }

  // Determinar si usar datos reales o simulados
  private shouldUseRealData(): boolean {
    return process.env.DYNAMODB_CONFIGURED === 'true' && 
           (process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID) && 
           (process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY) &&
           (process.env.DYNAMODB_REGION || process.env.AWS_REGION);
  }

  // Obtener todos los usuarios
  async listAll(): Promise<DynamoDBUser[]> {
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

  // Obtener usuario por ID
  async findById(id: string): Promise<DynamoDBUser | null> {
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

  // Obtener usuario por email
  async findByEmail(email: string): Promise<DynamoDBUser | null> {
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

  // Obtener usuarios por rol
  async findByRole(role: 'admin' | 'user' | 'provider'): Promise<DynamoDBUser[]> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.findByRole(role);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.findByRole(role);
      }
    }
    return await this.mockRepository.findByRole(role);
  }

  // Crear nuevo usuario
  async create(userData: Omit<DynamoDBUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBUser> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.create(userData);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.create(userData);
      }
    }
    return await this.mockRepository.create(userData);
  }

  // Actualizar usuario
  async update(id: string, userData: Partial<DynamoDBUser>): Promise<DynamoDBUser | null> {
    if (this.shouldUseRealData()) {
      try {
        return await this.realRepository.update(id, userData);
      } catch (error) {
        console.warn('Error con datos reales, usando datos simulados:', error);
        return await this.mockRepository.update(id, userData);
      }
    }
    return await this.mockRepository.update(id, userData);
  }

  // Eliminar usuario
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
    byRole: {
      admin: number;
      user: number;
      provider: number;
    };
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

  // Buscar usuarios
  async search(query: string): Promise<DynamoDBUser[]> {
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

  // Obtener información del modo actual
  getMode(): 'real' | 'simulation' {
    return this.shouldUseRealData() ? 'real' : 'simulation';
  }
}

export default DynamoDBUserRepositoryHybrid;
