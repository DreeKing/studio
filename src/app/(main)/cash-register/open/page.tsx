
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, DollarSign, ClipboardCheck, ArchiveX, ShoppingCart, AlertCircle, ArrowDownCircle, ArrowUpCircle, Loader2, Printer, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashRegisterState {
  isOpen: boolean;
  initialOpeningAmount: number | null;
  currentBalance: number | null;
  openingTimestamp: string | null;
}

const LOCAL_STORAGE_KEY = 'cashRegisterStatus_v2';

type SangriaType = "Vale" | "Compra" | "Pagamento";

interface ClosingDifferenceDetails {
  amount: number;
  status: "Falta no Caixa" | "Sobra no Caixa" | "Valores Conferem";
  message: string;
}

interface ClosingSummaryData {
  openingTimestamp: string | null;
  closingTimestamp: string;
  initialOpeningAmount: number | null;
  paymentsCard: string; // Placeholder
  paymentsCash: string; // Placeholder
  paymentsPix: string; // Placeholder
  paymentsZeOnline: string; // Placeholder
  paymentsIfoodOnline: string; // Placeholder
  totalReforco: string; // Placeholder for aggregate
  totalSangria: string; // Placeholder for aggregate
  discounts: string; // Placeholder
  deliveryFees: string; // Placeholder
  expectedSystemBalance: number | null;
  countedPhysicalBalance: number;
  differenceAmount: number;
  differenceStatus: string;
}


