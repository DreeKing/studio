
"use client"; 

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label"; // Added Label import
import { Download, FileText, BarChart3 } from "lucide-react"; 
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Bar as RechartsBar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie as RechartsPie, PieChart as RechartsPieChart, Cell, Line as RechartsLine, LineChart as RechartsLineChart } from "recharts";
import type { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

// Dummy data for charts
const salesByChannelData = [
  { name: 'balcao', value: 4000, fill: "var(--color-balcao)" },
  { name: 'ifood', value: 3000, fill: "var(--color-ifood)" },
  { name: 'ze_delivery', value: 2000, fill: "var(--color-ze_delivery)" },
  { name: 'whatsapp', value: 2780, fill: "var(--color-whatsapp)" },
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
  { name: 'dinheiro', value: 2500, fill: "var(--color-dinheiro)" },
  { name: 'cartao', value: 3200, fill: "var(--color-cartao)" },
  { name: 'pix', value: 1800, fill: "var(--color-pix)" },
  { name: 'ze_online', value: 900, fill: "var(--color-ze_online)" },
  { name: 'ifood_online', value: 1200, fill: "var(--color-ifood_online)" },
];

const chartConfig = {
  value: { label: "Valor (R$)" },
  sales: { label: "Vendas (R$)" },
  // Sales Channels
  balcao: { label: "Balcão", color: "#15616F" }, 
  ifood: { label: "iFood", color: "#EA1D2C" }, 
  ze_delivery: { label: "Zé Delivery", color: "#FFCC00" }, 
  whatsapp: { label: "WhatsApp", color: "#25D366" }, 
  // Payment Types
  dinheiro: { label: "Dinheiro", color: "hsl(211, 100%, 50%)" }, // Azul
  cartao: { label: "Cartão", color: "hsl(16, 69%, 50%)" }, // Laranja #D8542A
  pix: { label: "PIX", color: "#25D366" }, // Verde #25D366
  ze_online: { label: "Zé Delivery Online", color: "#FFCC00" }, // Amarelo #FFCC00
  ifood_online: { label: "iFood Online", color: "#EA1D2C" }, // Vermelho #EA1D2C
  // Product sales (example colors)
  "Pizza Margherita": { label: "Pizza Margherita", color: "hsl(var(--chart-1))" },
  "Coca-Cola 2L": { label: "Coca-Cola 2L", color: "hsl(var(--chart-2))" },
  "X-Burger": { label: "X-Burger", color: "hsl(var(--chart-3))" },
  "Água Mineral": { label: "Água Mineral", color: "hsl(var(--chart-4))" },
  "Suco Laranja": { label: "Suco Laranja", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

interface DetailedProductSale {
  id: string;
  name: string;
  quantitySold: number;
  unitPrice: number;
  totalValue: number;
}

const detailedTopProductsData: DetailedProductSale[] = [
  { id: "P001", name: "Coca-Cola 2L", quantitySold: 250, unitPrice: 10.00, totalValue: 2500.00 },
  { id: "P002", name: "Água Mineral", quantitySold: 180, unitPrice: 3.00, totalValue: 540.00 },
  { id: "P003", name: "Pizza Margherita", quantitySold: 120, unitPrice: 30.00, totalValue: 3600.00 },
  { id: "P004", name: "X-Burger", quantitySold: 90, unitPrice: 20.00, totalValue: 1800.00 },
  { id: "P005", name: "Suco Laranja", quantitySold: 70, unitPrice: 7.00, totalValue: 490.00 },
  { id: "P006", name: "Brownie", quantitySold: 50, unitPrice: 12.50, totalValue: 625.00 },
];


export default function ReportsPage() {
  const { toast } = useToast();
  const [isTopProductsDialogOpen, setIsTopProductsDialogOpen] = useState(false);
  const [topProductsDateRange, setTopProductsDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
    to: new Date(), // Today
  });

  const handleExportTopProductsXLS = () => {
    console.log("Simulando exportação da lista detalhada de produtos para XLS...");
    toast({
      title: "Exportação Simulada",
      description: "A lista detalhada de produtos seria exportada para Excel.",
      className: "bg-green-500 text-white",
    });
  };

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
                  <ChartLegend content={<ChartLegendContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Ranking dos produtos por volume de vendas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex-grow">
             <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={topProductsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" dataKey="sales" />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                        <RechartsBar dataKey="sales" radius={4}>
                            {topProductsData.map((entry, index) => (
                                <Cell key={`cell-product-${index}`} fill={entry.fill} />
                            ))}
                        </RechartsBar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="justify-center border-t pt-4">
            <Button variant="link" onClick={() => setIsTopProductsDialogOpen(true)}>
              <BarChart3 className="mr-2 h-4 w-4" /> Ver mais detalhes
            </Button>
          </CardFooter>
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
                  <ChartLegend content={<ChartLegendContent />} />
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

      {/* Dialog for Top Selling Products Details */}
      <Dialog open={isTopProductsDialogOpen} onOpenChange={setIsTopProductsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhes dos Produtos Mais Vendidos</DialogTitle>
            <DialogDescription>
              Visualize a lista detalhada de produtos vendidos. Use o filtro de data para refinar a busca (simulado).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex-grow overflow-y-auto pr-2 space-y-4">
            <div className="mb-4">
              <Label htmlFor="topProductsDateRange" className="text-sm font-medium">Filtrar por Data:</Label>
              <DatePickerWithRange 
                // @ts-ignore TODO: Fix DatePickerWithRange to accept DateRange | undefined and pass setter
                // For now, this will just display. We'll need to adjust DatePickerWithRange to accept a setter
                // or manage the date locally if we want it to be interactive in the dialog.
                // For simplicity, I'm passing the state but not a setter.
                // date={topProductsDateRange} 
                // onDateChange={setTopProductsDateRange} // This prop doesn't exist on current component
                className="mt-1" 
              /> 
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd. Vendida</TableHead>
                  <TableHead className="text-right">Preço Un. (R$)</TableHead>
                  <TableHead className="text-right">Valor Total (R$)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedTopProductsData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.quantitySold}</TableCell>
                    <TableCell className="text-right">{product.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">{product.totalValue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {detailedTopProductsData.length === 0 && (
                   <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        Nenhum produto para exibir.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="mt-4 pt-4 border-t sm:justify-between">
            <Button variant="outline" onClick={handleExportTopProductsXLS}>
              <Download className="mr-2 h-4 w-4" /> Baixar lista em XLS
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    
