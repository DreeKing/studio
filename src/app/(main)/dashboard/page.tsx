import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DollarSign, Package, Truck, PlusCircle, ListOrdered, BarChart2, Bell, MessageCircleMore, Users, ShoppingBag } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import Link from "next/link";

const dailySalesData = [
  { channel: "Balcão", sales: 1250.75, fill: "var(--color-counter)" },
  { channel: "iFood", sales: 875.50, fill: "var(--color-ifood)" },
  { channel: "Zé Delivery", sales: 450.20, fill: "var(--color-ze)" },
  { channel: "WhatsApp", sales: 620.00, fill: "var(--color-whatsapp)" },
];

const chartConfig = {
  sales: {
    label: "Vendas (R$)",
  },
  counter: {
    label: "Balcão",
    color: "hsl(var(--chart-1))",
  },
  ifood: {
    label: "iFood",
    color: "hsl(var(--chart-2))",
  },
  ze: {
    label: "Zé Delivery",
    color: "hsl(var(--chart-3))",
  },
  whatsapp: {
    label: "WhatsApp",
    color: "hsl(var(--chart-4))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


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
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Vendas por Canal</CardTitle>
            <CardDescription>Distribuição das vendas de hoje pelos diferentes canais.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySalesData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="channel" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickFormatter={(value) => `R$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                  <Bar dataKey="sales" radius={8}>
                    <LabelList
                      position="top"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value: number) => `R$${value.toFixed(2)}`}
                    />
                  </Bar>
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

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
