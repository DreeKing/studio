"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, KeyRound, Clock, Wifi, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  // Placeholder state for API test results
  const [ifoodStatus, setIfoodStatus] = useState<"untested" | "testing" | "ok" | "error">("untested");
  const [whatsappStatus, setWhatsappStatus] = useState<"untested" | "testing" | "ok" | "error">("untested");

  const testApiConnection = (api: "ifood" | "whatsapp") => {
    if (api === "ifood") setIfoodStatus("testing");
    if (api === "whatsapp") setWhatsappStatus("testing");

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // Simulate success/failure
      if (api === "ifood") setIfoodStatus(success ? "ok" : "error");
      if (api === "whatsapp") setWhatsappStatus(success ? "ok" : "error");
    }, 1500);
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="operation">Operação</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Informações básicas do estabelecimento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input id="storeName" defaultValue="Minha Loja de Pizzas" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Endereço</Label>
                  <Input id="storeAddress" defaultValue="Rua Fictícia, 123 - Bairro Exemplo" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="storePhone">Telefone Principal</Label>
                <Input id="storePhone" defaultValue="(00) 12345-6789" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Integrações com Plataformas</CardTitle>
              <CardDescription>Configure suas chaves de API e conexões.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* iFood */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Globe className="w-5 h-5 mr-2 text-red-500"/>iFood</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ifoodToken">Token API iFood</Label>
                    <Input id="ifoodToken" type="password" placeholder="Cole seu token aqui" className="mt-1" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => testApiConnection("ifood")} disabled={ifoodStatus === "testing"}>
                      <Wifi className="mr-2 h-4 w-4" /> {ifoodStatus === "testing" ? "Testando..." : "Testar Conexão"}
                    </Button>
                    {ifoodStatus === "ok" && <span className="flex items-center text-sm text-green-600"><CheckCircle className="w-4 h-4 mr-1"/>Conectado</span>}
                    {ifoodStatus === "error" && <span className="flex items-center text-sm text-destructive"><AlertTriangle className="w-4 h-4 mr-1"/>Falha na conexão</span>}
                  </div>
                </div>
              </div>
              <hr/>
              {/* Zé Delivery */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Globe className="w-5 h-5 mr-2 text-yellow-500"/>Zé Delivery (Simulado)</h3>
                 <div className="space-y-3">
                  <div>
                    <Label htmlFor="zeToken">Token API Zé Delivery</Label>
                    <Input id="zeToken" type="password" placeholder="Chave API simulada" className="mt-1" />
                  </div>
                   <p className="text-xs text-muted-foreground">Esta é uma simulação. A API do Zé Delivery possui acesso restrito.</p>
                </div>
              </div>
              <hr/>
              {/* WhatsApp */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><KeyRound className="w-5 h-5 mr-2 text-green-500"/>WhatsApp Business API</h3>
                 <div className="space-y-3">
                  <div>
                    <Label htmlFor="whatsappToken">Token API WhatsApp</Label>
                    <Input id="whatsappToken" type="password" placeholder="Meta / Twilio Token" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumberId">ID do Número de Telefone</Label>
                    <Input id="whatsappNumberId" placeholder="ID do número" className="mt-1" />
                  </div>
                   <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => testApiConnection("whatsapp")} disabled={whatsappStatus === "testing"}>
                      <Wifi className="mr-2 h-4 w-4" /> {whatsappStatus === "testing" ? "Testando..." : "Testar Conexão"}
                    </Button>
                    {whatsappStatus === "ok" && <span className="flex items-center text-sm text-green-600"><CheckCircle className="w-4 h-4 mr-1"/>Conectado</span>}
                    {whatsappStatus === "error" && <span className="flex items-center text-sm text-destructive"><AlertTriangle className="w-4 h-4 mr-1"/>Falha na conexão</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operation" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Configurações de Operação</CardTitle>
              <CardDescription>Horários, taxas e outras definições operacionais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="workingHours" className="text-base font-medium">Horário de Funcionamento</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div><Input id="openTime" type="time" defaultValue="08:00" /> <Label htmlFor="openTime" className="text-xs text-muted-foreground">Abertura</Label></div>
                  <div><Input id="closeTime" type="time" defaultValue="23:00" /> <Label htmlFor="closeTime" className="text-xs text-muted-foreground">Fechamento</Label></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="deliveryFee">Taxa de Entrega Padrão (R$)</Label>
                  <Input id="deliveryFee" type="number" defaultValue="5.00" className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="minOrderValue">Valor Mínimo do Pedido para Entrega (R$)</Label>
                  <Input id="minOrderValue" type="number" defaultValue="20.00" className="mt-1" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="autoAcceptOrders" />
                <Label htmlFor="autoAcceptOrders">Aceitar pedidos do iFood/Zé Delivery automaticamente</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Adicione, edite ou remova usuários do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade de gerenciamento de usuários e permissões será implementada aqui.</p>
              {/* Placeholder for user table and actions */}
            </CardContent>
          </Card>
        </TabsContent>
        <div className="mt-8 flex justify-end">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">Salvar Todas as Configurações</Button>
        </div>
      </Tabs>
    </div>
  );
}
