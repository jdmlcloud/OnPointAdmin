// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'ejecutivo' | 'cliente'
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Provider types
export interface Provider {
  id: string
  name: string
  description?: string
  logo?: string
  website?: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contacts: Contact[]
  rating: number
  performance: {
    deliveryTime: number // days
    qualityScore: number // 1-10
    reliabilityScore: number // 1-10
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  position: string
  email: string
  phone?: string
  isPrimary: boolean
}

// Product types
export interface Product {
  id: string
  providerId: string
  name: string
  description?: string
  category: string
  subcategory?: string
  images: string[]
  variants: ProductVariant[]
  pricing: PricingTier[]
  stock: {
    available: number
    reserved: number
    minimum: number
  }
  specifications?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  type: 'color' | 'size' | 'material' | 'finish'
  value: string
  image?: string
  additionalCost?: number
}

export interface PricingTier {
  minQuantity: number
  maxQuantity?: number
  price: number
  currency: string
  discount?: number
}

// Quotation types
export interface Quotation {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  items: QuotationItem[]
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  totalAmount: number
  currency: string
  validUntil: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface QuotationItem {
  productId: string
  productName: string
  variant?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  providerId: string
  providerName: string
}

// Proposal types
export interface Proposal {
  id: string
  quotationId: string
  title: string
  description?: string
  template: string
  content: ProposalContent
  mockups: Mockup[]
  pdfUrl?: string
  status: 'draft' | 'generated' | 'sent' | 'viewed'
  createdAt: string
  updatedAt: string
}

export interface ProposalContent {
  sections: ProposalSection[]
  branding: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    font: string
  }
}

export interface ProposalSection {
  id: string
  type: 'header' | 'text' | 'image' | 'table' | 'mockup' | 'footer'
  content: any
  order: number
}

export interface Mockup {
  id: string
  productId: string
  clientLogo?: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  rotation?: number
  opacity?: number
}

// WhatsApp types
export interface WhatsAppMessage {
  id: string
  messageId: string
  from: string
  to: string
  type: 'text' | 'image' | 'document' | 'audio' | 'video'
  content: string
  mediaUrl?: string
  timestamp: string
  status: 'received' | 'processed' | 'replied' | 'error'
  aiAnalysis?: AIAnalysis
  createdAt: string
  updatedAt: string
}

export interface AIAnalysis {
  extractedData: {
    products?: string[]
    quantities?: number[]
    colors?: string[]
    urgency?: 'low' | 'medium' | 'high'
    budget?: number
  }
  intent: 'quotation' | 'information' | 'complaint' | 'other'
  confidence: number
  suggestedResponse?: string
  clientInfo?: {
    name?: string
    company?: string
    preferences?: string[]
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
