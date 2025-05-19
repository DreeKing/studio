
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from "lucide-react"; 
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Bar as RechartsBar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie as RechartsPie, PieChart as RechartsPieChart, Cell, Line as RechartsLine, LineChart as RechartsLineChart } from "recharts";

// Dummy data for charts
const salesByChannelData = [
  { name: 'Balcão', value: 4000, fill: "hsl(var(--chart-1))" },
  { name: 'iFood', value: 3000, fill: "hsl(var(--chart-2))" },
  { name: 'Zé Delivery', value: 2000, fill: "hsl(var(--chart-3))" },
  { name: 'WhatsApp', value: 2780, fill: "hsl(var(--chart-4))" },
];

const topProductsData = [
  { name: 'Pizza Margherita', sales: 120, fill: "hsl(var(--chart-1))" },
  { name: 'Coca-Cola 2L', sales: 250, fill: "hsl(var(--chart-2))" },
  { name: 'X-Burger', sales: 90, fill: "hsl(var(--chart-3))" },
  { name: 'Água Mineral', sales: 180, fill: "hsl(var(--chart-4))" },
  { name: 'Suco Laranja', sales: 70, fill: "hsl(var(--chart-5))" },
];

const salesOverTimeData = [
  { date: '01/07', sales: 2400 }, { date: '02/07', sales: 1398 },
  { date: '03/07', sales: 9800 }, { date: '04/07', sales: 3908 },
  { date: '05/07', sales: 4800 }, { date: '06/07', sales: 3800 },
  { date: '07/07', sales: 4300 },
];

const salesByPaymentTypeData = [
  { name: 'Dinheiro', value: 2500, fill: "hsl(var(--chart-1))" },
  { name: 'Cartão', value: 3200, fill: "hsl(var(--chart-2))" },
  { name: 'PIX', value: 1800, fill: "hsl(var(--chart-3))" },
  { name: 'Zé Online', value: 900, fill: "hsl(var(--chart-4))" },
  { name: 'iFood Online', value: 1200, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  value: { label: "Valor (R$)" },
  sales: { label: "Vendas (R$)" },
  balcao: { label: "Balcão", color: "hsl(var(--chart-1))" },
  ifood: { label: "iFood", color: "hsl(var(--chart-2))" },
  ze: { label: "Zé Delivery", color: "hsl(var(--chart-3))" },
  whatsapp: { label: "WhatsApp", color: "hsl(var(--chart-4))" },
  dinheiro: { label: "Dinheiro", color: "hsl(var(--chart-1))" },
  cartao: { label: "Cartão", color: "hsl(var(--chart-2))" },
  pix: { label: "PIX", color: "hsl(var(--chart-3))" },
  zeOnline: { label: "Zé Online", color: "hsl(var(--chart-4))" },
  ifoodOnline: { label: "iFood Online", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


const COLORS = [
    "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <div className="flex gap-2 items-center">
          <DatePickerWithRange />
          <Select defaultValue="daily">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar PDF</Button>
          <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Exportar Excel</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Vendas por Canal</CardTitle>
            <CardDescription>Performance de vendas em cada canal.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <RechartsPie data={salesByChannelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                     {salesByChannelData.map((entry, index) => (
                        <Cell key={`cell-channel-${index}`} fill={entry.fill} />
                      ))}
                  </RechartsPie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Ranking dos produtos por volume de vendas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={topProductsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                        <RechartsBar dataKey="sales" radius={4}>
                            {topProductsData.map((entry, index) => (
                                <Cell key={`cell-product-${index}`} fill={entry.fill} />
                            ))}
                        </RechartsBar>
                         <ChartLegend content={<ChartLegendContent />} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Vendas por Tipo de Pagamento</CardTitle>
            <CardDescription>Distribuição das vendas por forma de pagamento.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <RechartsPie data={salesByPaymentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                     {salesByPaymentTypeData.map((entry, index) => (
                        <Cell key={`cell-payment-${index}`} fill={entry.fill} />
                      ))}
                  </RechartsPie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ticket Médio e Vendas ao Longo do Tempo</CardTitle>
          <CardDescription>Evolução das vendas e ticket médio no período selecionado.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={salesOverTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <RechartsLine type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} name="Vendas" />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

