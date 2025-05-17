
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Search, CreditCard, DollarSign, ScanLine, MessageSquare, Package, Trash2 } from "lucide-react";
import Image from "next/image";

// Dummy data for products and categories
const categories = ["Pizzas", "Bebidas", "Sobremesas", "Combos", "Lanches"];
const products = [
  { id: 1, name: "Pizza Margherita", price: 30.00, category: "Pizzas", image: "https://placehold.co/100x100.png", "data-ai-hint": "pizza food" },
  { id: 2, name: "Coca-Cola 2L", price: 10.00, category: "Bebidas", image: "https://placehold.co/100x100.png", "data-ai-hint":"soda drink" },
  { id: 3, name: "Pudim", price: 8.00, category: "Sobremesas", image: "https://placehold.co/100x100.png", "data-ai-hint":"dessert food" },
  { id: 4, name: "X-Burger", price: 20.00, category: "Lanches", image: "https://placehold.co/100x100.png", "data-ai-hint":"burger food" },
  { id: 5, name: "Combo Família", price: 70.00, category: "Combos", image: "https://placehold.co/100x100.png", "data-ai-hint":"family meal" },
];

// Dummy data for incoming orders
const incomingOrders = [
  { id: "IF1001", source: "iFood", items: "1x Pizza Calabreza, 1x Refri 2L", status: "Novo", time: "2 min atrás" },
  { id: "ZD2005", source: "Zé Delivery", items: "6x Cerveja Lata", status: "Novo", time: "5 min atrás" },
  { id: "WA3012", source: "WhatsApp", items: "2x Temaki Salmão", status: "Confirmar", time: "8 min atrás" },
];

const initialOrderItems = [
  { name: "Pizza Margherita", quantity: 1, price: 30.00 },
  { name: "Coca-Cola 2L", quantity: 2, price: 10.00 },
];


export default function SalesPage() {
  const [currentOrderItems, setCurrentOrderItems] = useState(initialOrderItems);

  const subtotal = currentOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Add discounts, taxes later

  const handlePrintReceipt = () => {
    console.log("--- Recibo ---");
    currentOrderItems.forEach(item => {
      console.log(`${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`);
    });
    console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);
    console.log("----------------");
    alert("Recibo impresso no console!");
  };

  const handleClearCart = () => {
    setCurrentOrderItems([]);
    // Optionally, add a toast notification here
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-var(--header-height,4rem)-2*1.5rem)] max-h-[calc(100vh-var(--header-height,4rem)-2*1.5rem)]">
      {/* Product Selection Area */}
      <Card className="flex-grow lg:w-3/5 shadow-xl flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Selecionar Produtos</CardTitle>
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar produto..." className="pl-8" />
            </div>
          </div>
          <Tabs defaultValue={categories[0]} className="mt-2">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
              {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <Button key={product.id} variant="outline" className="h-auto p-2 flex flex-col items-center justify-center aspect-square shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary">
                  <Image src={product.image} alt={product.name} width={60} height={60} className="rounded-md mb-2" data-ai-hint={product['data-ai-hint']} />
                  <span className="text-xs text-center font-medium block truncate w-full">{product.name}</span>
                  <span className="text-xs text-primary font-semibold">R$ {product.price.toFixed(2)}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Order & Payment Area */}
      <div className="lg:w-2/5 flex flex-col gap-6">
        <Card className="flex-1 shadow-xl flex flex-col">
          <CardHeader>
            <CardTitle>Pedido Atual</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              {currentOrderItems.length > 0 ? (
                currentOrderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">Nenhum item no pedido.</p>
              )}
            </ScrollArea>
          </CardContent>
          <CardHeader className="border-t">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white"><CreditCard className="mr-2"/> Cartão</Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white"><DollarSign className="mr-2"/> Dinheiro</Button>
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white col-span-2"><ScanLine className="mr-2"/> PIX</Button>
            </div>
            <Button size="lg" variant="outline" className="w-full mt-2" onClick={handlePrintReceipt}>Imprimir Recibo</Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={handleClearCart}
              disabled={currentOrderItems.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Limpar Carrinho
            </Button>
            <Button 
              size="lg" 
              className="w-full mt-2"
              disabled={currentOrderItems.length === 0}
            >
              Finalizar Pedido
            </Button>
          </CardHeader>
        </Card>

        <Card className="shadow-xl max-h-64 flex flex-col">
          <CardHeader>
            <CardTitle>Pedidos Recebidos</CardTitle>
            <CardDescription>iFood, Zé Delivery, WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
            {incomingOrders.map(order => (
              <div key={order.id} className="p-2 mb-2 border rounded-md hover:bg-secondary/50 transition-colors">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">{order.id} ({order.source})</span>
                  <span className="text-xs text-muted-foreground">{order.time}</span>
                </div>
                <p className="text-xs truncate">{order.items}</p>
                <div className="flex justify-end mt-1">
                   {order.source === "iFood" && <Package className="h-4 w-4 text-red-500" />}
                   {order.source === "Zé Delivery" && <Package className="h-4 w-4 text-yellow-500" />}
                   {order.source === "WhatsApp" && <MessageSquare className="h-4 w-4 text-green-500" />}
                  <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-primary">{order.status === "Novo" ? "Aceitar" : "Ver"}</Button>
                </div>
              </div>
            ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