export default function CashRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formInitialAmount, setFormInitialAmount] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [registerState, setRegisterState] = useState<CashRegisterState>({
    isOpen: false,
    initialOpeningAmount: null,
    currentBalance: null,
    openingTimestamp: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sangria state
  const [isSangriaDialogOpen, setIsSangriaDialogOpen] = useState(false);
  const [sangriaAmount, setSangriaAmount] = useState("");
  const [sangriaDescription, setSangriaDescription] = useState("");
  const [sangriaType, setSangriaType] = useState<SangriaType>("Pagamento");

  // Reforço state
  const [isReforcoDialogOpen, setIsReforcoDialogOpen] = useState(false);
  const [reforcoAmount, setReforcoAmount] = useState("");
  const [reforcoDescription, setReforcoDescription] = useState("");

  // Closing Register Dialog States
  const [isClosingDialogPhysicalAmountOpen, setIsClosingDialogPhysicalAmountOpen] = useState(false);
  const [isClosingDialogConfirmDifferenceOpen, setIsClosingDialogConfirmDifferenceOpen] = useState(false);
  const [isPrintClosingNoteDialogOpen, setIsPrintClosingNoteDialogOpen] = useState(false);
  const [physicalAmountString, setPhysicalAmountString] = useState("");
  const [closingDifferenceDetails, setClosingDifferenceDetails] = useState<ClosingDifferenceDetails | null>(null);
  const [closingSummaryData, setClosingSummaryData] = useState<ClosingSummaryData | null>(null);


  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (parsedState.isOpen && parsedState.currentBalance === undefined && parsedState.initialOpeningAmount !== undefined) {
          parsedState.currentBalance = parsedState.initialOpeningAmount;
        } else if (parsedState.isOpen && parsedState.openedAmount !== undefined && parsedState.initialOpeningAmount === undefined) {
            parsedState.initialOpeningAmount = parsedState.openedAmount;
            parsedState.currentBalance = parsedState.openedAmount;
            delete parsedState.openedAmount;
        }
        setRegisterState(parsedState);
      }
    } catch (error) {
      console.error("Failed to parse cash register state from localStorage:", error);
    }
    
    const now = new Date();
    setCurrentDateTime(now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registerState));
        } catch (error) {
            console.error("Failed to save cash register state to localStorage:", error);
        }
    }
  }, [registerState, isLoaded]);

  const handleOpenRegister = () => {
    const amount = parseFloat(formInitialAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        variant: "destructive",
        title: "Erro ao Abrir Caixa",
        description: "Por favor, insira um valor inicial válido.",
      });
      return;
    }

    const newOpeningTimestamp = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    setRegisterState({
      isOpen: true,
      initialOpeningAmount: amount,
      currentBalance: amount,
      openingTimestamp: newOpeningTimestamp,
    });
    setFormInitialAmount(""); 
    toast({
      title: "Caixa Aberto com Sucesso!",
      description: `Valor inicial: R$ ${amount.toFixed(2)}. Horário: ${newOpeningTimestamp}`,
      className: "bg-green-500 text-white"
    });
  };

  const handleInitiateCloseRegister = () => {
    setPhysicalAmountString("");
    setClosingDifferenceDetails(null);
    setIsClosingDialogPhysicalAmountOpen(true);
  };

  const handleProceedToConfirmDifference = (e: FormEvent) => {
    e.preventDefault();
    const countedAmount = parseFloat(physicalAmountString);
    if (isNaN(countedAmount) || countedAmount < 0) {
      toast({ variant: "destructive", title: "Valor Inválido", description: "Por favor, insira um valor contado válido." });
      return;
    }

    const systemBalance = registerState.currentBalance || 0;
    const difference = countedAmount - systemBalance;
    let status: ClosingDifferenceDetails["status"];
    let message: string;

    if (difference < 0) {
      status = "Falta no Caixa";
      message = `Detectada uma ${status.toLowerCase()} de R$ ${Math.abs(difference).toFixed(2)}. Deseja fechar o caixa assim mesmo?`;
    } else if (difference > 0) {
      status = "Sobra no Caixa";
      message = `Detectada uma ${status.toLowerCase()} de R$ ${difference.toFixed(2)}. Deseja fechar o caixa assim mesmo?`;
    } else {
      status = "Valores Conferem";
      message = "Os valores conferem. Deseja fechar o caixa?";
    }
    setClosingDifferenceDetails({ amount: difference, status, message });
    setIsClosingDialogPhysicalAmountOpen(false);
    setIsClosingDialogConfirmDifferenceOpen(true);
  };

  const handleFinalizeAndPreparePrint = () => {
    if (!registerState.isOpen || closingDifferenceDetails === null) return;

    const closingTime = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const physicalAmount = parseFloat(physicalAmountString);

    // Prepare data for closing note (many are placeholders due to current tracking)
    const summary: ClosingSummaryData = {
      openingTimestamp: registerState.openingTimestamp,
      closingTimestamp: closingTime,
      initialOpeningAmount: registerState.initialOpeningAmount,
      paymentsCard: "Não rastreado nesta versão",
      paymentsCash: "Não rastreado nesta versão",
      paymentsPix: "Não rastreado nesta versão",
      paymentsZeOnline: "Não rastreado nesta versão",
      paymentsIfoodOnline: "Não rastreado nesta versão",
      totalReforco: "Agregado no saldo (detalhes não disponíveis)",
      totalSangria: "Agregado no saldo (detalhes não disponíveis)",
      discounts: "Não rastreado",
      deliveryFees: "Não rastreado",
      expectedSystemBalance: registerState.currentBalance,
      countedPhysicalBalance: physicalAmount,
      differenceAmount: closingDifferenceDetails.amount,
      differenceStatus: closingDifferenceDetails.status,
    };
    setClosingSummaryData(summary);

    // Actual closing of the register
    setRegisterState({
      isOpen: false,
      initialOpeningAmount: null,
      currentBalance: null,
      openingTimestamp: null,
    });

    toast({
      title: "Caixa Fechado com Sucesso!",
      description: `Saldo final contado: R$ ${physicalAmount.toFixed(2)}. ${closingDifferenceDetails.status}: R$ ${Math.abs(closingDifferenceDetails.amount).toFixed(2)}.`,
    });
    
    setIsClosingDialogConfirmDifferenceOpen(false);
    setIsPrintClosingNoteDialogOpen(true);
  };
  
  const handlePrintClosingNote = (printMethod: "pdf" | "printer") => {
    if (!closingSummaryData) return;
    
    console.log(`--- INÍCIO DO FECHAMENTO DE CAIXA (${printMethod.toUpperCase()}) ---`);
    console.log(`Data/Hora Abertura: ${closingSummaryData.openingTimestamp}`);
    console.log(`Data/Hora Fechamento: ${closingSummaryData.closingTimestamp}`);
    console.log(`Valor de Abertura: R$ ${closingSummaryData.initialOpeningAmount?.toFixed(2) || '0.00'}`);
    console.log("--- Detalhes de Pagamentos (Simulado) ---");
    console.log(`Cartão: ${closingSummaryData.paymentsCard}`);
    console.log(`Dinheiro: ${closingSummaryData.paymentsCash}`);
    console.log(`PIX: ${closingSummaryData.paymentsPix}`);
    console.log(`Zé Delivery Online: ${closingSummaryData.paymentsZeOnline}`);
    console.log(`iFood Online: ${closingSummaryData.paymentsIfoodOnline}`);
    console.log("--- Movimentações (Simulado) ---");
    console.log(`Total Reforços: ${closingSummaryData.totalReforco}`);
    console.log(`Total Sangrias: ${closingSummaryData.totalSangria}`);
    console.log(`Descontos: ${closingSummaryData.discounts}`);
    console.log(`Taxas de Entrega: ${closingSummaryData.deliveryFees}`);
    console.log("--- Resumo do Fechamento ---");
    console.log(`Saldo Esperado (Sistema): R$ ${closingSummaryData.expectedSystemBalance?.toFixed(2) || '0.00'}`);
    console.log(`Saldo Contado (Físico): R$ ${closingSummaryData.countedPhysicalBalance.toFixed(2)}`);
    console.log(`Diferença (${closingSummaryData.differenceStatus}): R$ ${Math.abs(closingSummaryData.differenceAmount).toFixed(2)}`);
    console.log("--- FIM DO FECHAMENTO DE CAIXA ---");

    toast({
      title: `Relatório de Fechamento Simulado (${printMethod.toUpperCase()})`,
      description: "Os detalhes do fechamento foram impressos no console.",
      className: "bg-blue-500 text-white"
    });
  };


  const handleConfirmSangria = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sangriaAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: "destructive", title: "Valor Inválido", description: "Insira um valor positivo para a sangria." });
      return;
    }
    if (registerState.currentBalance === null || amount > registerState.currentBalance) {
      toast({ variant: "destructive", title: "Saldo Insuficiente", description: "O valor da sangria não pode exceder o saldo atual." });
      return;
    }
    setRegisterState(prev => ({ ...prev, currentBalance: (prev.currentBalance || 0) - amount }));
    toast({ title: "Sangria Registrada!", description: `Tipo: ${sangriaType}. Valor: R$ ${amount.toFixed(2)}. ${sangriaDescription ? `Descrição: ${sangriaDescription}` : ''}`, className: "bg-blue-500 text-white" });
    setIsSangriaDialogOpen(false);
    setSangriaAmount("");
    setSangriaDescription("");
    setSangriaType("Pagamento");
  };

  const handleConfirmReforco = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(reforcoAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: "destructive", title: "Valor Inválido", description: "Insira um valor positivo para o reforço." });
      return;
    }
    setRegisterState(prev => ({ ...prev, currentBalance: (prev.currentBalance || 0) + amount }));
    toast({ title: "Reforço Registrado", description: `R$ ${amount.toFixed(2)} adicionados ao caixa. Descrição: ${reforcoDescription || 'N/A'}`, className: "bg-green-500 text-white" });
    setIsReforcoDialogOpen(false);
    setReforcoAmount("");
    setReforcoDescription("");
  };
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height,4rem)-4*1.5rem)]">
        <Card className="w-full max-w-lg shadow-xl p-10 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Carregando...</CardTitle>
        </Card>
      </div>
    );
  }

  if (!registerState.isOpen) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height,4rem)-4*1.5rem)]">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 shadow-sm">
              <Landmark className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Abrir Caixa</CardTitle>
            <CardDescription className="text-md">Informe o valor inicial disponível para iniciar as operações do dia.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 py-6">
            <div className="space-y-2">
              <Label htmlFor="currentDateTime" className="text-sm font-medium text-muted-foreground">Data e Hora da Abertura</Label>
              <Input
                id="currentDateTime"
                type="text"
                value={currentDateTime}
                readOnly
                className="bg-muted/30 border-dashed text-center text-sm"
                aria-label="Data e hora atuais para abertura"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formInitialAmount" className="text-base font-semibold">Valor Inicial em Caixa (R$)</Label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="formInitialAmount"
                  type="number"
                  placeholder="0.00"
                  value={formInitialAmount}
                  onChange={(e) => setFormInitialAmount(e.target.value)}
                  className="pl-10 text-xl h-14 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  required
                  autoFocus
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-8">
            <Button 
              onClick={handleOpenRegister} 
              className="w-full text-lg py-7 shadow-md hover:shadow-lg transition-shadow" 
              size="lg" 
              disabled={!formInitialAmount || parseFloat(formInitialAmount) < 0}
            >
              Confirmar Abertura do Caixa
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If register IS open
  return (
    <>
      <div className="flex justify-center items-start pt-10 min-h-[calc(100vh-var(--header-height,4rem)-4*1.5rem)]">
        <Card className="w-full max-w-xl shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4 shadow-sm">
              <ClipboardCheck className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Status do Caixa</CardTitle>
            <CardDescription className="text-md text-green-600 font-semibold">Caixa Aberto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 py-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-muted-foreground">Horário de Abertura</Label>
                    <p className="text-lg font-semibold">{registerState.openingTimestamp || "N/A"}</p>
                </div>
                <div>
                    <Label className="text-sm font-medium text-muted-foreground">Valor de Abertura</Label>
                    <p className="text-lg font-semibold text-primary">R$ {registerState.initialOpeningAmount?.toFixed(2) || "0.00"}</p>
                </div>
            </div>
            <div className="text-center border-t border-b py-4">
              <Label className="text-sm font-medium text-muted-foreground block mb-1">Saldo Atual em Caixa</Label>
              <p className="text-4xl font-bold text-green-600">R$ {registerState.currentBalance?.toFixed(2) || "0.00"}</p>
            </div>
            
            <div className="p-3 bg-yellow-500/10 border border-yellow-600/30 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-xs text-yellow-700">O saldo do caixa é atualizado por vendas finalizadas no PDV e movimentações de Sangria/Reforço. Outras integrações podem não ser refletidas automaticamente.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-8 pb-8">
            <Button 
              asChild
              className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90" 
              size="lg" 
            >
              <Link href="/sales">
                <ShoppingCart className="mr-2 h-5 w-5" /> Registrar Nova Venda
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                    onClick={() => setIsSangriaDialogOpen(true)} 
                    variant="outline" 
                    className="w-full text-base py-6 shadow-sm hover:shadow-md transition-shadow" 
                    size="lg"
                >
                    <ArrowDownCircle className="mr-2 h-5 w-5 text-red-600" /> Sangria
                </Button>
                <Button 
                    onClick={() => setIsReforcoDialogOpen(true)} 
                    variant="outline" 
                    className="w-full text-base py-6 shadow-sm hover:shadow-md transition-shadow" 
                    size="lg"
                >
                    <ArrowUpCircle className="mr-2 h-5 w-5 text-green-600" /> Reforço
                </Button>
            </div>
            <Button 
              onClick={handleInitiateCloseRegister} 
              variant="destructive" 
              className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-shadow" 
              size="lg"
            >
              <ArchiveX className="mr-2 h-5 w-5" /> Fechar Caixa
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Sangria Dialog */}
      <Dialog open={isSangriaDialogOpen} onOpenChange={(isOpen) => { setIsSangriaDialogOpen(isOpen); if (!isOpen) { setSangriaAmount(""); setSangriaDescription(""); setSangriaType("Pagamento");} }}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleConfirmSangria}>
            <DialogHeader>
              <DialogTitle>Registrar Sangria</DialogTitle>
              <DialogDescription>Informe o valor e o tipo da retirada do caixa.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sangriaAmount" className="text-base font-semibold">Valor da Sangria (R$)</Label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="sangriaAmount"
                    type="number"
                    placeholder="0.00"
                    value={sangriaAmount}
                    onChange={(e) => setSangriaAmount(e.target.value)}
                    className="pl-10 text-xl h-14 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    required autoFocus min="0.01" step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sangriaType">Tipo de Sangria</Label>
                <Select value={sangriaType} onValueChange={(value) => setSangriaType(value as SangriaType)}>
                  <SelectTrigger id="sangriaType" className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vale">Vale</SelectItem>
                    <SelectItem value="Compra">Compra</SelectItem>
                    <SelectItem value="Pagamento">Pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sangriaDescription">Descrição (Opcional)</Label>
                <Input id="sangriaDescription" placeholder="Ex: Pagamento de fornecedor" value={sangriaDescription} onChange={(e) => setSangriaDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">Confirmar Sangria</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reforço Dialog */}
      <Dialog open={isReforcoDialogOpen} onOpenChange={(isOpen) => { setIsReforcoDialogOpen(isOpen); if(!isOpen) { setReforcoAmount(""); setReforcoDescription("");} }}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleConfirmReforco}>
            <DialogHeader>
              <DialogTitle>Registrar Reforço</DialogTitle>
              <DialogDescription>Informe o valor a ser adicionado ao caixa.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="space-y-2">
                <Label htmlFor="reforcoAmount" className="text-base font-semibold">Valor do Reforço (R$)</Label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="reforcoAmount"
                    type="number"
                    placeholder="0.00"
                    value={reforcoAmount}
                    onChange={(e) => setReforcoAmount(e.target.value)}
                    className="pl-10 text-xl h-14 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    required autoFocus min="0.01" step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reforcoDescription">Descrição (Opcional)</Label>
                <Input id="reforcoDescription" placeholder="Ex: Troco extra" value={reforcoDescription} onChange={(e) => setReforcoDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">Confirmar Reforço</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Closing Register Dialog 1: Physical Amount Input */}
      <Dialog open={isClosingDialogPhysicalAmountOpen} onOpenChange={setIsClosingDialogPhysicalAmountOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleProceedToConfirmDifference}>
            <DialogHeader>
              <DialogTitle>Conferir e Fechar Caixa</DialogTitle>
              <DialogDescription>Informe o valor total contado fisicamente no caixa.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Saldo Atual em Caixa (Sistema):</p>
                <p className="text-2xl font-bold">R$ {registerState.currentBalance?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="physicalAmountString" className="text-base font-semibold">Valor Físico Contado (R$)</Label>
                 <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="physicalAmountString"
                    type="number"
                    placeholder="0.00"
                    value={physicalAmountString}
                    onChange={(e) => setPhysicalAmountString(e.target.value)}
                    className="pl-10 text-xl h-14 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    required autoFocus min="0" step="0.01"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">Próximo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Closing Register Dialog 2: Confirm Difference */}
      {closingDifferenceDetails && (
        <Dialog open={isClosingDialogConfirmDifferenceOpen} onOpenChange={setIsClosingDialogConfirmDifferenceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Fechamento do Caixa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p><strong>Saldo Atual (Sistema):</strong> R$ {registerState.currentBalance?.toFixed(2) || "0.00"}</p>
              <p><strong>Valor Contado (Físico):</strong> R$ {parseFloat(physicalAmountString).toFixed(2)}</p>
              <p className={`font-semibold ${closingDifferenceDetails.amount !== 0 ? (closingDifferenceDetails.amount < 0 ? 'text-destructive' : 'text-yellow-600') : 'text-green-600'}`}>
                {closingDifferenceDetails.status}: R$ {Math.abs(closingDifferenceDetails.amount).toFixed(2)}
              </p>
              <DialogDescription>{closingDifferenceDetails.message}</DialogDescription>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsClosingDialogConfirmDifferenceOpen(false); setIsClosingDialogPhysicalAmountOpen(true); }}>Voltar</Button>
              <Button type="button" variant="destructive" onClick={handleFinalizeAndPreparePrint}>Confirmar e Fechar Caixa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Closing Register Dialog 3: Print Options */}
      {closingSummaryData && (
        <Dialog open={isPrintClosingNoteDialogOpen} onOpenChange={setIsPrintClosingNoteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Imprimir Nota de Fechamento</DialogTitle>
              <DialogDescription>
                Caixa fechado em: {closingSummaryData.closingTimestamp}. <br />
                Saldo final contado: R$ {closingSummaryData.countedPhysicalBalance.toFixed(2)}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Os detalhes completos do fechamento foram registrados e podem ser impressos.
                (Para este protótipo, os detalhes serão impressos no console do navegador.)
              </p>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => handlePrintClosingNote("pdf")}>
                <FileText className="mr-2 h-4 w-4" /> Imprimir PDF (Simulado)
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => handlePrintClosingNote("printer")}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir Cupom (Simulado)
              </Button>
              <DialogClose asChild className="w-full sm:w-auto">
                <Button type="button">Concluir</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

    