"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { 
  Bot, 
  MessageSquare, 
  FileText, 
  Settings,
  Play,
  CheckCircle,
  XCircle,
  Loader,
  Zap,
  Brain,
  Sparkles
} from "lucide-react"

export default function AITestPage() {
  const { simulateAction } = useMicrointeractions()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})
  const [currentProvider, setCurrentProvider] = useState<string>('')

  // Estados para diferentes tipos de pruebas
  const [textPrompt, setTextPrompt] = useState('')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [quotationData, setQuotationData] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    requirements: ''
  })

  const testAIService = async (type: string, data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      })

      const result = await response.json()
      
      if (result.success) {
        setResults((prev: any) => ({ ...prev, [type]: result }))
        setCurrentProvider(result.provider)
        // Simulación de microinteracción exitosa
      } else {
        // Simulación de microinteracción de error
      }
    } catch (error) {
      // Simulación de microinteracción de error de conexión
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (type: string) => {
    if (loading) return <Loader className="h14 w-4 animate-spin" />
    if (results[type]) return <CheckCircle className="h14 w-4 text-green-500" />
    return <XCircle className="h14 w-4 text-gray-500" />
  }

  const getProviderBadge = (provider: string) => {
    const colors = {
      'AWS Bedrock': 'bg-orange-500',
      'OpenAI': 'bg-green-500',
      'Anthropic': 'bg-purple-500'
    }
    return (
      <Badge className={colors[provider as keyof typeof colors] || 'bg-gray-500'}>
        {provider}
      </Badge>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h14 w-4 text-blue-500" />
              Testing de Servicios de IA
            </h1>
            <p className="text-muted-foreground">
              Prueba la nueva arquitectura de IA con AWS Bedrock como base y fallback automático
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentProvider && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Proveedor actual:</span>
                {getProviderBadge(currentProvider)}
              </div>
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h14 w-4 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">AWS Bedrock</p>
                  <p className="text-sm text-muted-foreground">Proveedor Principal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h14 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">OpenAI</p>
                  <p className="text-sm text-muted-foreground">Fallback 1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h14 w-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">Anthropic</p>
                  <p className="text-sm text-muted-foreground">Fallback 1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList>
            <TabsTrigger value="text">Generación de Texto</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp AI</TabsTrigger>
            <TabsTrigger value="quotation">Cotizaciones IA</TabsTrigger>
          </TabsList>

          {/* Text Generation Tab */}
          <TabsContent value="text" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h14 w-4" />
                  Generación de Texto
                </CardTitle>
                <CardDescription>
                  Prueba la generación de texto con diferentes proveedores de IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <Label htmlFor="text-prompt">Prompt de prueba</Label>
                  <Textarea
                    id="text-prompt"
                    placeholder="Escribe un prompt para probar la generación de texto..."
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    onClick={() => testAIService('text', { prompt: textPrompt })}
                    disabled={loading || !textPrompt}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Play className="h1- w-- mr-2" />
                    Probar Generación
                  </AnimatedButton>
                  {getStatusIcon('text')}
                </div>
                {results.text && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h1 className="font-semibold mb-2">Resultado:</h1>
                    <p className="text-sm">{results.text.result}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp AI Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h14 w-4" />
                  Análisis de Mensajes WhatsApp
                </CardTitle>
                <CardDescription>
                  Prueba el análisis inteligente de mensajes de WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <Label htmlFor="whatsapp-message">Mensaje de WhatsApp</Label>
                  <Textarea
                    id="whatsapp-message"
                    placeholder="Hola, me interesa automatizar las ventas de mi empresa..."
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    onClick={() => testAIService('whatsapp', { content: whatsappMessage })}
                    disabled={loading || !whatsappMessage}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Play className="h1- w-- mr-2" />
                    Analizar Mensaje
                  </AnimatedButton>
                  {getStatusIcon('whatsapp')}
                </div>
                {results.whatsapp && (
                  <div className="mt-4 space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h1 className="font-semibold mb-2">Respuesta:</h1>
                      <p className="text-sm">{results.whatsapp.result.response}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="p-4 bg-muted rounded-lg">
                        <h1 className="font-semibold mb-2">Intención:</h1>
                        <Badge variant="outline">{results.whatsapp.result.intent}</Badge>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h1 className="font-semibold mb-2">Confianza:</h1>
                        <Badge variant="outline">{(results.whatsapp.result.confidence * 100).toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h1 className="font-semibold mb-2">Acciones Sugeridas:</h1>
                      <ul className="text-sm list-disc list-inside">
                        {results.whatsapp.result.suggestedActions.map((action: string, index: number) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotation AI Tab */}
          <TabsContent value="quotation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h14 w-4" />
                  Generación de Cotizaciones
                </CardTitle>
                <CardDescription>
                  Prueba la generación inteligente de cotizaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-6">
                    <Label htmlFor="client-name">Nombre del Cliente</Label>
                    <Input
                      id="client-name"
                      placeholder="Juan Pérez"
                      value={quotationData.clientName}
                      onChange={(e) => setQuotationData(prev => ({ ...prev, clientName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-6">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      placeholder="juan@empresa.com"
                      value={quotationData.clientEmail}
                      onChange={(e) => setQuotationData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <Label htmlFor="client-company">Empresa</Label>
                  <Input
                    id="client-company"
                    placeholder="Empresa ABC"
                    value={quotationData.clientCompany}
                    onChange={(e) => setQuotationData(prev => ({ ...prev, clientCompany: e.target.value }))}
                  />
                </div>
                <div className="space-y-6">
                  <Label htmlFor="requirements">Requerimientos</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Necesito automatizar las ventas de mi empresa, integrar WhatsApp Business y generar cotizaciones automáticas..."
                    value={quotationData.requirements}
                    onChange={(e) => setQuotationData(prev => ({ ...prev, requirements: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    onClick={() => testAIService('quotation', quotationData)}
                    disabled={loading || !quotationData.clientName || !quotationData.requirements}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Play className="h1- w-- mr-2" />
                    Generar Cotización
                  </AnimatedButton>
                  {getStatusIcon('quotation')}
                </div>
                {results.quotation && (
                  <div className="mt-4 space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h1 className="font-semibold mb-2">Título:</h1>
                      <p className="text-sm">{results.quotation.result.title}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h1 className="font-semibold mb-2">Descripción:</h1>
                      <p className="text-sm">{results.quotation.result.description}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h1 className="font-semibold mb-2">Total:</h1>
                      <p className="text-lg font-bold">${results.quotation.result.total}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h1 className="font-semibold mb-2">Productos/Servicios:</h1>
                      <ul className="text-sm space-y-6">
                        {results.quotation.result.products.map((product: any, index: number) => (
                          <li key={index} className="flex justify-between">
                            <span>{product.name}</span>
                            <span>${product.total}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
