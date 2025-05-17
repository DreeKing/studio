import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, FileText, AlertOctagon } from "lucide-react";
import { WhatsAppAssistantClient } from "./whatsapp-assistant-client";


const faqItems = [
  {
    q: "Como configuro a integração com o iFood?",
    a: "Vá para a página de Configurações > Integrações. Insira seu Token API do iFood e clique em 'Testar Conexão'. Se bem-sucedido, a integração estará ativa."
  },
  {
    q: "Como simular pedidos do Zé Delivery?",
    a: "A integração com Zé Delivery é simulada. Você pode usar a interface de teste (a ser desenvolvida) para enviar pedidos fictícios ou verificar logs de webhooks simulados."
  },
  {
    q: "Como funciona o assistente de WhatsApp?",
    a: "Na seção 'Assistente Inteligente WhatsApp' desta página, cole a mensagem do cliente e o ID dele. O sistema usará IA para categorizar a mensagem e sugerir uma ação."
  },
  {
    q: "Onde vejo os logs de erro da API?",
    a: "Logs de erro detalhados estarão disponíveis nesta página na seção 'Logs de Erro da API'. Por enquanto, verifique o console do servidor para erros de backend."
  }
];

const errorLogs = [
  { timestamp: "2024-07-28 10:15:23", source: "iFood API", message: "Falha ao atualizar status do pedido #10230: Token inválido.", level: "critical" },
  { timestamp: "2024-07-28 09:45:01", source: "WhatsApp Webhook", message: "Mensagem recebida de número desconhecido.", level: "warning" },
  { timestamp: "2024-07-27 18:30:55", source: "Zé Delivery Sync", message: "Timeout ao sincronizar cardápio (simulado).", level: "info" },
];


export default function SupportPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Suporte e Ajuda</h1>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
              <CardDescription>Encontre respostas rápidas para dúvidas comuns.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left hover:no-underline">{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Logs de Erro da API (Simulado)</CardTitle>
              <CardDescription>Acompanhe problemas de integração e do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {errorLogs.map((log, index) => (
                <div key={index} className={`p-3 mb-2 rounded-md border ${
                    log.level === 'critical' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                    log.level === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700' :
                    'bg-blue-500/10 border-blue-500/30 text-blue-700'
                  }`}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold flex items-center"><AlertOctagon className="w-3 h-3 mr-1"/> {log.source}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-sm">{log.message}</p>
                </div>
              ))}
              {errorLogs.length === 0 && <p className="text-muted-foreground">Nenhum log de erro recente.</p>}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
            <WhatsAppAssistantClient />
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Precisa de Mais Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Ler Documentação Completa
                </Button>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contatar Suporte via WhatsApp
                </Button>
                <Button className="w-full" variant="secondary">
                  <Mail className="mr-2 h-4 w-4" /> Enviar E-mail para Suporte
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
