
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
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
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Store as number
  stock: number;
  active: boolean;
  image: string;
  "data-ai-hint": string;
  ean: string;
  description?: string;
}

const initialProductsData = [
  { id: "P001", name: "Pizza Margherita", category: "Pizzas", price: "R$ 30,00", stock: 50, active: true, image: "https://placehold.co/40x40.png", "data-ai-hint": "pizza food", ean: "7891234567890", description: "Molho de tomate fresco, mussarela de búfala e manjericão." },
  { id: "P002", name: "Coca-Cola 2L", category: "Bebidas", price: "R$ 10,00", stock: 120, active: true, image: "https://placehold.co/40x40.png", "data-ai-hint":"soda drink", ean: "7890987654321", description: "Refrigerante de cola gelado." },
  { id: "P003", name: "Brownie de Chocolate", category: "Sobremesas", price: "R$ 12,50", stock: 30, active: false, image: "https://placehold.co/40x40.png", "data-ai-hint":"dessert food", ean: "7891122334455", description: "Brownie com nozes e cobertura de chocolate." },
  { id: "P004", name: "Água Mineral 500ml", category: "Bebidas", price: "R$ 3,00", stock: 0, active: true, image: "https://placehold.co/40x40.png", "data-ai-hint":"water bottle", ean: "7895566778899", description: "Água mineral sem gás." },
];

// Helper to parse price string "R$ 30,00" to number 30.00
const parsePriceToNumber = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleanedPrice = priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  const parsed = parseFloat(cleanedPrice);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper to format number 30.00 to string "R$ 30,00"
const formatPriceToString = (priceNum: number | undefined): string => {
  if (priceNum === undefined || isNaN(priceNum)) return "R$ 0,00";
  return `R$ ${priceNum.toFixed(2).replace('.', ',')}`;
};

const transformedInitialProducts: Product[] = initialProductsData.map(p => ({
  ...p,
  price: parsePriceToNumber(p.price),
}));

const defaultAddProductForm = {
  name: "",
  ean: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  image: "https://placehold.co/100x100.png", // Default placeholder for new products
  "data-ai-hint": "new product",
};

