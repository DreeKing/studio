
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Search, Bike, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Courier {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  plate: string;
  status: "Disponível" | "Em Entrega" | "Offline";
}

const initialCouriersData: Courier[] = [
  { id: "E001", name: "Carlos Silva", phone: "(11) 98888-7777", email: "carlos.silva@example.com", vehicle: "Moto Honda CG 160", plate: "BRA2E19", status: "Disponível" },
  { id: "E002", name: "Ana Beatriz", phone: "(21) 97777-6666", email: "ana.beatriz@example.com", vehicle: "Bike Elétrica", plate: "N/A", status: "Em Entrega" },
  { id: "E003", name: "Roberto Alves", phone: "(31) 96666-5555", email: "roberto.alves@example.com", vehicle: "Moto Yamaha Factor 150", plate: "XYZ1234", status: "Offline" },
];

const defaultAddCourierForm = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  plate: "",
};

export default function CouriersPage() {
  const { toast } = useToast();
  const [couriersList, setCouriersList] = useState<Courier[]>(initialCouriersData);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Courier Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addCourierForm, setAddCourierForm] = useState(defaultAddCourierForm);

  // Edit Courier Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [editCourierForm, setEditCourierForm] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    plate: "",
    status: "Disponível" as Courier["status"],
  });

  const handleAddInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddCourierForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAddNewCourier = (e: FormEvent) => {
    e.preventDefault();
    const newCourier: Courier = {
      id: `E${Date.now().toString().slice(-4)}${Math.random().toString().slice(2,4)}`,
      name: addCourierForm.name,
      phone: addCourierForm.phone,
      email: addCourierForm.email,
      vehicle: addCourierForm.vehicle,
      plate: addCourierForm.plate || "N/A",
      status: "Disponível", // Default status for new couriers
    };
    setCouriersList(prev => [newCourier, ...prev]);
    setIsAddDialogOpen(false);
    setAddCourierForm(defaultAddCourierForm); // Reset form
    toast({
        title: "Entregador Adicionado!",
        description: `${newCourier.name} foi cadastrado com sucesso.`,
        className: "bg-green-500 text-white",
    });
  };

  const handleOpenEditDialog = (courierToEdit: Courier) => {
    setEditingCourier(courierToEdit);
    setEditCourierForm({
      id: courierToEdit.id,
      name: courierToEdit.name,
      phone: courierToEdit.phone,
      email: courierToEdit.email,
      vehicle: courierToEdit.vehicle,
      plate: courierToEdit.plate,
      status: courierToEdit.status,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditCourierForm(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSaveEditedCourier = (e: FormEvent) => {
    e.preventDefault();
    if (!editingCourier) return;
    setCouriersList(prevCouriers =>
      prevCouriers.map(c =>
        c.id === editingCourier.id
          ? {
              ...c,
              name: editCourierForm.name,
              phone: editCourierForm.phone,
              email: editCourierForm.email,
              vehicle: editCourierForm.vehicle,
              plate: editCourierForm.plate || "N/A",
            }
          : c
      )
    );
    setIsEditDialogOpen(false);
    setEditingCourier(null);
    toast({
        title: "Entregador Atualizado!",
        description: `Os dados de ${editCourierForm.name} foram atualizados.`,
        className: "bg-green-500 text-white",
    });
  };

  const handleDeleteCourier = (courierId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este entregador?")) {
        setCouriersList(prevCouriers => prevCouriers.filter(c => c.id !== courierId));
        toast({ 
            title: "Entregador Excluído!", 
            description: "O entregador foi removido.", 
            className: "bg-green-500 text-white" 
        });
        if (editingCourier && editingCourier.id === courierId) {
            setIsEditDialogOpen(false);
            setEditingCourier(null);
        }
    }
  };

  const filteredCouriers = couriersList.filter(courier =>
    courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Entregadores</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Entregador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddNewCourier}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Entregador</DialogTitle>
                <DialogDescription>Insira os dados do entregador.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nome</Label>
                  <Input id="name" placeholder="Nome completo" className="col-span-3" value={addCourierForm.name} onChange={handleAddInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Telefone</Label>
                  <Input id="phone" placeholder="(XX) XXXXX-XXXX" className="col-span-3" value={addCourierForm.phone} onChange={handleAddInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" className="col-span-3" value={addCourierForm.email} onChange={handleAddInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicle" className="text-right">Veículo</Label>
                  <Input id="vehicle" placeholder="Ex: Moto Honda CG 160" className="col-span-3" value={addCourierForm.vehicle} onChange={handleAddInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plate" className="text-right">Placa</Label>
                  <Input id="plate" placeholder="AAA0X00 (Opcional)" className="col-span-3" value={addCourierForm.plate} onChange={handleAddInputChange}/>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Entregador</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl">Lista de Entregadores</CardTitle>
            <div className="relative w-full md:w-auto md:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar entregador..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <TableHead>Email</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCouriers.map((courier) => (
                <TableRow key={courier.id}>
                  <TableCell><Bike className={`h-5 w-5 ${courier.status === "Disponível" ? "text-green-500" : courier.status === "Em Entrega" ? "text-blue-500" : "text-muted-foreground"}`} /></TableCell>
                  <TableCell className="font-medium">{courier.id}</TableCell>
                  <TableCell>{courier.name}</TableCell>
                  <TableCell>{courier.phone}</TableCell>
                  <TableCell><Mail className="inline h-4 w-4 mr-1 text-muted-foreground"/>{courier.email}</TableCell>
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
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary" onClick={() => handleOpenEditDialog(courier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCouriers.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                        Nenhum entregador encontrado.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Courier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveEditedCourier}>
            <DialogHeader>
              <DialogTitle>Editar Entregador</DialogTitle>
              <DialogDescription>Modifique os dados do entregador abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input type="hidden" id="id" value={editCourierForm.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" className="col-span-3" value={editCourierForm.name} onChange={handleEditInputChange} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Telefone</Label>
                <Input id="phone" className="col-span-3" value={editCourierForm.phone} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" className="col-span-3" value={editCourierForm.email} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">Veículo</Label>
                <Input id="vehicle" className="col-span-3" value={editCourierForm.vehicle} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plate" className="text-right">Placa</Label>
                <Input id="plate" className="col-span-3" value={editCourierForm.plate} onChange={handleEditInputChange} />
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => editingCourier && handleDeleteCourier(editingCourier.id)}
                    className="mr-auto"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Entregador
                </Button>
                <div className="flex items-center">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="mr-2">Cancelar</Button>
                    <Button type="submit">Salvar Alterações</Button>
                </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
    
