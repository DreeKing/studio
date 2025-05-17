
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Search, UploadCloud, DownloadCloud } from "lucide-react";
import Image from "next/image";

const products = [
  { id: "P001", name: "Pizza Margherita", category: "Pizzas", price: "R$ 30,00", stock: 50, active: true, image: "https://placehold.co/40x40.png", "data-ai-hint": "pizza food", ean: "7891234567890" },
  { id: "P002", name: "Coca-Cola 2L", category: "Bebidas", price: "R$ 10,00", stock: 120, active: true, image: "https://placehold.co/40x40.png", "data-ai-hint":"soda drink", ean: "7890987654321" },
  { id: "P003", name: "Brownie de Chocolate", category: "Sobremesas", price: "R$ 12,50", stock: 30, active: false, image: "https://placehold.co/40x40.png", "data-ai-hint":"dessert food", ean: "7891122334455" },
  { id: "P004", name: "Água Mineral 500ml", category: "Bebidas", price: "R$ 3,00", stock: 0, active: false, image: "https://placehold.co/40x40.png", "data-ai-hint":"water bottle", ean: "7895566778899" },
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Produtos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>Preencha os detalhes do produto abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" placeholder="Ex: Pizza Calabresa" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ean" className="text-right">EAN</Label>
                <Input id="ean" placeholder="Código de barras do produto" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Categoria</Label>
                <Input id="category" placeholder="Ex: Pizzas" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Preço</Label>
                <Input id="price" type="number" placeholder="Ex: 35.90" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Estoque</Label>
                <Input id="stock" type="number" placeholder="Ex: 100" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descrição</Label>
                <Textarea id="description" placeholder="Detalhes do produto..." className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Foto</Label>
                <Input id="image" type="file" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl">Lista de Produtos</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar produto..." className="pl-8 w-full md:w-[250px]" />
                </div>
                <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Importar</Button>
                <Button variant="outline"><DownloadCloud className="mr-2 h-4 w-4" /> Exportar</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagem</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>EAN</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead className="text-center">Ativo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md" data-ai-hint={product['data-ai-hint']} />
                  </TableCell>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.ean}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className={`text-center font-semibold ${product.stock === 0 ? 'text-destructive' : product.stock < 10 ? 'text-yellow-600' : ''}`}>
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={product.active} id={`switch-${product.id}`} aria-label={product.active ? 'Desativar produto' : 'Ativar produto'} />
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
