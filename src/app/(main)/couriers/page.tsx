import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Search, Bike } from "lucide-react";

const couriers = [
  { id: "E001", name: "Carlos Silva", phone: "(11) 98888-7777", vehicle: "Moto Honda CG 160", plate: "BRA2E19", status: "Disponível" },
  { id: "E002", name: "Ana Beatriz", phone: "(21) 97777-6666", vehicle: "Bike Elétrica", plate: "N/A", status: "Em Entrega" },
  { id: "E003", name: "Roberto Alves", phone: "(31) 96666-5555", vehicle: "Moto Yamaha Factor 150", plate: "XYZ1234", status: "Offline" },
];

export default function CouriersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Entregadores</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Entregador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Entregador</DialogTitle>
              <DialogDescription>Insira os dados do entregador.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" placeholder="Nome completo" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Telefone</Label>
                <Input id="phone" placeholder="(XX) XXXXX-XXXX" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">Veículo</Label>
                <Input id="vehicle" placeholder="Ex: Moto Honda CG 160" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plate" className="text-right">Placa</Label>
                <Input id="plate" placeholder="AAA0X00 (Opcional)" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Entregador</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl">Lista de Entregadores</CardTitle>
            <div className="relative w-full md:w-auto md:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar entregador..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><Bike className="h-5 w-5"/></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couriers.map((courier) => (
                <TableRow key={courier.id}>
                  <TableCell><Bike className={`h-5 w-5 ${courier.status === "Disponível" ? "text-green-500" : courier.status === "Em Entrega" ? "text-blue-500" : "text-muted-foreground"}`} /></TableCell>
                  <TableCell className="font-medium">{courier.id}</TableCell>
                  <TableCell>{courier.name}</TableCell>
                  <TableCell>{courier.phone}</TableCell>
                  <TableCell>{courier.vehicle} ({courier.plate})</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        courier.status === "Disponível" ? "bg-green-100 text-green-700" :
                        courier.status === "Em Entrega" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                       {courier.status}
                     </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
