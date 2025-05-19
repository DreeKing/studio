// src/components/dashboard/sales-by-channel-chart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const dailySalesData = [
  { channel: "Balcão", sales: 1250.75, fill: "var(--color-counter)" },
  { channel: "iFood", sales: 875.50, fill: "var(--color-ifood)" },
  { channel: "Zé Delivery", sales: 450.20, fill: "var(--color-ze_delivery)" },
  { channel: "WhatsApp", sales: 620.00, fill: "var(--color-whatsapp)" },
];

const chartConfig = {
  sales: {
    label: "Vendas (R$)",
  },
  counter: { // Balcão
    label: "Balcão",
    color: "hsl(191, 65%, 25%)", // #15616F
  },
  ifood: {
    label: "iFood",
    color: "hsl(356, 83%, 51%)", // #EA1D2C
  },
  ze_delivery: { // Changed from 'ze' to 'ze_delivery' to match reports page if needed, or keep 'ze' if preferred for brevity
    label: "Zé Delivery",
    color: "hsl(48, 100%, 50%)", // #FFCC00
  },
  whatsapp: {
    label: "WhatsApp",
    color: "hsl(145, 70%, 49%)", // #25D366
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
              {/* A legenda pode ser desnecessária aqui já que as cores estão no XAxis ou na barra com LabelList */}
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
