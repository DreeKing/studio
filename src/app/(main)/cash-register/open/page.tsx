
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
import { Landmark, DollarSign, ClipboardCheck, ArchiveX, ShoppingCart, AlertCircle, ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashRegisterState {
  isOpen: boolean;
  initialOpeningAmount: number | null;
  currentBalance: number | null;
  openingTimestamp: string | null;
}

const LOCAL_STORAGE_KEY = 'cashRegisterStatus_v2'; // Incremented version due to structure change

type SangriaType = "VALE" | "Compra" | "Pagamento";

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
  const [sangriaDescription, setSangriaDescription] = useState(""); // Optional description
  const [sangriaType, setSangriaType] = useState<SangriaType>("Pagamento");

  // Reforço state
  const [isReforcoDialogOpen, setIsReforcoDialogOpen] = useState(false);
  const [reforcoAmount, setReforcoAmount] = useState("");
  const [reforcoDescription, setReforcoDescription] = useState(""); // Optional description

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // Ensure currentBalance exists, if not, default it from initialOpeningAmount (for migration)
        if (parsedState.isOpen && parsedState.currentBalance === undefined && parsedState.initialOpeningAmount !== undefined) {
          parsedState.currentBalance = parsedState.initialOpeningAmount;
        } else if (parsedState.isOpen && parsedState.openedAmount !== undefined && parsedState.initialOpeningAmount === undefined) {
            // Migration from v1 (openedAmount to initialOpeningAmount & currentBalance)
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

  const handleCloseRegister = () => {
    const closingAmount = registerState.currentBalance; 

    setRegisterState({
      isOpen: false,
      initialOpeningAmount: null,
      currentBalance: null,
      openingTimestamp: null,
    });
    toast({
      title: "Caixa Fechado",
      description: `Caixa fechado às ${new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Saldo final: R$ ${closingAmount?.toFixed(2) || '0.00'}`,
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
    setSangriaType("Pagamento"); // Reset type
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
              <p className="text-xs text-yellow-700">Vendas e outras movimentações financeiras não são automaticamente refletidas no saldo atual nesta versão.</p>
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
              onClick={handleCloseRegister} 
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
                    <SelectItem value="VALE">VALE</SelectItem>
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
    </>
  );
}

      