import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  Settings,
  Users,
  UserCheck,
  ClipboardList,
  BarChart3,
  School,
  FileText,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { supabase } from "../supabaseClient"

// Tipos para os itens do menu
type MenuItemSimple = {
  title: string
  url: string
  icon: any
}

type MenuItemWithSub = {
  title: string
  icon: any
  items: {
    title: string
    url: string
    icon: any
  }[]
}

type MenuItem = MenuItemSimple | MenuItemWithSub

// Dados do menu para diferentes tipos de usuário
const menuData: Record<string, MenuItem[]> = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: BarChart3,
    },
    {
      title: "Gerenciamento",
      icon: Settings,
      items: [
        {
          title: "Usuários",
          url: "/admin/usuarios",
          icon: Users,
        },
        {
          title: "Turmas",
          url: "/admin/turmas", 
          icon: School,
        },
        {
          title: "Professores",
          url: "/admin/professores",
          icon: GraduationCap,
        }
      ]
    },
    {
      title: "Relatórios",
      icon: FileText,
      items: [
        {
          title: "Frequência",
          url: "/admin/relatorios/frequencia",
          icon: UserCheck,
        },
        {
          title: "Notas",
          url: "/admin/relatorios/notas",
          icon: ClipboardList,
        }
      ]
    }
  ],
  professor: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Turmas",
      url: "/turmas",
      icon: School,
    },
    {
      title: "Frequência",
      url: "/frequencia",
      icon: UserCheck,
    },
    {
      title: "Notas",
      url: "/notas",
      icon: ClipboardList,
    },
    {
      title: "Disciplinas",
      url: "/disciplinas",
      icon: BookOpen,
    }
  ],
  secretaria: [
    {
      title: "Dashboard",
      url: "/secretaria-dashboard",
      icon: BarChart3,
    },
    {
      title: "Alunos",
      url: "/secretaria/alunos",
      icon: Users,
    },
    {
      title: "Matrículas",
      url: "/secretaria/matriculas",
      icon: FileText,
    },
    {
      title: "Relatórios",
      url: "/secretaria/relatorios",
      icon: ClipboardList,
    }
  ],
  responsavel: [
    {
      title: "Dashboard",
      url: "/responsavel-dashboard",
      icon: Home,
    },
    {
      title: "Calendário",
      url: "/responsavel/calendario",
      icon: Calendar,
    },
    {
      title: "Boletim",
      url: "/responsavel/boletim",
      icon: FileText,
    },
    {
      title: "Frequência",
      url: "/responsavel/frequencia",
      icon: UserCheck,
    }
  ]
}

interface AppSidebarProps {
  userType: 'admin' | 'professor' | 'secretaria' | 'responsavel'
  currentPath?: string
  onNavigate?: (path: string) => void
}

// Type guards
function hasItems(item: MenuItem): item is MenuItemWithSub {
  return 'items' in item
}

function hasUrl(item: MenuItem): item is MenuItemSimple {
  return 'url' in item
}

export function AppSidebar({ userType, currentPath, onNavigate }: AppSidebarProps) {
  const menuItems = menuData[userType] || []

  const handleClick = (url: string) => {
    if (onNavigate) {
      onNavigate(url)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error.message)
      } else {
        console.log('Logout realizado com sucesso')
        // O App.tsx irá detectar a mudança de auth state e redirecionar para login
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <School className="h-6 w-6 text-primary" />
          <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Portal Escolar
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (hasItems(item)) {
                  // Item com submenu
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              isActive={currentPath === subItem.url}
                              onClick={() => handleClick(subItem.url)}
                            >
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  )
                }

                if (hasUrl(item)) {
                  // Item simples
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        isActive={currentPath === item.url}
                        onClick={() => handleClick(item.url)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return null
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Configurações"
              onClick={() => handleClick('/configuracoes')}
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Sair"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
