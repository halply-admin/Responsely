import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@workspace/ui/components/breadcrumb";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { Provider } from "jotai";

export const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";
    
    return (
        <AuthGuard>
          <OrganizationGuard>
            <Provider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <DashboardSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </header>
                  <main className="flex flex-1 flex-col overflow-hidden">
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </Provider>
          </OrganizationGuard>
        </AuthGuard>       
      )
}