export default function ProductsPage() {
  const { toast } = useToast();
  const [productsList, setProductsList] = useState<Product[]>(transformedInitialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Product Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addProductForm, setAddProductForm] = useState(defaultAddProductForm);

  // Edit Product Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductForm, setEditProductForm] = useState({
    id: "",
    name: "",
    ean: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    "data-ai-hint": "",
  });

  const handleToggleActive = (productId: string) => {
    setProductsList(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, active: !product.active } : product
      )
    );
  };

  const handleAddInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAddProductForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAddNewProduct = (e: FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `P${Date.now().toString().slice(-4)}${Math.random().toString().slice(2,4)}`,
      name: addProductForm.name,
      ean: addProductForm.ean,
      category: addProductForm.category,
      price: parseFloat(addProductForm.price) || 0,
      stock: parseInt(addProductForm.stock) || 0,
      description: addProductForm.description,
      active: true,
      image: addProductForm.image, 
      "data-ai-hint": addProductForm["data-ai-hint"],
    };
    setProductsList(prev => [newProduct, ...prev]);
    setIsAddDialogOpen(false);
    setAddProductForm(defaultAddProductForm); // Reset form
    toast({
        title: "Produto Adicionado!",
        description: `${newProduct.name} foi cadastrado com sucesso.`,
        className: "bg-green-500 text-white",
    });
  };

  const handleOpenEditDialog = (productToEdit: Product) => {
    setEditingProduct(productToEdit);
    setEditProductForm({
      id: productToEdit.id,
      name: productToEdit.name,
      ean: productToEdit.ean,
      category: productToEdit.category,
      price: productToEdit.price.toString(),
      stock: productToEdit.stock.toString(),
      description: productToEdit.description || "",
      image: productToEdit.image,
      "data-ai-hint": productToEdit["data-ai-hint"],
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target; // Changed id to name for HTML standard
    setEditProductForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveEditedProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProductsList(prevProducts =>
      prevProducts.map(p =>
        p.id === editingProduct.id
          ? {
              ...p, 
              name: editProductForm.name,
              ean: editProductForm.ean,
              category: editProductForm.category,
              price: parseFloat(editProductForm.price) || 0,
              stock: parseInt(editProductForm.stock) || 0,
              description: editProductForm.description,
            }
          : p
      )
    );
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    toast({
        title: "Produto Atualizado!",
        description: `Os dados de ${editProductForm.name} foram atualizados.`,
        className: "bg-green-500 text-white",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
        setProductsList(prevProducts => prevProducts.filter(p => p.id !== productId));
        toast({ 
            title: "Produto Excluído!", 
            description: "O produto foi removido com sucesso.",
            className: "bg-green-500 text-white"
        });
        if (editingProduct && editingProduct.id === productId) {
            setIsEditDialogOpen(false);
            setEditingProduct(null);
        }
    }
  };

  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ean.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Produtos</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <form onSubmit={handleAddNewProduct}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                <DialogDescription>Preencha os detalhes do produto abaixo.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nome</Label>
                  <Input id="name" placeholder="Ex: Pizza Calabresa" className="col-span-3" value={addProductForm.name} onChange={handleAddInputChange} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ean" className="text-right">EAN</Label>
                  <Input id="ean" placeholder="Código de barras do produto" className="col-span-3" value={addProductForm.ean} onChange={handleAddInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Categoria</Label>
                  <Input id="category" placeholder="Ex: Pizzas" className="col-span-3" value={addProductForm.category} onChange={handleAddInputChange} required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Preço (R$)</Label>
                  <Input id="price" type="number" placeholder="Ex: 35.90" className="col-span-3 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none" value={addProductForm.price} onChange={handleAddInputChange} required min="0" step="0.01" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">Estoque</Label>
                  <Input id="stock" type="number" placeholder="Ex: 100" className="col-span-3 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none" value={addProductForm.stock} onChange={handleAddInputChange} required min="0" step="1"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Descrição</Label>
                  <Textarea id="description" placeholder="Detalhes do produto..." className="col-span-3" value={addProductForm.description} onChange={handleAddInputChange} />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="addImage" className="text-right">Foto</Label>
                  <Input id="addImage" type="file" className="col-span-3" disabled /> 
                  {/* File input handling is complex, disabling for now to keep focus on requested features */}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Produto</Button>
              </DialogFooter>
            </form>
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
                    <Input placeholder="Buscar produto (nome, EAN, categoria)..." className="pl-8 w-full md:w-[250px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md" data-ai-hint={product['data-ai-hint']} />
                  </TableCell>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.ean}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPriceToString(product.price)}</TableCell>
                  <TableCell className={`text-center font-semibold ${product.stock === 0 ? 'text-destructive' : product.stock < 10 ? 'text-yellow-600' : ''}`}>
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                        checked={product.active} 
                        onCheckedChange={() => handleToggleActive(product.id)}
                        id={`switch-${product.id}`} 
                        aria-label={product.active ? 'Desativar produto' : 'Ativar produto'} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary" onClick={() => handleOpenEditDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-4">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSaveEditedProduct}>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>Modifique os detalhes do produto abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input type="hidden" id="id" value={editProductForm.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">Nome</Label>
                <Input id="name" name="name" placeholder="Ex: Pizza Calabresa" className="col-span-3" value={editProductForm.name} onChange={handleEditInputChange} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEan" className="text-right">EAN</Label>
                <Input id="ean" name="ean" placeholder="Código de barras do produto" className="col-span-3" value={editProductForm.ean} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCategory" className="text-right">Categoria</Label>
                <Input id="category" name="category" placeholder="Ex: Pizzas" className="col-span-3" value={editProductForm.category} onChange={handleEditInputChange} required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPrice" className="text-right">Preço (R$)</Label>
                <Input id="price" name="price" type="number" placeholder="Ex: 35.90" className="col-span-3 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none" value={editProductForm.price} onChange={handleEditInputChange} required min="0" step="0.01"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStock" className="text-right">Estoque</Label>
                <Input id="stock" name="stock" type="number" placeholder="Ex: 100" className="col-span-3 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none" value={editProductForm.stock} onChange={handleEditInputChange} required min="0" step="1"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDescription" className="text-right">Descrição</Label>
                <Textarea id="description" name="description" placeholder="Detalhes do produto..." className="col-span-3" value={editProductForm.description} onChange={handleEditInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editImage" className="text-right">Foto</Label>
                <Input id="editImage" type="file" className="col-span-3" disabled /> 
                {/* File input handling is complex, disabling for now */}
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => editingProduct && handleDeleteProduct(editingProduct.id)}
                    className="mr-auto"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Produto
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

