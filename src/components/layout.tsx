import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Para evitar repetição, definimos os links de navegação como um array de objetos.
const navLinks = [
  {
    href: "#",
    icon: Home,
    label: "Dashboard",
    active: true, // Marcar o link ativo
  },
  {
    href: "#",
    icon: Users,
    label: "Alunos",
  },
  {
    href: "#",
    icon: LineChart,
    label: "Notas e Frequência",
  },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Sidebar para Desktop --- */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Portal Escolar</span>
            </a>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Ativar notificações</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    link.active ? "bg-muted text-primary" : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* --- Conteúdo Principal (Header + Página) --- */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* --- Menu para Mobile --- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Package2 className="h-6 w-6" />
                  <span>Portal Escolar</span>
                </a>
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* --- Menu do Utilizador --- */}
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Menu do utilizador</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* --- O conteúdo da sua página será renderizado aqui --- */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}