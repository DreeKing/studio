import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Filter, Search, Eye, Edit, MessageSquare } from "lucide-react";

const orders = [
  { id: "#10234", customer: "João Silva", source: "iFood", items: 3, total: "R$ 75,50", status: "Em Preparo", date: "2024-07-28 10:30" },
  { id: "#10235", customer: "Maria Oliveira", source: "Balcão", items: 1, total: "R$ 25,00", status: "Entregue", date: "2024-07-28 10:25" },
  { id: "#10236", customer: "Carlos Pereira", source: "WhatsApp", items: 5, total: "R$ 120,00", status: "Pendente", date: "2024-07-28 10:20" },
  { id: "#10237", customer: "Ana Costa", source: "Zé Delivery", items: 2, total: "R$ 45,80", status: "Cancelado", date: "2024-07-28 10:15" },
  { id: "#10238", customer: "Lucas Martins", source: "iFood", items: 2, total: "R$ 55,00", status: "Saiu para Entrega", date: "2024-07-28 10:10" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Pendente": return "outline";
    case "Em Preparo": return "default";
    case "Saiu para Entrega": return "secondary";
    case "Entregue": return "default"; // Should be a success variant, e.g. green. Using default for now.
    case "Cancelado": return "destructive";
    default: return "secondary";
  }
};
// Define a success variant in globals.css or use a custom class for "Entregue" if needed for green color
// For now, let's use primary for "Em Preparo" and secondary for "Saiu para Entrega" and a different shade for "Entregue"
// Let's adjust the badge color for "Entregue" to be more distinct.
// We can add a success variant to badgeVariants or use a custom class here.
// For now, I'll use custom background for Entregue.

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Gerenciar Pedidos</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl">Lista de Pedidos</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar pedido (ID, cliente...)" className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filtros <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por Origem</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Balcão</DropdownMenuItem>
                  <DropdownMenuItem>iFood</DropdownMenuItem>
                  <DropdownMenuItem>Zé Delivery</DropdownMenuItem>
                  <DropdownMenuItem>WhatsApp</DropdownMenuItem>
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Pendente</DropdownMenuItem>
                  <DropdownMenuItem>Em Preparo</DropdownMenuItem>
                   <DropdownMenuItem>Saiu para Entrega</DropdownMenuItem>
                  <DropdownMenuItem>Entregue</DropdownMenuItem>
                  <DropdownMenuItem>Cancelado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
           <Tabs defaultValue="todos" className="mt-4">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="em-preparo">Em Preparo</TabsTrigger>
              <TabsTrigger value="em-entrega">Em Entrega</TabsTrigger>
              <TabsTrigger value="finalizados">Finalizados</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.source}</TableCell>
                  <TableCell className="text-center">{order.items}</TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusVariant(order.status) as any}
                      className={order.status === 'Entregue' ? 'bg-green-500 text-white hover:bg-green-600' : 
                                 order.status === 'Em Preparo' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 
                                 order.status === 'Saiu para Entrega' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Atualizar Status</DropdownMenuItem>
                        {order.source === "WhatsApp" && <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Enviar Notificação</DropdownMenuItem>}
                        {order.status === "Pendente" && <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Cancelar Pedido</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
