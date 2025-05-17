
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Search, MessageSquarePlus, Eye } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  lastOrder?: string; // Made optional as it might not exist for new customers
  cpf?: string;
}

const initialCustomersData: Customer[] = [
  { id: "C001", name: "João Silva", phone: "(11) 98765-4321", address: "Rua das Palmeiras, 123", city: "São Paulo", lastOrder: "2024-07-28", cpf: "111.222.333-44" },
  { id: "C002", name: "Maria Oliveira", phone: "(21) 91234-5678", address: "Av. Central, 456", city: "Rio de Janeiro", lastOrder: "2024-07-27", cpf: "222.333.444-55" },
  { id: "C003", name: "Carlos Pereira", phone: "(31) 99999-8888", address: "Alameda dos Anjos, 789", city: "Belo Horizonte", lastOrder: "2024-07-28" },
];

const defaultAddCustomerForm = {
  name: "",
  phone: "",
  address: "",
  city: "", // Will combine with address for display, can be split if needed
  cpf: "",
};

export default function CustomersPage() {
  const [customersList, setCustomersList] = useState<Customer[]>(initialCustomersData);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Customer Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addCustomerForm, setAddCustomerForm] = useState(defaultAddCustomerForm);

  // Edit Customer Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editCustomerForm, setEditCustomerForm] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    cpf: "",
  });

  const handleAddInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddCustomerForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAddNewCustomer = (e: FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `C${Date.now().toString().slice(-4)}${Math.random().toString().slice(2,4)}`,
      name: addCustomerForm.name,
      phone: addCustomerForm.phone,
      address: addCustomerForm.address,
      city: addCustomerForm.city, // This field might need better handling or removal if city is part of address
      cpf: addCustomerForm.cpf,
      lastOrder: new Date().toISOString().split('T')[0], // Set lastOrder to today for new customer
    };
    setCustomersList(prev => [newCustomer, ...prev]);
    setIsAddDialogOpen(false);
    setAddCustomerForm(defaultAddCustomerForm); // Reset form
  };

  const handleOpenEditDialog = (customerToEdit: Customer) => {
    setEditingCustomer(customerToEdit);
    setEditCustomerForm({
      id: customerToEdit.id,
      name: customerToEdit.name,
      phone: customerToEdit.phone,
      address: customerToEdit.address,
      city: customerToEdit.city,
      cpf: customerToEdit.cpf || "",
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditCustomerForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveEditedCustomer = (e: FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setCustomersList(prevCustomers =>
      prevCustomers.map(c =>
        c.id === editingCustomer.id
          ? {
              ...c,
              name: editCustomerForm.name,
              phone: editCustomerForm.phone,
              address: editCustomerForm.address,
              city: editCustomerForm.city,
              cpf: editCustomerForm.cpf,
            }
          : c
      )
    );
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
        setCustomersList(prevCustomers => prevCustomers.filter(c => c.id !== customerId));
    }
  };

  const filteredCustomers = customersList.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.cpf && customer.cpf.toLowerCase().includes(searchTerm.toLowerCase())) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Clientes</h1>
        <div className="flex gap-2">
            <Button variant="outline"><MessageSquarePlus className="mr-2 h-4 w-4" /> Importar WhatsApp</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-md hover:shadow-lg transition-shadow">
                  <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddNewCustomer}>
                    <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                    <DialogDescription>Insira os dados do cliente.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" placeholder="Nome completo" className="col-span-3" value={addCustomerForm.name} onChange={handleAddInputChange} required/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Telefone</Label>
                        <Input id="phone" placeholder="(XX) XXXXX-XXXX" className="col-span-3" value={addCustomerForm.phone} onChange={handleAddInputChange} required/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">Endereço</Label>
                        <Input id="address" placeholder="Rua, Número, Bairro" className="col-span-3" value={addCustomerForm.address} onChange={handleAddInputChange} required/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">Cidade</Label>
                        <Input id="city" placeholder="Ex: São Paulo" className="col-span-3" value={addCustomerForm.city} onChange={handleAddInputChange} required/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cpf" className="text-right">CPF/CNPJ</Label>
                        <Input id="cpf" placeholder="Opcional" className="col-span-3" value={addCustomerForm.cpf} onChange={handleAddInputChange} />
                    </div>
                    </div>
                    <DialogFooter>
                    <Button type="submit">Salvar Cliente</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl">Lista de Clientes</CardTitle>
            <div className="relative w-full md:w-auto md:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar cliente (nome, telefone...)" className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="truncate max-w-xs">{customer.address}, {customer.city}</TableCell>
                  <TableCell>{customer.cpf || "N/A"}</TableCell>
                  <TableCell>{customer.lastOrder || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary" onClick={() => handleOpenEditDialog(customer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDeleteCustomer(customer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveEditedCustomer}>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Modifique os dados do cliente abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input type="hidden" id="id" value={editCustomerForm.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">Nome</Label>
                <Input id="editName" name="name" className="col-span-3" value={editCustomerForm.name} onChange={handleEditInputChange} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPhone" className="text-right">Telefone</Label>
                <Input id="editPhone" name="phone" className="col-span-3" value={editCustomerForm.phone} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editAddress" className="text-right">Endereço</Label>
                <Input id="editAddress" name="address" className="col-span-3" value={editCustomerForm.address} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCity" className="text-right">Cidade</Label>
                <Input id="editCity" name="city" className="col-span-3" value={editCustomerForm.city} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCpf" className="text-right">CPF/CNPJ</Label>
                <Input id="editCpf" name="cpf" className="col-span-3" value={editCustomerForm.cpf} onChange={handleEditInputChange} />
              </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    