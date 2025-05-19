
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, DollarSign, ClipboardCheck, ArchiveX, ShoppingCart, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashRegisterState {
  isOpen: boolean;
  openedAmount: number | null;
  openingTimestamp: string | null;
}

const LOCAL_STORAGE_KEY = 'cashRegisterStatus_v1';

export default function CashRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formInitialAmount, setFormInitialAmount] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [registerState, setRegisterState] = useState<CashRegisterState>({
    isOpen: false,
    openedAmount: null,
    openingTimestamp: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);


  // Load state from localStorage on mount and set current date/time
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        setRegisterState(JSON.parse(storedState));
      }
    } catch (error) {
      console.error("Failed to parse cash register state from localStorage:", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem(LOCAL_STORAGE_KEY);
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

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) { // Only save after initial load to prevent overwriting with default
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

    setRegisterState({
      isOpen: true,
      openedAmount: amount,
      openingTimestamp: currentDateTime,
    });
    setFormInitialAmount(""); // Clear input after opening
    toast({
      title: "Caixa Aberto com Sucesso!",
      description: `Valor inicial: R$ ${amount.toFixed(2)}. Horário: ${currentDateTime}`,
      className: "bg-green-500 text-white"
    });
  };

  const handleCloseRegister = () => {
    // In a real app, you'd likely calculate final balance, print reports, etc.
    const closingAmount = registerState.openedAmount; // Placeholder for actual closing amount calculation

    setRegisterState({
      isOpen: false,
      openedAmount: null,
      openingTimestamp: null,
    });
    toast({
      title: "Caixa Fechado",
      description: `Caixa fechado às ${new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Valor final (simulado): R$ ${closingAmount?.toFixed(2) || '0.00'}`,
    });
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
                aria-label="Data e hora atuais"
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
    <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height,4rem)-4*1.5rem)]">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4 shadow-sm">
            <ClipboardCheck className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Status do Caixa</CardTitle>
          <CardDescription className="text-md text-green-600 font-semibold">Caixa Aberto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-8 py-6">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Horário de Abertura</Label>
            <p className="text-lg font-semibold">{registerState.openingTimestamp || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Valor de Abertura</Label>
            <p className="text-2xl font-bold text-primary">R$ {registerState.openedAmount?.toFixed(2) || "0.00"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Valor Atual em Caixa (Simulado)</Label>
            <p className="text-2xl font-bold text-green-600">R$ {registerState.openedAmount?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-600/30 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-xs text-yellow-700">Cálculo de saldo atual, sangrias e reforços não implementados nesta versão.</p>
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
  );
}

// Simple loader component to prevent hydration issues with localStorage
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

