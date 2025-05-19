
"use client";

import { useState, useEffect } from "react";
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
import type { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

interface SalesHistoryEntry {
  id: string; // Unique ID for the history entry
  orderId: string; // Original order ID from source system or PDV
  customer: string;
  source: "Balcão" | "iFood" | "Zé Delivery" | "WhatsApp" | "Outro";
  itemsDescription: string;
  total: number;
  status: "Concluído" | "Entregue" | "Cancelado";
  date: string; // Should be a consistent format, e.g., ISO string or 'YYYY-MM-DD HH:MM'
}

const LOCAL_STORAGE_SALES_KEY = "salesHistory_v1";

const initialSalesHistoryData: SalesHistoryEntry[] = [
  // This data will act as a fallback if localStorage is empty or for initial display.
  // It will be effectively replaced as new sales are logged.
  { id: "fallback-PDV1001", orderId: "PDV1001", customer: "Cliente Balcão 1", source: "Balcão", itemsDescription: "1x Pizza M, 1x Refri 2L", total: 55.00, status: "Concluído", date: "2024-07-29 12:30" },
  { id: "fallback-IFD2034", orderId: "IFD2034", customer: "Maria Silva (iFood)", source: "iFood", itemsDescription: "2x Sushi Combo, 1x Temaki", total: 89.90, status: "Entregue", date: "2024-07-29 19:45" },
];

const salesSources: Array<SalesHistoryEntry["source"] | "Todos"> = ["Todos", "Balcão", "iFood", "Zé Delivery", "WhatsApp", "Outro"];

export default function SalesHistoryPage() {
  const { toast } = useToast();
  const [salesHistory, setSalesHistory] = useState<SalesHistoryEntry[]>(initialSalesHistoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSourceFilter, setActiveSourceFilter] = useState<SalesHistoryEntry["source"] | "Todos">("Todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_SALES_KEY);
      if (storedHistory) {
        setSalesHistory(JSON.parse(storedHistory));
      } else {
        // If no history in localStorage, use initial (or save initial to LS)
        localStorage.setItem(LOCAL_STORAGE_SALES_KEY, JSON.stringify(initialSalesHistoryData));
      }
    } catch (error) {
      console.error("Failed to load sales history from localStorage:", error);
      toast({ variant: "destructive", title: "Erro ao carregar histórico", description: "Não foi possível carregar o histórico de vendas." });
    }
    setIsLoaded(true);
  }, [toast]); // Added toast to dependency array as it's used in error handling


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
      sale.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.itemsDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource = activeSourceFilter === "Todos" || sale.source === activeSourceFilter;
    
    let saleDate: Date | null = null;
    try {
        // Attempt to parse date, assuming 'DD/MM/YYYY HH:MM' or 'YYYY-MM-DD HH:MM' like formats
        const parts = sale.date.split(" ");
        const dateParts = parts[0].includes('-') ? parts[0].split("-") : parts[0].split("/");
        const timeParts = parts[1] ? parts[1].split(":") : ["00", "00"];
        
        if (parts[0].includes('-')) { // YYYY-MM-DD
            saleDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), parseInt(timeParts[0]), parseInt(timeParts[1]));
        } else { // DD/MM/YYYY
             saleDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]), parseInt(timeParts[0]), parseInt(timeParts[1]));
        }
    } catch (e) {
        console.warn("Could not parse date for filtering:", sale.date, e);
    }

    const matchesDate = !dateRange || !saleDate || (
        (!dateRange.from || saleDate >= dateRange.from) &&
        (!dateRange.to || saleDate <= dateRange.to)
    );

    return matchesSearch && matchesSource && matchesDate;
  }).sort((a, b) => { // Sort by date descending
    try {
        const dateA = new Date(a.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime(); // Handle DD/MM/YYYY by converting to MM/DD/YYYY for Date constructor
        const dateB = new Date(b.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();
        return dateB - dateA;
    } catch {
        return 0;
    }
  });
  
  if (!isLoaded) {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Vendas</h1>
            <Card className="shadow-lg p-10 text-center">
                <p>Carregando histórico de vendas...</p>
            </Card>
        </div>
    )
  }

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
              {/* @ts-ignore TODO: Fix DatePickerWithRange to accept onDateChange prop. For now, this might not update the state. */}
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
                  <TableCell className="font-medium">{sale.orderId}</TableCell>
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
