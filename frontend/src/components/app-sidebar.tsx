import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  UsersIcon,
  PackageSearchIcon,
  ChartBarIcon,
  FileWarningIcon,
  BookIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
} from "lucide-react";

const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <ChartBarIcon />,
    },
    {
      title: "Products",
      url: "/productmanage",
      icon: <PackageSearchIcon />,
    },
    {
      title: "Orders",
      url: "/orderList",
      icon: <FileWarningIcon />,
    },
    {
      title: "Customers",
      url: "/customer",
      icon: <UsersIcon />,
    },
  ],
  documents: [
    {
      name: "Reports",
      url: "/admin/reports",
      icon: <BookIcon />,
    },
    {
      name: "System Logs",
      url: "/admin/logs",
      icon: <FileWarningIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Help",
      url: "/help",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                {/* <CommandIcon className="size-5!" /> */}
                <img
                  src="./src/assets/Logo.JPG"
                  alt="logo"
                  className="size-7!"
                />
                <span className="text-base font-semibold">TeaHerbShop</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
