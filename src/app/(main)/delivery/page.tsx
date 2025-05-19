
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Truck, UserCheck, Send, Package, MessageSquare, CheckCircle, RotateCcw, RefreshCw, DollarSign, CreditCard, ScanLine, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  courier: string | null;
  status: "Aguardando Entregador" | "Em Rota" | "Entregue" | "Cancelado";
  totalAmount: number;
  paymentType: "Dinheiro na Entrega" | "Cartão na Entrega" | "PIX na Entrega" | "Pagamento Online iFood" | "Pagamento Online Zé Delivery" | "Outro";
  paymentsReceived?: Array<{ method: string; amount: number }>;
}

interface CashRegisterState {
  isOpen: boolean;
  initialOpeningAmount: number | null;
  currentBalance: number | null;
  openingTimestamp: string | null;
}

interface DialogPartialPayment {
  method: string;
  amount: number;
}

// Sales History Entry for localStorage
interface SalesHistoryEntry {
  id: string;
  orderId: string;
  customer: string;
  source: "Balcão" | "iFood" | "Zé Delivery" | "WhatsApp" | "Outro";
  itemsDescription: string;
  total: number;
  status: "Concluído" | "Entregue" | "Cancelado";
  date: string;
}
const LOCAL_STORAGE_SALES_KEY = "salesHistory_v1";


const initialDeliveries: Delivery[] = [
  { id: "#D1001", orderId: "#10238", customer: "Lucas Martins", address: "Rua das Palmeiras, 123", courier: "Carlos Silva", status: "Em Rota", totalAmount: 50.50, paymentType: "Dinheiro na Entrega" },
  { id: "#D1002", orderId: "#10234", customer: "João Silva", address: "Av. Central, 456, Apto 78", courier: null, status: "Aguardando Entregador", totalAmount: 25.00, paymentType: "Cartão na Entrega" },
  { id: "#D1003", orderId: "#P7801", customer: "Fernanda Lima (iFood)", address: "Alameda dos Anjos, 789", courier: "Ana Beatriz", status: "Entregue", totalAmount: 35.00, paymentType: "Pagamento Online iFood" },
  { id: "#D1004", orderId: "#W9011", customer: "Roberto Carlos (WhatsApp)", address: "Rua Azul, 10", courier: null, status: "Cancelado", totalAmount: 15.00, paymentType: "PIX na Entrega" },
  { id: "#D1005", orderId: "#10239", customer: "Mariana Souza", address: "Rua das Flores, 222", courier: null, status: "Aguardando Entregador", totalAmount: 70.00, paymentType: "Dinheiro na Entrega" },
  { id: "#D1006", orderId: "#10240", customer: "Pedro Almeida", address: "Av. Brasil, 1000", courier: "Carlos Silva", status: "Em Rota", totalAmount: 88.20, paymentType: "Cartão na Entrega" },
  { id: "#D1007", orderId: "#Z9012", customer: "Joana Dark (Zé Delivery)", address: "Rua Amarela, 30", courier: "Roberto Alves", status: "Em Rota", totalAmount: 42.00, paymentType: "Pagamento Online Zé Delivery" },
];

const courierOptions = ["Carlos Silva", "Ana Beatriz", "Roberto Alves", "Entregador iFood", "Entregador Zé Delivery"];

const incomingOrders = [
  { id: "IF1001", source: "iFood", items: "1x Pizza Calabreza, 1x Refri 2L", status: "Novo", time: "2 min atrás" },
  { id: "ZD2005", source: "Zé Delivery", items: "6x Cerveja Lata", status: "Novo", time: "5 min atrás" },
  { id: "WA3012", source: "WhatsApp", items: "2x Temaki Salmão", status: "Confirmar", time: "8 min atrás" },
];

