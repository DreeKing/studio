
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, DollarSign, ScanLine, Trash2, Plus, Minus, CheckCircle, Printer, CreditCard } from "lucide-react";
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

interface PartialPayment {
  method: string;
  amount: number;
}

interface ConfirmedSaleDetails {
  items: OrderItem[];
  subtotal: number;
  total: number;
  payments: PartialPayment[];
  totalPaid: number;
  change: number;
}

// Interface for cash register state from localStorage
interface CashRegisterState {
  isOpen: boolean;
  initialOpeningAmount: number | null;
  currentBalance: number | null;
  openingTimestamp: string | null;
}


export default function SalesPage() {
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [amountPaidString, setAmountPaidString] = useState("");
  const [partialPaymentsList, setPartialPaymentsList] = useState<PartialPayment[]>([]);

  const [isSaleConfirmationDialogOpen, setIsSaleConfirmationDialogOpen] = useState(false);
  const [confirmedSaleDetails, setConfirmedSaleDetails] = useState<ConfirmedSaleDetails | null>(null);

  const subtotal = currentOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderTotal = subtotal; // Add discounts, taxes later

  const totalPaidFromList = partialPaymentsList.reduce((sum, p) => sum + p.amount, 0);
  const displayRemainingOrChange = orderTotal - totalPaidFromList;


  const handlePrintReceipt = (saleDetails: ConfirmedSaleDetails | null) => {
    if (!saleDetails) {
        toast({
            variant: "destructive",
            title: "Erro ao Imprimir",
            description: "Detalhes da venda não encontrados."
        });
        return;
    }
    console.log("--- Recibo ---");
    console.log(`Data: ${new Date().toLocaleString()}`);
    console.log("Formas de Pagamento:");
    saleDetails.payments.forEach(p => {
      console.log(`- ${p.method}: R$ ${p.amount.toFixed(2)}`);
    });
    console.log("Itens:");
    saleDetails.items.forEach(item => {
      console.log(`${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`);
    });
    console.log(`Subtotal: R$ ${saleDetails.subtotal.toFixed(2)}`);
    console.log(`Total da Venda: R$ ${saleDetails.total.toFixed(2)}`);
    console.log(`Total Pago: R$ ${saleDetails.totalPaid.toFixed(2)}`);
    if (saleDetails.change > 0) {
      console.log(`Troco: R$ ${saleDetails.change.toFixed(2)}`);
    }
    console.log("----------------");
    toast({
        title: "Impressão Simulada",
        description: "O recibo foi impresso no console."
    });
  };

  const handleClearOrderAndPayments = () => {
    setCurrentOrderItems([]);
    setPartialPaymentsList([]);
    setAmountPaidString("");
    toast({
        title: "Pedido Limpo",
        description: "Todos os itens e pagamentos foram removidos.",
    });
  };

  const handleNewSale = () => {
    setIsSaleConfirmationDialogOpen(false);

    // Update cash register balance in localStorage
    if (confirmedSaleDetails) { 
      try {
        const storedState = localStorage.getItem('cashRegisterStatus_v2');
        if (storedState) {
          const parsedState: CashRegisterState = JSON.parse(storedState);
          if (parsedState.isOpen && parsedState.currentBalance !== null) {
            parsedState.currentBalance += confirmedSaleDetails.total; // Add sale total
            localStorage.setItem('cashRegisterStatus_v2', JSON.stringify(parsedState));
            toast({
              title: "Saldo do Caixa Atualizado",
              description: `Nova venda de R$ ${confirmedSaleDetails.total.toFixed(2)} registrada no caixa.`,
              className: "bg-blue-500 text-white" 
            });
          }
        }
      } catch (error) {
        console.error("Failed to update cash register balance in localStorage:", error);
        toast({
          variant: "destructive",
          title: "Erro ao Atualizar Caixa",
          description: "Não foi possível atualizar o saldo do caixa no localStorage."
        });
      }
    }
    
    setConfirmedSaleDetails(null); // Clear details after attempting update
    handleClearOrderAndPayments(); // Clear current order for the new sale
    
    toast({
        title: "Nova Venda",
        description: "Pronto para o próximo pedido!",
        className: "bg-green-500 text-white"
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

  const handleSetItemQuantity = (itemId: string, quantityValue: number | string) => {
    let newQuantity: number;

    if (typeof quantityValue === 'string') {
      if (quantityValue.trim() === "") { 
        newQuantity = 0; 
      } else {
        newQuantity = parseInt(quantityValue, 10);
      }
    } else {
      newQuantity = quantityValue;
    }
  
    if (isNaN(newQuantity)) { 
      return; 
    }
  
    if (newQuantity <= 0) {
      const itemExists = currentOrderItems.some(item => item.id === itemId);
      if (itemExists) {
          handleRemoveItem(itemId); 
      }
    } else {
      setCurrentOrderItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };


  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const handleAddPayment = (paymentMethod: string) => {
    const amount = parseFloat(amountPaidString);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Valor Inválido",
        description: "Por favor, insira um valor de pagamento válido.",
      });
      return;
    }
    setPartialPaymentsList(prev => [...prev, { method: paymentMethod, amount }]);
    setAmountPaidString("");
    toast({
      title: "Pagamento Adicionado",
      description: `${paymentMethod} de R$ ${amount.toFixed(2)} adicionado.`,
      className: "bg-blue-500 text-white",
    });
  };

  const handleRemovePartialPayment = (indexToRemove: number) => {
    const paymentToRemove = partialPaymentsList[indexToRemove];
    setPartialPaymentsList(prev => prev.filter((_, index) => index !== indexToRemove));
    toast({
        title: "Pagamento Removido",
        description: `${paymentToRemove.method} de R$ ${paymentToRemove.amount.toFixed(2)} foi removido.`,
        variant: "destructive",
    });
  };

  const handleFinalizeSale = () => {
    if (currentOrderItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrinho Vazio",
        description: "Adicione itens ao pedido antes de finalizar.",
      });
      return;
    }

    if (partialPaymentsList.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum Pagamento",
        description: "Adicione pelo menos uma forma de pagamento.",
      });
      return;
    }
    
    if (displayRemainingOrChange > 0) {
      toast({
        variant: "destructive",
        title: "Pagamento Insuficiente",
        description: `Ainda faltam R$ ${displayRemainingOrChange.toFixed(2)}. Verifique os pagamentos.`,
      });
      return;
    }

    const saleData: ConfirmedSaleDetails = {
      items: [...currentOrderItems],
      subtotal: subtotal,
      total: orderTotal,
      payments: [...partialPaymentsList],
      totalPaid: totalPaidFromList,
      change: displayRemainingOrChange < 0 ? Math.abs(displayRemainingOrChange) : 0,
    };
    setConfirmedSaleDetails(saleData);
    setIsSaleConfirmationDialogOpen(true);
  };


  return (
    <>
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
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleSetItemQuantity(item.id, item.quantity - 1)} aria-label={`Diminuir quantidade de ${item.name}`}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleSetItemQuantity(item.id, e.target.value)}
                          className="h-7 w-12 text-center px-1 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                          aria-label={`Quantidade de ${item.name}`}
                        />
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleSetItemQuantity(item.id, item.quantity + 1)} aria-label={`Aumentar quantidade de ${item.name}`}>
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
            
            <CardFooter className="border-t pt-4 flex flex-col gap-4"> 
              <div className="w-full space-y-1">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Total a Pagar:</span>
                  <span>R$ {orderTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {currentOrderItems.length > 0 && (
                <>
                  {partialPaymentsList.length > 0 && (
                    <div className="w-full space-y-2 py-2 border-y">
                       <Label className="text-base font-semibold">Pagamentos Realizados:</Label>
                       <Table className="text-xs">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="h-8 px-2">Método</TableHead>
                              <TableHead className="h-8 px-2 text-right">Valor</TableHead>
                              <TableHead className="h-8 px-2 text-right">Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {partialPaymentsList.map((p, index) => (
                              <TableRow key={index}>
                                <TableCell className="py-1 px-2">{p.method}</TableCell>
                                <TableCell className="py-1 px-2 text-right">R$ {p.amount.toFixed(2)}</TableCell>
                                <TableCell className="py-1 px-2 text-right">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive/80" onClick={() => handleRemovePartialPayment(index)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    </div>
                  )}

                  <div className="w-full space-y-2">
                    <Label htmlFor="amountPaid" className="text-base font-semibold">Adicionar Pagamento (R$)</Label>
                    <div className="relative flex items-center">
                      <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="amountPaid"
                        type="number"
                        placeholder="0.00"
                        value={amountPaidString}
                        onChange={(e) => setAmountPaidString(e.target.value)}
                        className="pl-10 text-lg h-12 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        step="0.01"
                        disabled={currentOrderItems.length === 0}
                      />
                    </div>
                  </div>

                  <div className={`w-full flex justify-between text-lg font-semibold ${displayRemainingOrChange < 0 ? 'text-green-600' : displayRemainingOrChange > 0 ? 'text-red-600' : 'text-foreground'}`}>
                    <span>{displayRemainingOrChange < 0 ? "Troco:" : "Restante:"}</span>
                    <span>R$ {Math.abs(displayRemainingOrChange).toFixed(2)}</span>
                  </div>
                  
                  <div className="w-full grid grid-cols-3 gap-2">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAddPayment("Cartão")} disabled={currentOrderItems.length === 0 || parseFloat(amountPaidString) <=0 || isNaN(parseFloat(amountPaidString))}><CreditCard className="mr-2"/> Cartão</Button>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAddPayment("Dinheiro")} disabled={currentOrderItems.length === 0 || parseFloat(amountPaidString) <=0 || isNaN(parseFloat(amountPaidString))}><DollarSign className="mr-2"/> Dinheiro</Button>
                    <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white" onClick={() => handleAddPayment("PIX")} disabled={currentOrderItems.length === 0 || parseFloat(amountPaidString) <=0 || isNaN(parseFloat(amountPaidString))}><ScanLine className="mr-2"/> PIX</Button>
                  </div>
                </>
              )}

              <div className="w-full flex flex-col gap-2 mt-2">
                <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleFinalizeSale} 
                    disabled={currentOrderItems.length === 0 || displayRemainingOrChange > 0 || partialPaymentsList.length === 0}
                >
                    <CheckCircle className="mr-2 h-5 w-5"/> Finalizar Venda
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleClearOrderAndPayments}
                  disabled={currentOrderItems.length === 0 && partialPaymentsList.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Limpar Pedido e Pagamentos
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Sale Confirmation Dialog */}
      {confirmedSaleDetails && (
        <Dialog open={isSaleConfirmationDialogOpen} onOpenChange={setIsSaleConfirmationDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Venda Concluída!
              </DialogTitle>
              <DialogDescription>
                A venda foi registrada com sucesso.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <p className="text-sm"><strong>Total da Venda:</strong> R$ {confirmedSaleDetails.total.toFixed(2)}</p>
              <p className="text-sm"><strong>Total Pago:</strong> R$ {confirmedSaleDetails.totalPaid.toFixed(2)}</p>
              {confirmedSaleDetails.change > 0 && (
                <p className="text-sm font-semibold text-green-600"><strong>Troco:</strong> R$ {confirmedSaleDetails.change.toFixed(2)}</p>
              )}
              <div className="pt-2">
                <h4 className="font-medium text-sm mb-1">Pagamentos:</h4>
                 <ScrollArea className="h-20 border rounded-md p-2">
                    <ul className="text-xs list-disc list-inside">
                        {confirmedSaleDetails.payments.map((p, index) => (
                            <li key={index}>{p.method}: R$ {p.amount.toFixed(2)}</li>
                        ))}
                    </ul>
                </ScrollArea>
              </div>
              <div className="pt-2">
                <h4 className="font-medium text-sm mb-1">Itens:</h4>
                <ScrollArea className="h-24 border rounded-md p-2">
                    <ul className="text-xs list-disc list-inside">
                        {confirmedSaleDetails.items.map(item => (
                            <li key={item.id}>{item.quantity}x {item.name}</li>
                        ))}
                    </ul>
                </ScrollArea>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => handlePrintReceipt(confirmedSaleDetails)}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir Recibo
              </Button>
              <Button onClick={handleNewSale}>Nova Venda</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

