import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LibraryBigIcon } from "lucide-react";
import Link from "next/link";

export function AppSidebarLogo() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {/* display smrtStudy and a book icon. this will be the main application logo so make it look clean */}
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <Link href="/dashboard">
              <LibraryBigIcon className="!size-5" />
              <span className="text-base font-semibold">SmrtStudy</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
