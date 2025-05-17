// src/app/(main)/support/whatsapp-assistant-client.tsx
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, BotMessageSquare, CheckCircle, AlertTriangle } from "lucide-react";
import { whatsappOrderProcessing, type WhatsappOrderProcessingOutput } from "@/ai/flows/whatsapp-order-processing"; // Adjust path as necessary

const formSchema = z.object({
  message: z.string().min(5, { message: "A mensagem deve ter pelo menos 5 caracteres." }).max(500, { message: "A mensagem não pode exceder 500 caracteres." }),
  customerId: z.string().min(1, { message: "ID do cliente é obrigatório." }),
});

type FormData = z.infer<typeof formSchema>;

export function WhatsAppAssistantClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhatsappOrderProcessingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      customerId: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await whatsappOrderProcessing({
        message: data.message,
        customerId: data.customerId,
      });
      setResult(response);
    } catch (e: any) {
      setError(e.message || "Ocorreu um erro ao processar a mensagem.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          Assistente Inteligente WhatsApp
        </CardTitle>
        <CardDescription>
          Categorize mensagens de clientes do WhatsApp e obtenha sugestões de ação.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: WHATSAPP_USER_123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem do Cliente</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite ou cole a mensagem do cliente aqui..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Processar Mensagem
            </Button>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-5 w-5"/> {error}
              </div>
            )}
            {result && (
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600"/>
                    Análise da Mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Categoria:</strong> <span className="font-mono p-1 bg-muted rounded-sm">{result.category}</span></p>
                  <p><strong>Ação Sugerida:</strong> {result.suggestedAction}</p>
                  <p><strong>Confiança:</strong> {(result.confidence * 100).toFixed(0)}%</p>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
