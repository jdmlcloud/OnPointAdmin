# 🧬 Atomic Design System

## 📁 Estructura de Componentes

```
src/components/atomic/
├── atoms/           # Componentes básicos
├── molecules/       # Componentes compuestos  
├── organisms/       # Componentes complejos con variantes
├── templates/       # Plantillas de páginas
└── pages/          # Páginas específicas
```

## 🎯 Principios

### **ÁTOMOS (Atoms)**
- Componentes más pequeños y reutilizables
- Sin lógica de negocio, solo presentación
- Ejemplos: `Card`, `Button`, `Badge`, `Input`

### **MOLÉCULAS (Molecules)**
- Combinación de átomos con lógica básica
- Reutilizables pero con propósito específico
- Ejemplos: `CardItem`, `TagSelector`, `ActionModal`

### **ORGANISMOS (Organisms)**
- Componentes complejos con variantes específicas
- Lógica de negocio y propósito definido
- Ejemplos: `ProviderCard`, `ProductCard`, `UserCard`

## 🔧 Uso de Componentes

### **Importar desde Atomic Design:**
```typescript
import { ProviderCard, ProductCard, UserCard } from '@/components/atomic'
```

### **Importar por categoría:**
```typescript
// Solo átomos
import { Card, Button, Badge } from '@/components/atomic/atoms'

// Solo moléculas
import { CardItem, TagSelector } from '@/components/atomic/molecules'

// Solo organismos
import { ProviderCard, ProductCard } from '@/components/atomic/organisms'
```

## 🎨 Variantes de Card

### **ProviderCard**
```typescript
<ProviderCard
  id="1"
  title="Proveedor ABC"
  description="Descripción del proveedor"
  image="logo.jpg"
  industry="Tecnología"
  isActive={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### **ProductCard**
```typescript
<ProductCard
  id="1"
  title="Producto XYZ"
  description="Descripción del producto"
  image="product.jpg"
  category="Electrónicos"
  price={299.99}
  stock={10}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### **UserCard**
```typescript
<UserCard
  id="1"
  title="Juan Pérez"
  description="Administrador"
  image="avatar.jpg"
  role="admin"
  department="IT"
  lastLogin="2024-01-15"
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## 🎯 Fallbacks de Imágenes

Cada tipo de card tiene iconos específicos cuando no hay imagen:

- **ProviderCard**: `Building2` (edificio)
- **ProductCard**: `Package` (paquete)
- **UserCard**: `Users` (usuarios)
- **LogoCard**: `Image` (imagen)
- **ProposalCard**: `FileText` (documento)
- **QuotationCard**: `TrendingUp` (gráfico)

## 🔄 Extensibilidad

Para agregar nuevas variantes:

1. Crear el componente en `organisms/card-variants/`
2. Exportar en `organisms/index.ts`
3. Exportar en `index.ts` principal
4. Documentar en este README

## 📝 Logs de Debug

Todos los componentes incluyen logs de debug para desarrollo:
- `🖼️ Error cargando imagen, usando fallback para tipo: provider`
- `🖱️ CardItem clickeado: {id, title, type}`
- `✏️ Editando item: {id, title, type}`
- `🗑️ Eliminando item: {id, title, type}`
