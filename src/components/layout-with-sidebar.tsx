import { type ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { useNavigation } from "../contexts/NavigationContext"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface LayoutWithSidebarProps {
  children: ReactNode
  userType: 'admin' | 'professor' | 'secretaria' | 'responsavel'
  currentPath?: string
  breadcrumbs?: Array<{
    title: string
    url?: string
  }>
}

export function LayoutWithSidebar({ 
  children, 
  userType, 
  currentPath,
  breadcrumbs = []
}: LayoutWithSidebarProps) {
  const { navigate } = useNavigation();

  return (
    <SidebarProvider>
      <AppSidebar userType={userType} currentPath={currentPath} onNavigate={navigate} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={index}>
                      {breadcrumb.url ? (
                        <BreadcrumbLink href={breadcrumb.url}>
                          {breadcrumb.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
