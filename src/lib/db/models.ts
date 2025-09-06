import { z } from 'zod'
import { DynamoDBItem } from './dynamodb'

// Esquemas de validación con Zod
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'ejecutivo', 'cliente']),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  avatar: z.string().url().optional(),
  lastLogin: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ProviderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  category: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().default('USD'),
  category: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  specifications: z.record(z.any()).optional(),
  providerId: z.string().uuid(),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
  stock: z.number().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const QuotationSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  products: z.array(z.object({
    productId: z.string().uuid(),
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
    total: z.number().min(0),
  })),
  total: z.number().min(0),
  currency: z.string().default('USD'),
  status: z.enum(['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired']).default('draft'),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ProposalSchema = z.object({
  id: z.string().uuid(),
  quotationId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  template: z.string().optional(),
  mockup: z.string().url().optional(),
  status: z.enum(['draft', 'review', 'approved', 'sent', 'accepted', 'rejected']).default('draft'),
  version: z.number().min(1).default(1),
  pdfUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const WhatsAppMessageSchema = z.object({
  id: z.string().uuid(),
  messageId: z.string(), // ID del mensaje de WhatsApp
  from: z.string(), // Número de teléfono del remitente
  to: z.string(), // Número de teléfono del destinatario
  type: z.enum(['text', 'image', 'document', 'audio', 'video']),
  content: z.string(),
  mediaUrl: z.string().url().optional(),
  status: z.enum(['received', 'sent', 'delivered', 'read', 'failed']),
  direction: z.enum(['inbound', 'outbound']),
  timestamp: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const AnalyticsSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['dashboard', 'quotations', 'proposals', 'whatsapp', 'users']),
  metric: z.string(),
  value: z.number(),
  date: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
})

export const IntegrationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(['api', 'webhook', 'service']),
  status: z.enum(['active', 'inactive', 'error']).default('active'),
  config: z.record(z.any()),
  lastSync: z.string().datetime().optional(),
  errorCount: z.number().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const SystemLogSchema = z.object({
  id: z.string().uuid(),
  level: z.enum(['info', 'warn', 'error', 'debug']),
  service: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
  createdAt: z.string().datetime(),
})

// Tipos TypeScript derivados de los esquemas
export type User = z.infer<typeof UserSchema> & DynamoDBItem
export type Provider = z.infer<typeof ProviderSchema> & DynamoDBItem
export type Product = z.infer<typeof ProductSchema> & DynamoDBItem
export type Quotation = z.infer<typeof QuotationSchema> & DynamoDBItem
export type Proposal = z.infer<typeof ProposalSchema> & DynamoDBItem
export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema> & DynamoDBItem
export type Analytics = z.infer<typeof AnalyticsSchema> & DynamoDBItem
export type Integration = z.infer<typeof IntegrationSchema> & DynamoDBItem
export type SystemLog = z.infer<typeof SystemLogSchema> & DynamoDBItem

// Tipos para creación (sin campos auto-generados)
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateProvider = Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateQuotation = Omit<Quotation, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateProposal = Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateWhatsAppMessage = Omit<WhatsAppMessage, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateAnalytics = Omit<Analytics, 'id' | 'createdAt' | 'PK' | 'SK'>
export type CreateIntegration = Omit<Integration, 'id' | 'createdAt' | 'updatedAt' | 'PK' | 'SK'>
export type CreateSystemLog = Omit<SystemLog, 'id' | 'createdAt' | 'PK' | 'SK'>

// Tipos para actualización (campos opcionales)
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt' | 'PK' | 'SK'>>
export type UpdateProvider = Partial<Omit<Provider, 'id' | 'createdAt' | 'PK' | 'SK'>>
export type UpdateProduct = Partial<Omit<Product, 'id' | 'createdAt' | 'PK' | 'SK'>>
export type UpdateQuotation = Partial<Omit<Quotation, 'id' | 'createdAt' | 'PK' | 'SK'>>
export type UpdateProposal = Partial<Omit<Proposal, 'id' | 'createdAt' | 'PK' | 'SK'>>
export type UpdateWhatsAppMessage = Partial<Omit<WhatsAppMessage, 'id' | 'createdAt' | 'PK' | 'SK'>>
export type UpdateIntegration = Partial<Omit<Integration, 'id' | 'createdAt' | 'PK' | 'SK'>>
