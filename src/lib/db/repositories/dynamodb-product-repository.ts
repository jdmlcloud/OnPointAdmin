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
        name: 'Camisetas Personalizadas - Algodón 100%',
        description: 'Camisetas de algodón 100% con impresión digital de alta calidad. Disponible en tallas S, M, L, XL. Mínimo 50 piezas.',
        price: 85.00,
        category: 'Textiles',
        providerId: 'dynamodb_provider_1',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'dynamodb_product_2',
        name: 'Tazas Cerámicas con Logo',
        description: 'Tazas de cerámica blanca 11oz con impresión sublimada. Ideal para regalos corporativos. Mínimo 25 piezas.',
        price: 45.00,
        category: 'Promocionales',
        providerId: 'dynamodb_provider_1',
        status: 'active',
        createdAt: '2024-01-16T11:30:00Z',
        updatedAt: '2024-01-16T11:30:00Z',
      },
      {
        id: 'dynamodb_product_3',
        name: 'Stickers Vinílicos Personalizados',
        description: 'Stickers de vinilo resistente al agua y UV. Perfectos para vehículos, laptops y superficies lisas. Mínimo 100 piezas.',
        price: 2.50,
        category: 'Adhesivos',
        providerId: 'dynamodb_provider_2',
        status: 'active',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:15:00Z',
      },
      {
        id: 'dynamodb_product_4',
        name: 'Banners Publicitarios - Vinilo',
        description: 'Banners de vinilo de alta resolución para exteriores. Tamaños estándar 1x2m, 2x3m, 3x4m. Incluye ojales metálicos.',
        price: 180.00,
        category: 'Publicidad',
        providerId: 'dynamodb_provider_2',
        status: 'active',
        createdAt: '2024-01-18T14:20:00Z',
        updatedAt: '2024-01-18T14:20:00Z',
      },
      {
        id: 'dynamodb_product_5',
        name: 'Uniformes Corporativos - Polo',
        description: 'Polos de poliéster con logo bordado. Disponible en varios colores. Tallas S a XXL. Mínimo 20 piezas.',
        price: 120.00,
        category: 'Textiles',
        providerId: 'dynamodb_provider_6',
        status: 'active',
        createdAt: '2024-01-19T16:45:00Z',
        updatedAt: '2024-01-19T16:45:00Z',
      },
      {
        id: 'dynamodb_product_6',
        name: 'Lonas para Eventos - 3x2m',
        description: 'Lonas de PVC para eventos y exposiciones. Impresión digital de alta calidad. Incluye sistema de montaje.',
        price: 350.00,
        category: 'Eventos',
        providerId: 'dynamodb_provider_2',
        status: 'out_of_stock',
        createdAt: '2024-01-20T12:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z',
      },
      {
        id: 'dynamodb_product_7',
        name: 'Etiquetas Adhesivas - Rollo 1000',
        description: 'Etiquetas adhesivas blancas para productos. Tamaño 5x3cm. Impresión offset de alta calidad. Mínimo 5 rollos.',
        price: 25.00,
        category: 'Etiquetas',
        providerId: 'dynamodb_provider_3',
        status: 'active',
        createdAt: '2024-01-21T08:30:00Z',
        updatedAt: '2024-01-21T08:30:00Z',
      },
      {
        id: 'dynamodb_product_8',
        name: 'Gorras Bordadas - Ajustable',
        description: 'Gorras de algodón con logo bordado. Ajuste trasero. Disponible en varios colores. Mínimo 30 piezas.',
        price: 95.00,
        category: 'Textiles',
        providerId: 'dynamodb_provider_1',
        status: 'active',
        createdAt: '2024-01-22T10:15:00Z',
        updatedAt: '2024-01-22T10:15:00Z',
      },
      {
        id: 'dynamodb_product_9',
        name: 'Material Promocional - Flyers',
        description: 'Flyers promocionales en papel couché 300g. Tamaño A5. Impresión a color. Mínimo 1000 piezas.',
        price: 0.15,
        category: 'Papelería',
        providerId: 'dynamodb_provider_4',
        status: 'active',
        createdAt: '2024-01-23T13:45:00Z',
        updatedAt: '2024-01-23T13:45:00Z',
      },
      {
        id: 'dynamodb_product_10',
        name: 'Bolsas Ecológicas - Algodón',
        description: 'Bolsas de algodón orgánico con logo serigrafiado. Tamaño 40x35cm. Ideal para eventos ecológicos. Mínimo 50 piezas.',
        price: 35.00,
        category: 'Ecológicos',
        providerId: 'dynamodb_provider_5',
        status: 'active',
        createdAt: '2024-01-24T15:20:00Z',
        updatedAt: '2024-01-24T15:20:00Z',
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
