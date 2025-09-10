// ========================================
// ATOMIC DESIGN - COMPONENTES BASE
// ========================================

// ÁTOMOS - Componentes básicos
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card"
export { CardImage, type CardImageType } from "../ui/card-image"
export { Button } from "../ui/button"
export { Badge } from "../ui/badge"
export { Input } from "../ui/input"
export { Label } from "../ui/label"
export { Textarea } from "../ui/textarea"
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
export { Checkbox } from "../ui/checkbox"
export { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

// MOLÉCULAS - Componentes compuestos
export { CardItem, type CardItemProps } from "../ui/card-item"

// ORGANISMOS - Componentes complejos con variantes
export { ProviderCard, type ProviderCardProps, ProviderCardSkeleton } from "./organisms/card-variants/provider-card"
export { ProductCard, type ProductCardProps, ProductCardSkeleton } from "./organisms/card-variants/product-card"
export { UserCard, type UserCardProps } from "./organisms/card-variants/user-card"
export { LogoCard, type LogoCardProps, LogoCardSkeleton } from "./organisms/card-variants/logo-card"
export { ClientCard, type ClientCardProps, ClientCardSkeleton } from "./organisms/card-variants/client-card"

// ========================================
// ESTRUCTURA ATOMIC DESIGN
// ========================================
// 
// ÁTOMOS (Atoms):
// - Card, Button, Badge, Input, Label, etc.
// - Componentes básicos sin lógica de negocio
//
// MOLÉCULAS (Molecules):
// - CardItem, FormField, SearchInput, etc.
// - Combinación de átomos con lógica básica
//
// ORGANISMOS (Organisms):
// - ProviderCard, ProductCard, UserCard
// - Componentes complejos con variantes específicas
//
// PLANTILLAS (Templates):
// - PageLayout, DashboardLayout, etc.
// - Estructura de páginas completas
//
// PÁGINAS (Pages):
// - ProvidersPage, ProductsPage, etc.
// - Páginas específicas con datos reales
// ========================================
