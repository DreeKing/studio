
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Search, CreditCard, DollarSign, ScanLine, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

// Dummy data for products and categories
const categories = ["Pizzas", "Bebidas", "Sobremesas", "Combos", "Lanches"];
const products = [
  { id: "prod1", name: "Pizza Margherita", price: 30.00, category: "Pizzas", image: "https://placehold.co/100x100.png", "data-ai-hint": "pizza food" },
  { id: "prod2", name: "Coca-Cola 2L", price: 10.00, category: "Bebidas", image: "https://placehold.co/100x100.png", "data-ai-hint":"soda drink" },
  { id: "prod3", name: "Pudim", price: 8.00, category: "Sobremesas", image: "https://placehold.co/100x100.png", "data-ai-hint":"dessert food" },
  { id: "prod4", name: "X-Burger", price: 20.00, category: "Lanches", image: "https://placehold.co/100x100.png", "data-ai-hint":"burger food" },
  { id: "prod5", name: "Combo Família", price: 70.00, category: "Combos", image: "https://placehold.co/100x100.png", "data-ai-hint":"family meal" },
  { id: "prod6", name: "Água Mineral", price: 3.00, category: "Bebidas", image: "https://placehold.co/100x100.png", "data-ai-hint":"water bottle" },
  { id: "prod7", name: "Batata Frita M", price: 15.00, category: "Lanches", image: "https://placehold.co/100x100.png", "data-ai-hint":"french fries" },
];

interface OrderItem {
  id: string; // Product ID
  name: string;
  quantity: number;
  price: number; // Price per unit
}


export default function SalesPage() {
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();
  const [productSearchTerm, setProductSearchTerm] = useState("");

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
    toast({
        title: "Impressão Simulada",
        description: "O recibo foi impresso no console."
    });
  };

  const handleClearCart = () => {
    setCurrentOrderItems([]);
    toast({
        title: "Carrinho Limpo",
        description: "Todos os itens foram removidos do pedido.",
    });
  };

  const handleAddItemToOrder = (product: typeof products[0]) => {
    setCurrentOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
    });
     toast({
        title: "Item Adicionado!",
        description: `${product.name} foi adicionado ao pedido.`,
        className: "bg-green-500 text-white"
    });
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCurrentOrderItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[] // Filter out nulls (items with quantity 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = currentOrderItems.find(item => item.id === itemId);
    setCurrentOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (itemToRemove) {
        toast({
            title: "Item Removido",
            description: `${itemToRemove.name} foi removido do pedido.`,
            variant: "destructive",
        });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-var(--header-height,4rem)-2*1.5rem)] max-h-[calc(100vh-var(--header-height,4rem)-2*1.5rem)]">
      {/* Product Selection Area */}
      <Card className="flex-grow lg:w-3/5 shadow-xl flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Selecionar Produtos</CardTitle>
            <div className="relative w-full sm:w-1/2 md:w-1/3">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar produto..." 
                className="pl-8" 
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
              />
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
              {filteredProducts.map(product => (
                <Button 
                  key={product.id} 
                  variant="outline" 
                  className="h-auto p-3 flex flex-col items-center justify-center aspect-square shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary"
                  onClick={() => handleAddItemToOrder(product)}
                  aria-label={`Adicionar ${product.name} ao pedido`}
                >
                  <Image src={product.image} alt={product.name} width={60} height={60} className="rounded-md mb-2 object-cover" data-ai-hint={product['data-ai-hint']} />
                  <span className="text-xs text-center font-medium block truncate w-full">{product.name}</span>
                  <span className="text-xs text-primary font-semibold">R$ {product.price.toFixed(2)}</span>
                </Button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-10">Nenhum produto encontrado.</p>
              )}
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
                currentOrderItems.map((item) => (
                  <div key={item.id} className="flex items-center py-3 border-b last:border-b-0 gap-2">
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">R$ {item.price.toFixed(2)} /un.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, -1)} aria-label={`Diminuir quantidade de ${item.name}`}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, 1)} aria-label={`Aumentar quantidade de ${item.name}`}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-sm w-20 text-right">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleRemoveItem(item.id)} aria-label={`Remover ${item.name} do pedido`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">Nenhum item no pedido.</p>
              )}
            </ScrollArea>
          </CardContent>
          <CardHeader className="border-t">
            <div className="flex justify-between text-lg font-semibold mb-2">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {/* Placeholder for discounts or taxes if needed */}
            <div className="flex justify-between text-xl font-bold text-primary">
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
              variant="destructive" 
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
      </div>
    </div>
  );
}