export default function DeliveryPage() {
  const { toast } = useToast();
  const [deliveryList, setDeliveryList] = useState<Delivery[]>(initialDeliveries);
  const [changingCourierForDeliveryId, setChangingCourierForDeliveryId] = useState<string | null>(null);

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedDeliveryForPayment, setSelectedDeliveryForPayment] = useState<Delivery | null>(null);
  
  const [dialogPartialPayments, setDialogPartialPayments] = useState<DialogPartialPayment[]>([]);
  const [dialogPaymentEntryAmountString, setDialogPaymentEntryAmountString] = useState("");

  const totalPaidInDialog = dialogPartialPayments.reduce((sum, p) => sum + p.amount, 0);
  const deliveryTotalAmount = selectedDeliveryForPayment?.totalAmount || 0;
  const dialogRemainingOrChange = deliveryTotalAmount - totalPaidInDialog;

  const logDeliveryToHistory = (delivery: Delivery, payments: DialogPartialPayment[]) => {
    let source: SalesHistoryEntry["source"] = "Outro";
    if (delivery.paymentType.toLowerCase().includes("ifood") || delivery.customer.toLowerCase().includes("ifood")) {
      source = "iFood";
    } else if (delivery.paymentType.toLowerCase().includes("zé delivery") || delivery.customer.toLowerCase().includes("zé") || delivery.customer.toLowerCase().includes("ze delivery")) {
      source = "Zé Delivery";
    } else if (delivery.customer.toLowerCase().includes("whatsapp")) {
      source = "WhatsApp";
    }

    const newHistoryEntry: SalesHistoryEntry = {
      id: `delivery-${delivery.id}-${Date.now()}`,
      orderId: delivery.orderId,
      customer: delivery.customer,
      source: source,
      itemsDescription: `Pedido ${delivery.orderId}`, // Simplified description
      total: delivery.totalAmount,
      status: "Entregue",
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const storedHistoryRaw = localStorage.getItem(LOCAL_STORAGE_SALES_KEY);
      const currentHistory: SalesHistoryEntry[] = storedHistoryRaw ? JSON.parse(storedHistoryRaw) : [];
      currentHistory.unshift(newHistoryEntry);
      localStorage.setItem(LOCAL_STORAGE_SALES_KEY, JSON.stringify(currentHistory));
    } catch (error) {
      console.error("Failed to log delivery to history in localStorage:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Registrar Histórico",
        description: "Não foi possível salvar a entrega no histórico local."
      });
    }
  };


  const handleAssignCourier = (deliveryId: string, courierName: string) => {
    setDeliveryList(prevList =>
      prevList.map(d =>
        d.id === deliveryId ? { ...d, courier: courierName, status: "Em Rota" } : d
      )
    );
    toast({
      title: "Entregador Atribuído!",
      description: `Pedido ${deliveryId} agora está em rota com ${courierName}.`,
      className: "bg-blue-500 text-white"
    });
  };

  const handleChangeCourier = (deliveryId: string, newCourierName: string) => {
    setDeliveryList(prevList =>
      prevList.map(d =>
        d.id === deliveryId ? { ...d, courier: newCourierName } : d
      )
    );
    toast({
      title: "Entregador Alterado!",
      description: `Pedido ${deliveryId} agora está com o entregador ${newCourierName}.`,
      className: "bg-blue-500 text-white"
    });
    setChangingCourierForDeliveryId(null);
  };

  const handleMarkAsDelivered = (deliveryId: string) => {
    const delivery = deliveryList.find(d => d.id === deliveryId);
    if (delivery) {
        setDeliveryList(prevList =>
          prevList.map(d => (d.id === deliveryId ? { ...d, status: "Entregue", paymentsReceived: [{method: delivery.paymentType, amount: delivery.totalAmount}] } : d))
        );
        logDeliveryToHistory(delivery, [{method: delivery.paymentType, amount: delivery.totalAmount}]);
        toast({
          title: "Pedido Entregue!",
          description: `Pedido ${deliveryId} foi marcado como entregue.`,
          className: "bg-green-500 text-white"
        });
    }
  };
  
  const handleReopenDelivery = (deliveryId: string) => {
    setDeliveryList(prevList =>
      prevList.map(d => (d.id === deliveryId ? { ...d, status: "Aguardando Entregador", courier: null, paymentsReceived: [] } : d))
    );
     toast({
      title: "Pedido Reaberto!",
      description: `Pedido ${deliveryId} foi reaberto e aguarda entregador.`,
    });
  }

  const handleOpenPaymentDialog = (delivery: Delivery) => {
    setSelectedDeliveryForPayment(delivery);
    setDialogPartialPayments([]);
    setDialogPaymentEntryAmountString("");
    setIsPaymentDialogOpen(true);
  };

  const handleAddDialogPaymentPart = (method: "Dinheiro" | "Cartão" | "PIX") => {
    const amount = parseFloat(dialogPaymentEntryAmountString);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: "destructive", title: "Valor Inválido", description: "Insira um valor positivo para adicionar ao pagamento." });
      return;
    }
    setDialogPartialPayments(prev => [...prev, { method, amount }]);
    setDialogPaymentEntryAmountString("");
    toast({ title: "Pagamento Adicionado", description: `${method} de R$ ${amount.toFixed(2)} adicionado à lista.`, className: "bg-blue-500 text-white" });
  };

  const handleRemoveDialogPaymentPart = (index: number) => {
    const paymentToRemove = dialogPartialPayments[index];
    setDialogPartialPayments(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Parte do Pagamento Removida", description: `${paymentToRemove.method} de R$ ${paymentToRemove.amount.toFixed(2)} removido.`, variant: "destructive"});
  };

  const handleConfirmPaymentAndDeliver = () => {
    if (!selectedDeliveryForPayment) return;

    if (totalPaidInDialog < selectedDeliveryForPayment.totalAmount) {
      toast({
        variant: "destructive",
        title: "Pagamento Insuficiente",
        description: `O valor total pago (R$ ${totalPaidInDialog.toFixed(2)}) é menor que o total do pedido (R$ ${selectedDeliveryForPayment.totalAmount.toFixed(2)}).`,
      });
      return;
    }

    let totalCashPaymentForRegister = 0;
    dialogPartialPayments.forEach(payment => {
        if (payment.method === "Dinheiro") {
            totalCashPaymentForRegister += payment.amount;
        }
    });
    
    if (totalCashPaymentForRegister > 0) {
      try {
        const storedState = localStorage.getItem('cashRegisterStatus_v2');
        if (storedState) {
          const parsedState: CashRegisterState = JSON.parse(storedState);
          if (parsedState.isOpen && parsedState.currentBalance !== null) {
            let cashContributionToOrderTotal = 0;
            let remainingOrderTotal = selectedDeliveryForPayment.totalAmount;
            
            for (const p of dialogPartialPayments) {
                if (remainingOrderTotal <= 0) break;
                if (p.method === "Dinheiro") {
                    const amountApplied = Math.min(p.amount, remainingOrderTotal);
                    cashContributionToOrderTotal += amountApplied;
                    remainingOrderTotal -= amountApplied;
                } else {
                     remainingOrderTotal -= Math.min(p.amount, remainingOrderTotal);
                }
            }
            
            if (cashContributionToOrderTotal > 0) {
                 parsedState.currentBalance += cashContributionToOrderTotal;
                 localStorage.setItem('cashRegisterStatus_v2', JSON.stringify(parsedState));
                toast({
                title: "Saldo do Caixa Atualizado",
                description: `Pagamento em dinheiro (R$ ${cashContributionToOrderTotal.toFixed(2)}) da entrega adicionado ao caixa.`,
                className: "bg-blue-500 text-white" 
                });
            }
          }
        }
      } catch (error) {
        console.error("Failed to update cash register balance:", error);
      }
    }
    
    const deliveryToUpdate = { ...selectedDeliveryForPayment, status: "Entregue" as Delivery["status"], paymentsReceived: [...dialogPartialPayments] };
    setDeliveryList(prevList =>
      prevList.map(d =>
        d.id === selectedDeliveryForPayment.id ? deliveryToUpdate : d
      )
    );
    logDeliveryToHistory(deliveryToUpdate, dialogPartialPayments);


    toast({
      title: "Pagamento Registrado e Entrega Confirmada!",
      description: `Pedido ${selectedDeliveryForPayment.orderId} pago (Total: R$ ${totalPaidInDialog.toFixed(2)}) e marcado como entregue.`,
      className: "bg-green-500 text-white"
    });
    setIsPaymentDialogOpen(false);
    setDialogPartialPayments([]);
    setDialogPaymentEntryAmountString("");
  };


  const getStatusBadgeVariant = (status: Delivery["status"]) => {
    switch (status) {
      case "Em Rota":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "Aguardando Entregador":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Entregue":
        return "bg-green-500 text-white hover:bg-green-600";
      case "Cancelado":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "outline";
    }
  };


  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Entregas</h1>
        <div className="grid lg:grid-cols-3 gap-6">
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

          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Pedidos para Entrega</CardTitle>
              </CardHeader>
              <CardContent className="p-0"> 
                <ScrollArea className="h-[350px] p-4 pr-6"> 
                  {deliveryList.filter(d => d.status !== "Cancelado").length > 0 ? 
                    deliveryList.filter(d => d.status !== "Cancelado").map((delivery) => (
                      <Card key={delivery.id} className="p-3 mb-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{delivery.orderId} - {delivery.customer}</h3>
                            <p className="text-sm text-muted-foreground truncate w-52">{delivery.address}</p>
                            <p className="text-xs text-primary font-medium">Total: R$ {delivery.totalAmount.toFixed(2)} ({delivery.paymentType})</p>
                          </div>
                          <Badge className={getStatusBadgeVariant(delivery.status)}>
                            {delivery.status}
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          {delivery.status === "Aguardando Entregador" && (
                            <Select onValueChange={(courierName) => handleAssignCourier(delivery.id, courierName)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Atribuir Entregador" />
                              </SelectTrigger>
                              <SelectContent>
                                {courierOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                          {delivery.status === "Em Rota" && (
                            <>
                              <div className="flex items-center text-sm">
                                <UserCheck className="h-4 w-4 mr-2 text-primary" />
                                <span>Entregador: {delivery.courier || "N/A"}</span>
                              </div>

                              {changingCourierForDeliveryId === delivery.id ? (
                                <Select onValueChange={(newCourierName) => handleChangeCourier(delivery.id, newCourierName)}>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Selecionar novo entregador" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {courierOptions
                                      .filter(c => c !== delivery.courier)
                                      .map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-2"
                                  onClick={() => setChangingCourierForDeliveryId(delivery.id)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" /> Alterar Entregador
                                </Button>
                              )}
                              
                              {delivery.paymentType.includes("Pagamento Online") ? (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="w-full bg-green-500 hover:bg-green-600 text-white mt-2"
                                  onClick={() => handleMarkAsDelivered(delivery.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" /> Confirmar Entrega
                                </Button>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
                                  onClick={() => handleOpenPaymentDialog(delivery)}
                                >
                                  <DollarSign className="mr-2 h-4 w-4" /> Registrar Pagamento e Entregar
                                </Button>
                              )}
                            </>
                          )}
                          {delivery.status === "Entregue" && (
                             <>
                              <div className="flex items-center text-sm">
                                  <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                                  <span>Entregador: {delivery.courier || "N/A"}</span>
                              </div>
                              {delivery.paymentsReceived && delivery.paymentsReceived.length > 0 && (
                                <ScrollArea className="max-h-20 text-xs text-muted-foreground border rounded-md p-1 mt-1">
                                  Pagamentos:
                                  {delivery.paymentsReceived.map((p, idx) => (
                                    <div key={idx}>- {p.method}: R$ {p.amount.toFixed(2)}</div>
                                  ))}
                                </ScrollArea>
                              )}
                              <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full mt-2"
                                  onClick={() => handleReopenDelivery(delivery.id)}
                              >
                                  <RotateCcw className="mr-2 h-4 w-4" /> Reabrir Entrega
                              </Button>
                             </>
                          )}
                        </div>
                        {delivery.status !== "Entregue" && delivery.status !== "Cancelado" && (
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            <Send className="mr-2 h-4 w-4" /> Enviar Notificação WhatsApp
                          </Button>
                        )}
                      </Card>
                    )) : (
                       <p className="text-muted-foreground text-center py-4">Nenhum pedido aguardando entrega.</p>
                    )
                  }
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Pedidos Recebidos</CardTitle>
                <CardDescription>iFood, Zé Delivery, WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="p-0"> 
                <ScrollArea className="h-[250px] p-4 pr-6"> 
                {incomingOrders.length > 0 ? incomingOrders.map(order => (
                  <div key={order.id} className="p-3 mb-2 border rounded-md hover:bg-secondary/50 transition-colors shadow-sm">
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

      {/* Payment Dialog */}
      {selectedDeliveryForPayment && (
        <Dialog open={isPaymentDialogOpen} onOpenChange={(isOpen) => {
          setIsPaymentDialogOpen(isOpen);
          if (!isOpen) {
            setDialogPartialPayments([]);
            setDialogPaymentEntryAmountString("");
          }
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Pagamento: Pedido {selectedDeliveryForPayment.orderId}</DialogTitle>
              <DialogDescription>
                Cliente: {selectedDeliveryForPayment.customer} <br />
                Total a Pagar: R$ {selectedDeliveryForPayment.totalAmount.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              
              {dialogPartialPayments.length > 0 && (
                <div className="space-y-2">
                  <Label className="font-semibold">Pagamentos Adicionados:</Label>
                  <ScrollArea className="h-24 border rounded-md p-2">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-8 px-2">Método</TableHead>
                          <TableHead className="h-8 px-2 text-right">Valor</TableHead>
                          <TableHead className="h-8 px-2 text-right">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dialogPartialPayments.map((p, index) => (
                          <TableRow key={index}>
                            <TableCell className="py-1 px-2">{p.method}</TableCell>
                            <TableCell className="py-1 px-2 text-right">R$ {p.amount.toFixed(2)}</TableCell>
                            <TableCell className="py-1 px-2 text-right">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive/80" onClick={() => handleRemoveDialogPaymentPart(index)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dialogPaymentEntryAmount">Valor a Adicionar ao Pagamento (R$)</Label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="dialogPaymentEntryAmount"
                    type="number"
                    placeholder="0.00"
                    value={dialogPaymentEntryAmountString}
                    onChange={(e) => setDialogPaymentEntryAmountString(e.target.value)}
                    className="pl-10 text-lg h-12 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    min="0.01" step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => handleAddDialogPaymentPart("Dinheiro")} disabled={!dialogPaymentEntryAmountString || parseFloat(dialogPaymentEntryAmountString) <= 0}><DollarSign className="mr-1 h-4 w-4"/>Dinheiro</Button>
                <Button onClick={() => handleAddDialogPaymentPart("Cartão")} disabled={!dialogPaymentEntryAmountString || parseFloat(dialogPaymentEntryAmountString) <= 0}><CreditCard className="mr-1 h-4 w-4"/>Cartão</Button>
                <Button onClick={() => handleAddDialogPaymentPart("PIX")} disabled={!dialogPaymentEntryAmountString || parseFloat(dialogPaymentEntryAmountString) <= 0}><ScanLine className="mr-1 h-4 w-4"/>PIX</Button>
              </div>
              
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                    <span>Total do Pedido:</span>
                    <span>R$ {deliveryTotalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Total Pago (nesta janela):</span>
                    <span>R$ {totalPaidInDialog.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-lg font-semibold ${dialogRemainingOrChange < 0 ? 'text-green-600' : dialogRemainingOrChange > 0 ? 'text-red-600' : 'text-foreground'}`}>
                    <span>{dialogRemainingOrChange < 0 ? "Troco a Dar:" : dialogRemainingOrChange > 0 ? "Restante a Pagar:" : "Status:"}</span>
                    <span>
                        {dialogRemainingOrChange === 0 ? "Pago Integralmente" : `R$ ${Math.abs(dialogRemainingOrChange).toFixed(2)}`}
                    </span>
                </div>
                 {dialogRemainingOrChange > 0 && (
                     <div className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> O valor pago é menor que o total do pedido.
                     </div>
                  )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button 
                type="button" 
                onClick={handleConfirmPaymentAndDeliver}
                disabled={totalPaidInDialog < deliveryTotalAmount || dialogPartialPayments.length === 0}
              >
                Confirmar Pagamento e Entregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
