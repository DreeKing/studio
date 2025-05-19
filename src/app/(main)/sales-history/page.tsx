
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SalesHistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Histórico de Vendas</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Histórico de Vendas</CardTitle>
          <CardDescription>
            Esta seção exibirá o histórico detalhado das vendas realizadas através do PDV e Delivery.
            (Funcionalidade em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aqui você poderá filtrar por data, tipo de venda (PDV, Delivery), cliente, e visualizar os itens de cada venda.
          </p>
          {/* Futuramente, aqui teremos uma tabela com filtros e detalhes das vendas */}
        </CardContent>
      </Card>
    </div>
  );
}
