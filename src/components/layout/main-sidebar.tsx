
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, ShoppingCart, ClipboardList, Truck, Box, Users, Bike, BarChart2, Settings, LifeBuoy, LogOut, Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/sales", label: "Vendas (PDV)", icon: ShoppingCart },
  { href: "/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/delivery", label: "Delivery", icon: Truck },
  { href: "/products", label: "Produtos", icon: Box },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/couriers", label: "Entregadores", icon: Bike },
  { href: "/reports", label: "Relatórios", icon: BarChart2 },
  { href: "/settings", label: "Configurações", icon: Settings },
  { href: "/support", label: "Suporte", icon: LifeBuoy },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Pizza className="h-8 w-8 text-primary" />
          <h1 className={cn("text-xl font-semibold group-data-[collapsible=icon]:hidden")}>
            OmniSales Hub
          </h1>
        </Link>
      </SidebarHeader>
      <Separator className="group-data-[collapsible=icon]:hidden" />
      <SidebarContent>
        <SidebarMenu className="p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "right", className:"bg-card text-card-foreground border-border shadow-md" }}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="group-data-[collapsible=icon]:hidden"/>
      <SidebarFooter className="p-2">
        {/* Placeholder for user profile or logout */}
        <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
          <LogOut className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden ml-2">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
