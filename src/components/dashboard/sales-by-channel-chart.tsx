// src/components/dashboard/sales-by-channel-chart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

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
} satisfies ChartConfig;

export function SalesByChannelChart() {
  return (
    <Card className="lg:col-span-2 shadow-lg">
      <CardHeader>
        <CardTitle>Vendas por Canal</CardTitle>
        <CardDescription>Distribuição das vendas de hoje pelos diferentes canais.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySalesData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
  );
}
