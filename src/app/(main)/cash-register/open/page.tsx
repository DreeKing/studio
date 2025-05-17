
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, DollarSign } from "lucide-react";

export default function OpenCashRegisterPage() {
  const router = useRouter();
  const [initialAmount, setInitialAmount] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDateTime(now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, []);

  const handleOpenRegister = () => {
    // TODO: Implement logic to save cash register state
    console.log("Caixa aberto com valor inicial:", initialAmount);
    // For demo purposes, show an alert and redirect
    alert(`Caixa aberto com R$ ${parseFloat(initialAmount || "0").toFixed(2)}. Redirecionando para a página de vendas.`);
    router.push('/sales');
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height,4rem)-4*1.5rem)]"> {/* Adjusted min-height */}
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
            <Label htmlFor="initialAmount" className="text-base font-semibold">Valor Inicial em Caixa (R$)</Label>
            <div className="relative flex items-center">
              <DollarSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="initialAmount"
                type="number"
                placeholder="0.00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
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
            disabled={!initialAmount || parseFloat(initialAmount) < 0}
          >
            Confirmar Abertura do Caixa
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
