import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesByChannelChart } from "@/components/dashboard/sales-by-channel-chart";
import { DollarSign, Package, Truck, PlusCircle, ListOrdered, BarChart2, Bell, MessageCircleMore, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Vendas do Dia" value="R$ 3.200,45" icon={DollarSign} description="+20.1% vs ontem" />
        <MetricCard title="Pedidos Pendentes" value="12" icon={Package} description="3 iFood, 2 Zé, 7 WhatsApp" />
        <MetricCard title="Entregas em Rota" value="5" icon={Truck} />
        <MetricCard title="Novos Clientes Hoje" value="8" icon={Users} />
      </div>

      {/* Quick Access Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/sales">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Pedido
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/orders">
            <ListOrdered className="mr-2 h-5 w-5" /> Gerenciar Pedidos
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/reports">
            <BarChart2 className="mr-2 h-5 w-5" /> Relatórios
          </Link>
        </Button>
      </div>

      {/* Charts and Alerts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SalesByChannelChart />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
            <CardDescription>Ações urgentes e mensagens importantes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 bg-destructive/10 rounded-md border border-destructive/30">
              <Bell className="h-6 w-6 text-destructive mr-3" />
              <div>
                <p className="font-semibold text-destructive">Pedido Urgente #1024</p>
                <p className="text-sm text-destructive/80">Cliente aguardando há 15 min.</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-accent/20 rounded-md border border-accent/50">
              <MessageCircleMore className="h-6 w-6 text-accent-foreground mr-3" />
              <div>
                <p className="font-semibold text-accent-foreground">3 Mensagens WhatsApp</p>
                <p className="text-sm text-muted-foreground">Não respondidas há mais de 5 min.</p>
              </div>
            </div>
             <div className="flex items-center p-3 bg-yellow-500/10 rounded-md border border-yellow-500/30">
              <ShoppingBag className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="font-semibold text-yellow-700">Estoque Baixo: Coca-Cola 2L</p>
                <p className="text-sm text-yellow-600/80">Apenas 5 unidades restantes.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
