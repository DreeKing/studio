
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Truck, UserCheck, Send, Package, MessageSquare } from "lucide-react";

const deliveries = [
  { id: "#D1001", orderId: "#10238", customer: "Lucas Martins", address: "Rua das Palmeiras, 123", courier: "Carlos Silva", status: "Em Rota" },
  { id: "#D1002", orderId: "#10234", customer: "João Silva", address: "Av. Central, 456, Apto 78", courier: null, status: "Aguardando Entregador" },
  { id: "#D1003", orderId: "#P7801", customer: "Fernanda Lima (iFood)", address: "Alameda dos Anjos, 789", courier: "Ana Beatriz", status: "Entregue" },
];

const couriers = ["Carlos Silva", "Ana Beatriz", "Roberto Alves", "Entregador iFood", "Entregador Zé Delivery"];

// Dummy data for incoming orders (moved from sales page)
const incomingOrders = [
  { id: "IF1001", source: "iFood", items: "1x Pizza Calabreza, 1x Refri 2L", status: "Novo", time: "2 min atrás" },
  { id: "ZD2005", source: "Zé Delivery", items: "6x Cerveja Lata", status: "Novo", time: "5 min atrás" },
  { id: "WA3012", source: "WhatsApp", items: "2x Temaki Salmão", status: "Confirmar", time: "8 min atrás" },
];

export default function DeliveryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Entregas</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Area - Placeholder */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Mapa de Entregas</CardTitle>
            <CardDescription>Visualização em tempo real das entregas (simulado).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md h-[400px] flex items-center justify-center">
              <MapPin className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Integração com Google Maps API aqui</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Distâncias e tempos de entrega serão calculados aqui.</p>
          </CardContent>
        </Card>

        {/* Delivery List & Assignment */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Pedidos para Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveries.filter(d => d.status !== "Entregue").map((delivery) => (
                <Card key={delivery.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{delivery.orderId} - {delivery.customer}</h3>
                      <p className="text-sm text-muted-foreground truncate w-52">{delivery.address}</p>
                    </div>
                    <Badge variant={delivery.status === "Em Rota" ? "default" : "outline"}
                          className={delivery.status === "Em Rota" ? "bg-blue-500 text-white" : ""}>
                      {delivery.status}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    {delivery.status === "Aguardando Entregador" ? (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Atribuir Entregador" />
                        </SelectTrigger>
                        <SelectContent>
                          {couriers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center text-sm">
                        <UserCheck className="h-4 w-4 mr-2 text-primary" />
                        <span>Entregador: {delivery.courier}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <Send className="mr-2 h-4 w-4" /> Enviar Notificação WhatsApp
                  </Button>
                </Card>
              ))}
              {deliveries.filter(d => d.status !== "Entregue").length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Nenhum pedido aguardando entrega.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Pedidos Recebidos</CardTitle>
              <CardDescription>iFood, Zé Delivery, WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="max-h-64">
              <ScrollArea className="h-full pr-2">
              {incomingOrders.length > 0 ? incomingOrders.map(order => (
                <div key={order.id} className="p-2 mb-2 border rounded-md hover:bg-secondary/50 transition-colors">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{order.id} ({order.source})</span>
                    <span className="text-xs text-muted-foreground">{order.time}</span>
                  </div>
                  <p className="text-xs truncate">{order.items}</p>
                  <div className="flex justify-end mt-1 items-center">
                    {order.source === "iFood" && <Package className="h-4 w-4 text-red-500" />}
                    {order.source === "Zé Delivery" && <Package className="h-4 w-4 text-yellow-500" />}
                    {order.source === "WhatsApp" && <MessageSquare className="h-4 w-4 text-green-500" />}
                    <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-primary">{order.status === "Novo" ? "Aceitar" : "Ver"}</Button>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">Nenhum pedido recebido pendente.</p>
              )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
