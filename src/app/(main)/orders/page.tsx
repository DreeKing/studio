
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, Filter, Search, Eye, Edit, MessageSquare, Plus, Minus, Trash2, Printer, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  source: string;
  itemsList: OrderItem[];
  total: number; // Will be dynamically calculated
  status: "Pendente" | "Em Preparo" | "Saiu para Entrega" | "Entregue" | "Cancelado";
  date: string;
}

const initialOrdersData: Order[] = [
  { id: "#10234", customer: "João Silva", source: "iFood", itemsList: [ {id: 'p1', name: 'Pizza Calabresa', quantity: 1, price: 40.50}, {id: 'b1', name: 'Coca-Cola 2L', quantity: 2, price: 10.00}], total: 0, status: "Em Preparo", date: "2024-07-28 10:30" },
  { id: "#10235", customer: "Maria Oliveira", source: "Balcão", itemsList: [{id: 's1', name: 'Sanduíche de Frango', quantity: 1, price: 25.00}], total: 0, status: "Entregue", date: "2024-07-28 10:25" },
  { id: "#10236", customer: "Carlos Pereira", source: "WhatsApp", itemsList: [{id: 'p2', name: 'Pizza Margherita', quantity: 2, price: 35.00}, {id: 'b2', name: 'Água Mineral', quantity: 3, price: 3.00}, {id: 'd1', name: 'Brownie', quantity: 2, price: 12.00}], total: 0, status: "Pendente", date: "2024-07-28 10:20" },
  { id: "#10237", customer: "Ana Costa", source: "Zé Delivery", itemsList: [{id: 'c1', name: 'Cerveja Lata', quantity: 6, price: 4.50}, {id: 'c2', name: 'Porção de Batata', quantity: 1, price: 18.80}], total: 0, status: "Cancelado", date: "2024-07-28 10:15" },
  { id: "#10238", customer: "Lucas Martins", source: "iFood", itemsList: [{id: 'p1', name: 'Pizza Calabresa', quantity: 1, price: 40.50}, {id: 'd1', name: 'Pudim', quantity: 1, price: 8.00}], total: 0, status: "Saiu para Entrega", date: "2024-07-28 10:10" },
];

const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export default function OrdersPage() {
  const { toast } = useToast();
  const [ordersList, setOrdersList] = useState<Order[]>(() => 
    initialOrdersData.map(order => ({
      ...order,
      total: calculateOrderTotal(order.itemsList) 
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("todos");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editableOrderItems, setEditableOrderItems] = useState<OrderItem[]>([]);

  const statusVariant = (status: Order["status"]) => {
    switch (status) {
      case "Pendente": return "outline";
      case "Em Preparo": return "default";
      case "Saiu para Entrega": return "secondary";
      case "Entregue": return "default"; 
      case "Cancelado": return "destructive";
      default: return "secondary";
    }
  };

  const handleOpenDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setEditableOrderItems(JSON.parse(JSON.stringify(order.itemsList))); // Deep copy
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
    setEditableOrderItems([]);
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setEditableOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) } // Ensure quantity doesn't go below 0
          : item
      ).filter(item => item.quantity > 0) // Optionally remove item if quantity is 0
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setEditableOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleSaveChangesToCart = () => {
    if (!selectedOrder) return;

    const updatedTotal = calculateOrderTotal(editableOrderItems);
    
    setOrdersList(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id
          ? { ...order, itemsList: [...editableOrderItems], total: updatedTotal }
          : order
      )
    );
    toast({
      title: "Pedido Atualizado!",
      description: `Itens do pedido ${selectedOrder.id} foram atualizados.`,
      className: "bg-green-500 text-white"
    });
    handleCloseDetailsModal();
  };

  const handlePrintCoupon = (order: Order | null) => {
    if (!order) return;
    console.log("--- CUPOM DO PEDIDO ---");
    console.log(`Pedido ID: ${order.id}`);
    console.log(`Cliente: ${order.customer}`);
    console.log(`Data: ${order.date}`);
    console.log("Itens:");
    order.itemsList.forEach(item => {
      console.log(`- ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)}) = R$ ${(item.quantity * item.price).toFixed(2)}`);
    });
    console.log(`Total: R$ ${order.total.toFixed(2)}`);
    console.log("-----------------------");
    toast({
      title: "Impressão Simulada",
      description: "O cupom do pedido foi impresso no console.",
    });
  };

  const filteredOrders = ordersList.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.source.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "pendente") return order.status === "Pendente" && matchesSearch;
    if (activeTab === "em-preparo") return order.status === "Em Preparo" && matchesSearch;
    if (activeTab === "em-entrega") return order.status === "Saiu para Entrega" && matchesSearch;
    if (activeTab === "finalizados") return (order.status === "Entregue" || order.status === "Cancelado") && matchesSearch;
    
    return matchesSearch; // Should not happen
  });

  const currentModalTotal = selectedOrder ? calculateOrderTotal(editableOrderItems) : 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Gerenciar Pedidos</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl">Lista de Pedidos</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar pedido (ID, cliente...)" 
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filtros <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por Origem</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => console.log("Filter Balcão")}>Balcão</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Filter iFood")}>iFood</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Filter Zé Delivery")}>Zé Delivery</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Filter WhatsApp")}>WhatsApp</DropdownMenuItem>
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("pendente")}>Pendente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("em-preparo")}>Em Preparo</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("em-entrega")}>Saiu para Entrega</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("finalizados")}>Entregue</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("finalizados")}>Cancelado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
           <Tabs defaultValue="todos" className="mt-4" onValueChange={setActiveTab} value={activeTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="em-preparo">Em Preparo</TabsTrigger>
              <TabsTrigger value="em-entrega">Em Entrega</TabsTrigger>
              <TabsTrigger value="finalizados">Finalizados</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.source}</TableCell>
                  <TableCell className="text-center">{order.itemsList.length}</TableCell>
                  <TableCell className="text-right">R$ {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusVariant(order.status)}
                      className={
                        order.status === 'Entregue' ? 'bg-green-500 text-white hover:bg-green-600' : 
                        order.status === 'Em Preparo' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 
                        order.status === 'Saiu para Entrega' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDetailsModal(order)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Atualizar Status</DropdownMenuItem>
                        {order.source === "WhatsApp" && <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Enviar Notificação</DropdownMenuItem>}
                        {order.status === "Pendente" && <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Cancelar Pedido</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                    Nenhum pedido encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View/Edit Order Details Modal */}
      {selectedOrder && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido: {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Cliente: {selectedOrder.customer} | Origem: {selectedOrder.source} | Data: {selectedOrder.date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Itens do Pedido
              </h3>
              {editableOrderItems.length > 0 ? (
                editableOrderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)} / un.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >=0) {
                                setEditableOrderItems(prev => prev.map(i => i.id === item.id ? {...i, quantity: newQuantity} : i));
                            }
                        }}
                        className="h-7 w-12 text-center px-1 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                      />
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="w-20 text-right font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum item neste pedido.</p>
              )}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold mb-2">
                <span>Subtotal:</span>
                <span>R$ {currentModalTotal.toFixed(2)}</span>
              </div>
              {/* Add discount/tax lines here if needed */}
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total do Pedido:</span>
                <span>R$ {currentModalTotal.toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter className="mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => handlePrintCoupon(selectedOrder)}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir Cupom
              </Button>
              <div className="flex-grow" /> {/* Spacer */}
              <Button variant="outline" onClick={handleCloseDetailsModal}>Fechar</Button>
              <Button onClick={handleSaveChangesToCart} disabled={editableOrderItems.length === 0 && selectedOrder.itemsList.length > 0}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    