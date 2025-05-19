
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DateRange } from "react-day-picker"; // Import DateRange

interface SalesHistoryEntry {
  id: string;
  customer: string;
  source: "Balcão" | "iFood" | "Zé Delivery" | "WhatsApp";
  itemsDescription: string; 
  total: number;
  status: "Concluído" | "Entregue" | "Cancelado";
  date: string; 
}

const initialSalesHistoryData: SalesHistoryEntry[] = [
  { id: "#PDV1001", customer: "Cliente Balcão 1", source: "Balcão", itemsDescription: "1x Pizza M, 1x Refri 2L", total: 55.00, status: "Concluído", date: "2024-07-29 12:30" },
  { id: "#IFD2034", customer: "Maria Silva (iFood)", source: "iFood", itemsDescription: "2x Sushi Combo, 1x Temaki", total: 89.90, status: "Entregue", date: "2024-07-29 19:45" },
  { id: "#ZD0788", customer: "João Pereira (Zé D.)", source: "Zé Delivery", itemsDescription: "6x Cerveja Lata, 1x Salgadinho", total: 42.50, status: "Entregue", date: "2024-07-28 20:15" },
  { id: "#WPP0012", customer: "Ana Beatriz (WhatsApp)", source: "WhatsApp", itemsDescription: "1x Hambúrguer Artesanal, 1x Batata Frita", total: 38.00, status: "Entregue", date: "2024-07-28 13:00" },
  { id: "#PDV1002", customer: "Cliente Balcão 2", source: "Balcão", itemsDescription: "2x Café, 1x Pão de Queijo", total: 15.00, status: "Concluído", date: "2024-07-27 09:10" },
  { id: "#IFD2035", customer: "Carlos Souza (iFood)", source: "iFood", itemsDescription: "1x Pizza Família", total: 70.00, status: "Cancelado", date: "2024-07-27 21:00" },
  { id: "#ZD0789", customer: "Fernanda Lima (Zé D.)", source: "Zé Delivery", itemsDescription: "12x Cerveja Long Neck", total: 72.00, status: "Entregue", date: "2024-07-29 18:00"},
  { id: "#WPP0013", customer: "Roberto Almeida (WhatsApp)", source: "WhatsApp", itemsDescription: "Combo 2 Pessoas (Massa + Bebida)", total: 95.00, status: "Entregue", date: "2024-07-29 20:30" }
];

const salesSources: Array<SalesHistoryEntry["source"] | "Todos"> = ["Todos", "Balcão", "iFood", "Zé Delivery", "WhatsApp"];


export default function SalesHistoryPage() {
  const [salesHistory, setSalesHistory] = useState<SalesHistoryEntry[]>(initialSalesHistoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSourceFilter, setActiveSourceFilter] = useState<SalesHistoryEntry["source"] | "Todos">("Todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined); // For DatePickerWithRange

  const getSourceBadgeVariant = (source: SalesHistoryEntry["source"]) => {
    switch (source) {
      case "iFood": return "bg-red-500 text-white hover:bg-red-600";
      case "Zé Delivery": return "bg-yellow-500 text-black hover:bg-yellow-600"; 
      case "WhatsApp": return "bg-green-500 text-white hover:bg-green-600";
      case "Balcão": return "bg-blue-500 text-white hover:bg-blue-600";
      default: return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: SalesHistoryEntry["status"]) => {
    switch (status) {
      case "Concluído":
      case "Entregue":
        return "bg-green-500 text-white hover:bg-green-600";
      case "Cancelado":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      default:
        return "outline";
    }
  };

  const filteredSalesHistory = salesHistory.filter(sale => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.itemsDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource = activeSourceFilter === "Todos" || sale.source === activeSourceFilter;
    
    // Basic date filtering (can be made more robust)
    const saleDate = new Date(sale.date.split(" ")[0]); // Get YYYY-MM-DD part
    const matchesDate = !dateRange || (
        (!dateRange.from || saleDate >= dateRange.from) &&
        (!dateRange.to || saleDate <= dateRange.to)
    );

    return matchesSearch && matchesSource && matchesDate;
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Histórico de Vendas</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle>Lista de Vendas Realizadas</CardTitle>
            <div className="flex gap-2 w-full md:w-auto items-center flex-wrap">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar no histórico..."
                  className="pl-8 w-full md:min-w-[200px] lg:min-w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Origem: {activeSourceFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por Origem</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {salesSources.map(source => (
                    <DropdownMenuItem key={source} onSelect={() => setActiveSourceFilter(source)}>
                      {source}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* @ts-ignore TODO: Fix DatePickerWithRange to accept onDateChange prop */}
              <DatePickerWithRange className="w-full sm:w-auto" /> 
              <Button variant="outline" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" /> Exportar</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Itens (Resumo)</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesHistory.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>
                    <Badge className={getSourceBadgeVariant(sale.source)}>
                      {sale.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{sale.itemsDescription}</TableCell>
                  <TableCell className="text-right font-semibold">R$ {sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(sale.status)}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                </TableRow>
              ))}
              {filteredSalesHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    Nenhuma venda encontrada para os critérios de busca.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
