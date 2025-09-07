import { DynamoDBProduct, dynamoDBUtils } from '@/lib/aws/dynamodb';

// Repositorio simulado para productos DynamoDB
export class DynamoDBProductRepository {
  private static instance: DynamoDBProductRepository;
  private products: DynamoDBProduct[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): DynamoDBProductRepository {
    if (!DynamoDBProductRepository.instance) {
      DynamoDBProductRepository.instance = new DynamoDBProductRepository();
    }
    return DynamoDBProductRepository.instance;
  }

  private initializeMockData() {
    this.products = [
      {
        id: 'dynamodb_product_1',
        name: 'Laptop Dell XPS 13',
        description: 'Laptop ultradelgada con pantalla 13.3" 4K, Intel i7, 16GB RAM, 512GB SSD',
        price: 1299.99,
        category: 'Electrónicos',
        providerId: 'dynamodb_provider_1',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'dynamodb_product_2',
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple con cámara Pro, 256GB, color Natural Titanium',
        price: 999.99,
        category: 'Electrónicos',
        providerId: 'dynamodb_provider_1',
        status: 'active',
        createdAt: '2024-01-16T11:30:00Z',
        updatedAt: '2024-01-16T11:30:00Z',
      },
      {
        id: 'dynamodb_product_3',
        name: 'Software de Gestión Empresarial',
        description: 'Solución completa de ERP para empresas medianas y grandes',
        price: 299.99,
        category: 'Software',
        providerId: 'dynamodb_provider_2',
        status: 'active',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:15:00Z',
      },
      {
        id: 'dynamodb_product_4',
        name: 'Servicios de Cloud Computing',
        description: 'Infraestructura en la nube escalable con soporte 24/7',
        price: 199.99,
        category: 'Servicios',
        providerId: 'dynamodb_provider_3',
        status: 'active',
        createdAt: '2024-01-18T14:20:00Z',
        updatedAt: '2024-01-18T14:20:00Z',
      },
      {
        id: 'dynamodb_product_5',
        name: 'Consultoría Digital',
        description: 'Servicios de transformación digital para empresas',
        price: 150.00,
        category: 'Consultoría',
        providerId: 'dynamodb_provider_2',
        status: 'active',
        createdAt: '2024-01-19T16:45:00Z',
        updatedAt: '2024-01-19T16:45:00Z',
      },
      {
        id: 'dynamodb_product_6',
        name: 'Tablet Samsung Galaxy Tab S9',
        description: 'Tablet Android premium con S Pen, 128GB, WiFi',
        price: 799.99,
        category: 'Electrónicos',
        providerId: 'dynamodb_provider_1',
        status: 'out_of_stock',
        createdAt: '2024-01-20T12:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z',
      },
      {
        id: 'dynamodb_product_7',
        name: 'Solución de Seguridad Cibernética',
        description: 'Protección avanzada contra amenazas digitales',
        price: 89.99,
        category: 'Seguridad',
        providerId: 'dynamodb_provider_3',
        status: 'active',
        createdAt: '2024-01-21T08:30:00Z',
        updatedAt: '2024-01-21T08:30:00Z',
      },
    ];
  }

  // Obtener todos los productos
  async listAll(): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    return [...this.products];
  }

  // Obtener producto por ID
  async findById(id: string): Promise<DynamoDBProduct | null> {
    await this.simulateDelay();
    return this.products.find(product => product.id === id) || null;
  }

  // Obtener productos por proveedor
  async findByProvider(providerId: string): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    return this.products.filter(product => product.providerId === providerId);
  }

  // Obtener productos por categoría
  async findByCategory(category: string): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    return this.products.filter(product => product.category === category);
  }

  // Obtener productos por estado
  async findByStatus(status: 'active' | 'inactive' | 'out_of_stock'): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    return this.products.filter(product => product.status === status);
  }

  // Crear nuevo producto
  async create(productData: Omit<DynamoDBProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProduct> {
    await this.simulateDelay();
    
    const newProduct = dynamoDBUtils.createItem(productData);
    this.products.push(newProduct);
    
    return newProduct;
  }

  // Actualizar producto
  async update(id: string, productData: Partial<DynamoDBProduct>): Promise<DynamoDBProduct | null> {
    await this.simulateDelay();
    
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    const updatedProduct = dynamoDBUtils.updateItem({
      ...this.products[productIndex],
      ...productData,
    });

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  // Eliminar producto
  async delete(id: string): Promise<boolean> {
    await this.simulateDelay();
    
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    this.products.splice(productIndex, 1);
    return true;
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
    await this.simulateDelay();
    
    const total = this.products.length;
    const active = this.products.filter(p => p.status === 'active').length;
    const inactive = this.products.filter(p => p.status === 'inactive').length;
    const outOfStock = this.products.filter(p => p.status === 'out_of_stock').length;
    
    const byCategory: Record<string, number> = {};
    this.products.forEach(product => {
      byCategory[product.category] = (byCategory[product.category] || 0) + 1;
    });

    const totalValue = this.products.reduce((sum, product) => sum + product.price, 0);

    return { total, active, inactive, outOfStock, byCategory, totalValue };
  }

  // Buscar productos
  async search(query: string): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Obtener productos activos
  async getActiveProducts(): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    return this.products.filter(product => product.status === 'active');
  }

  // Obtener productos por rango de precio
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<DynamoDBProduct[]> {
    await this.simulateDelay();
    return this.products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Simular delay de red
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
}

export default DynamoDBProductRepository;
