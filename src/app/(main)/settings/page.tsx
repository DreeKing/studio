
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, KeyRound, Clock, Wifi, AlertTriangle, CheckCircle, UserPlus, Edit2, Trash2 } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";

interface PdvUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operador";
  // Password should not be stored in state like this in a real app
}

const defaultAddUserForm = {
  name: "",
  email: "",
  password: "", // For prototype only
  role: "operador" as PdvUser["role"],
};

const defaultEditUserForm = {
  id: "",
  name: "",
  email: "",
  role: "operador" as PdvUser["role"],
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [ifoodStatus, setIfoodStatus] = useState<"untested" | "testing" | "ok" | "error">("untested");
  const [whatsappStatus, setWhatsappStatus] = useState<"untested" | "testing" | "ok" | "error">("untested");

  const [usersList, setUsersList] = useState<PdvUser[]>([
    { id: "U001", name: "Admin Principal", email: "admin@example.com", role: "admin" },
    { id: "U002", name: "Caixa 1", email: "caixa1@example.com", role: "operador" },
  ]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState(defaultAddUserForm);

  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PdvUser | null>(null);
  const [editUserForm, setEditUserForm] = useState(defaultEditUserForm);


  const testApiConnection = (api: "ifood" | "whatsapp") => {
    if (api === "ifood") setIfoodStatus("testing");
    if (api === "whatsapp") setWhatsappStatus("testing");

    setTimeout(() => {
      const success = Math.random() > 0.3; 
      if (api === "ifood") setIfoodStatus(success ? "ok" : "error");
      if (api === "whatsapp") setWhatsappStatus(success ? "ok" : "error");
    }, 1500);
  };

  const handleAddUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Changed id to name to match input field names
    setAddUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUserRoleChange = (value: PdvUser["role"]) => {
    setAddUserForm(prev => ({ ...prev, role: value }));
  };

  const handleAddNewUser = (e: FormEvent) => {
    e.preventDefault();
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password) {
        toast({
            variant: "destructive",
            title: "Erro ao Adicionar Usuário",
            description: "Por favor, preencha todos os campos obrigatórios."
        });
        return;
    }
    const newUser: PdvUser = {
      id: `U${Date.now().toString().slice(-4)}${Math.random().toString().slice(2,4)}`,
      name: addUserForm.name,
      email: addUserForm.email,
      role: addUserForm.role,
    };
    setUsersList(prev => [newUser, ...prev]);
    setIsAddUserDialogOpen(false);
    setAddUserForm(defaultAddUserForm);
    toast({
        title: "Usuário Adicionado!",
        description: `O usuário ${newUser.name} foi cadastrado com sucesso.`,
        className: "bg-green-500 text-white"
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      setUsersList(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Usuário Excluído!",
        description: "O usuário foi removido com sucesso do sistema.",
        className: "bg-green-500 text-white" // Added success styling
      });
    }
  };

  const handleOpenEditDialog = (userToEdit: PdvUser) => {
    setEditingUser(userToEdit);
    setEditUserForm({
      id: userToEdit.id,
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleEditUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Changed id to name
    setEditUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUserRoleChange = (value: PdvUser["role"]) => {
    setEditUserForm(prev => ({ ...prev, role: value }));
  };

  const handleSaveEditedUser = (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editUserForm.name || !editUserForm.email) {
      toast({
        variant: "destructive",
        title: "Erro ao Editar Usuário",
        description: "Nome e email são obrigatórios.",
      });
      return;
    }
    setUsersList(prevUsers =>
      prevUsers.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              name: editUserForm.name,
              email: editUserForm.email,
              role: editUserForm.role,
            }
          : user
      )
    );
    setIsEditUserDialogOpen(false);
    setEditingUser(null);
    toast({
      title: "Usuário Atualizado!",
      description: `Os dados do usuário ${editUserForm.name} foram atualizados.`,
      className: "bg-green-500 text-white"
    });
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="operation">Operação</TabsTrigger>
          <TabsTrigger value="users">Usuários PDV</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Informações básicas do estabelecimento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input id="storeName" defaultValue="Minha Loja de Pizzas" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Endereço</Label>
                  <Input id="storeAddress" defaultValue="Rua Fictícia, 123 - Bairro Exemplo" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="storePhone">Telefone Principal</Label>
                <Input id="storePhone" defaultValue="(00) 12345-6789" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Integrações com Plataformas</CardTitle>
              <CardDescription>Configure suas chaves de API e conexões.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Globe className="w-5 h-5 mr-2 text-red-500"/>iFood</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ifoodToken">Token API iFood</Label>
                    <Input id="ifoodToken" type="password" placeholder="Cole seu token aqui" className="mt-1" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => testApiConnection("ifood")} disabled={ifoodStatus === "testing"}>
                      <Wifi className="mr-2 h-4 w-4" /> {ifoodStatus === "testing" ? "Testando..." : "Testar Conexão"}
                    </Button>
                    {ifoodStatus === "ok" && <span className="flex items-center text-sm text-green-600"><CheckCircle className="w-4 h-4 mr-1"/>Conectado</span>}
                    {ifoodStatus === "error" && <span className="flex items-center text-sm text-destructive"><AlertTriangle className="w-4 h-4 mr-1"/>Falha na conexão</span>}
                  </div>
                </div>
              </div>
              <hr/>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Globe className="w-5 h-5 mr-2 text-yellow-500"/>Zé Delivery (Simulado)</h3>
                 <div className="space-y-3">
                  <div>
                    <Label htmlFor="zeToken">Token API Zé Delivery</Label>
                    <Input id="zeToken" type="password" placeholder="Chave API simulada" className="mt-1" />
                  </div>
                   <p className="text-xs text-muted-foreground">Esta é uma simulação. A API do Zé Delivery possui acesso restrito.</p>
                </div>
              </div>
              <hr/>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><KeyRound className="w-5 h-5 mr-2 text-green-500"/>WhatsApp Business API</h3>
                 <div className="space-y-3">
                  <div>
                    <Label htmlFor="whatsappToken">Token API WhatsApp</Label>
                    <Input id="whatsappToken" type="password" placeholder="Meta / Twilio Token" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumberId">ID do Número de Telefone</Label>
                    <Input id="whatsappNumberId" placeholder="ID do número" className="mt-1" />
                  </div>
                   <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => testApiConnection("whatsapp")} disabled={whatsappStatus === "testing"}>
                      <Wifi className="mr-2 h-4 w-4" /> {whatsappStatus === "testing" ? "Testando..." : "Testar Conexão"}
                    </Button>
                    {whatsappStatus === "ok" && <span className="flex items-center text-sm text-green-600"><CheckCircle className="w-4 h-4 mr-1"/>Conectado</span>}
                    {whatsappStatus === "error" && <span className="flex items-center text-sm text-destructive"><AlertTriangle className="w-4 h-4 mr-1"/>Falha na conexão</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operation" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Configurações de Operação</CardTitle>
              <CardDescription>Horários, taxas e outras definições operacionais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="workingHours" className="text-base font-medium">Horário de Funcionamento</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div><Input id="openTime" type="time" defaultValue="08:00" /> <Label htmlFor="openTime" className="text-xs text-muted-foreground">Abertura</Label></div>
                  <div><Input id="closeTime" type="time" defaultValue="23:00" /> <Label htmlFor="closeTime" className="text-xs text-muted-foreground">Fechamento</Label></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="deliveryFee">Taxa de Entrega Padrão (R$)</Label>
                  <Input id="deliveryFee" type="number" defaultValue="5.00" className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="minOrderValue">Valor Mínimo do Pedido para Entrega (R$)</Label>
                  <Input id="minOrderValue" type="number" defaultValue="20.00" className="mt-1" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="autoAcceptOrders" />
                <Label htmlFor="autoAcceptOrders">Aceitar pedidos do iFood/Zé Delivery automaticamente</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
           <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Gerenciamento de Usuários PDV</CardTitle>
                <CardDescription>Adicione, edite ou remova usuários do sistema.</CardDescription>
              </div>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-md hover:shadow-lg transition-shadow">
                    <UserPlus className="mr-2 h-5 w-5" /> Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAddNewUser}>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário PDV</DialogTitle>
                      <DialogDescription>Insira os dados do novo usuário.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" name="name" placeholder="Nome completo" className="col-span-3" value={addUserForm.name} onChange={handleAddUserInputChange} required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="email@example.com" className="col-span-3" value={addUserForm.email} onChange={handleAddUserInputChange} required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Senha</Label>
                        <Input id="password" name="password" type="password" placeholder="Senha (mín. 6 caracteres)" className="col-span-3" value={addUserForm.password} onChange={handleAddUserInputChange} required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Função</Label>
                        <Select value={addUserForm.role} onValueChange={handleAddUserRoleChange}>
                          <SelectTrigger id="role" className="col-span-3">
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="operador">Operador de Caixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Salvar Usuário</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {usersList.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="mr-1 hover:text-primary" onClick={() => handleOpenEditDialog(user)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum usuário cadastrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSaveEditedUser}>
                <DialogHeader>
                <DialogTitle>Editar Usuário PDV</DialogTitle>
                <DialogDescription>Modifique os dados do usuário abaixo. Deixe a senha em branco para não alterá-la.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <Input type="hidden" id="editUserId" name="id" value={editUserForm.id} />
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editUserName" className="text-right">Nome</Label>
                    <Input id="editUserName" name="name" placeholder="Nome completo" className="col-span-3" value={editUserForm.name} onChange={handleEditUserInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editUserEmail" className="text-right">Email</Label>
                    <Input id="editUserEmail" name="email" type="email" placeholder="email@example.com" className="col-span-3" value={editUserForm.email} onChange={handleEditUserInputChange} required/>
                </div>
                {/* Password field can be added if password change is desired during edit
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editUserPassword" className="text-right">Nova Senha</Label>
                    <Input id="editUserPassword" name="password" type="password" placeholder="Deixe em branco para não alterar" className="col-span-3" onChange={handleEditUserInputChange}/>
                </div>
                */}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editUserRole" className="text-right">Função</Label>
                    <Select value={editUserForm.role} onValueChange={handleEditUserRoleChange}>
                    <SelectTrigger id="editUserRole" className="col-span-3">
                        <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="operador">Operador de Caixa</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>


        <div className="mt-8 flex justify-end">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow" onClick={() => toast({title: "Configurações Salvas!", description:"Todas as suas alterações foram salvas com sucesso.", className: "bg-green-500 text-white"})}>Salvar Todas as Configurações</Button>
        </div>
      </Tabs>
    </div>
  );
}

