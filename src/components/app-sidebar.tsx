// "use client"

// import * as React from "react"

// import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: (
//         <LayoutDashboardIcon
//         />
//       ),
//     },
//     {
//       title: "createtrip",
//       url: "/dashboard/createtrip",
//       icon: (
//         <ListIcon
//         />
//       ),
//     },
//     {
//       title: "mytrip",
//       url: "/dashboard/mytrip",
//       icon: (
//         <ChartBarIcon
//         />
//       ),
//     },
//     {
//       title: "itinerary",
//       url: "/dashboard/itinerary",
//       icon: (
//         <FolderIcon
//         />
//       ),
//     },
//     {
//       title: "trip-notes",
//       url: "/dashboard/trip-notes",
//       icon: (
//         <FolderIcon
//         />
//       ),
//     },
//     {
//       title: "citysearch",
//       url: "/dashboard/citysearch",
//       icon: (
//         <UsersIcon
//         />
//       ),
//     },
//   ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: (
//         <CameraIcon
//         />
//       ),
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: (
//         <FileTextIcon
//         />
//       ),
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: (
//         <FileTextIcon
//         />
//       ),
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Settings",
//       url: "#",
//       icon: (
//         <Settings2Icon
//         />
//       ),
//     },
//     {
//       title: "Get Help",
//       url: "#",
//       icon: (
//         <CircleHelpIcon
//         />
//       ),
//     },
//     {
//       title: "Search",
//       url: "#",
//       icon: (
//         <SearchIcon
//         />
//       ),
//     },
//   ],
//   documents: [
//     {
//       name: "Data Library",
//       url: "#",
//       icon: (
//         <DatabaseIcon
//         />
//       ),
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: (
//         <FileChartColumnIcon
//         />
//       ),
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: (
//         <FileIcon
//         />
//       ),
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:p-1.5!"
//             >
//               <a href="#">
//                 <CommandIcon className="size-5!" />
//                 <span className="text-base font-semibold">Acme Inc.</span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         <NavDocuments items={data.documents} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }

"use client"

import * as React from "react"
import Link from "next/link"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  LayoutDashboardIcon,
  MapPlusIcon,
  PlaneTakeoffIcon,
  CalendarDaysIcon,
  MapPinnedIcon,
  SearchIcon,
  WalletIcon,
  NotebookPenIcon,
  PackageCheckIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  CommandIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Urvil Patel",
    email: "urvil@example.com",
    avatar: "/avatars/user.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon className="size-4" />,
    },
    {
      title: "Create Trip",
      url: "/dashboard/createtrip",
      icon: <MapPlusIcon className="size-4" />,
    },
    {
      title: "My Trips",
      url: "/dashboard/mytrip",
      icon: <PlaneTakeoffIcon className="size-4" />,
    },
    {
      title: "Itinerary",
      url: "/dashboard/itinerary",
      icon: <CalendarDaysIcon className="size-4" />,
    },
    {
      title: "City Search",
      url: "/dashboard/citysearch",
      icon: <MapPinnedIcon className="size-4" />,
    },
    {
      title: "Activity Search",
      url: "/dashboard/activity-search",
      icon: <SearchIcon className="size-4" />,
    },
    {
      title: "Trip Budget",
      url: "/trip-budget",
      icon: <WalletIcon className="size-4" />,
    },
    {
      title: "Trip Notes",
      url: "/trip-notes",
      icon: <NotebookPenIcon className="size-4" />,
    },
    {
      title: "Packing Checklist",
      url: "/packing-checklist",
      icon: <PackageCheckIcon className="size-4" />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/user-profile",
      icon: <Settings2Icon className="size-4" />,
    },
    {
      title: "Help",
      url: "/about",
      icon: <CircleHelpIcon className="size-4" />,
    },
    {
      title: "Search",
      url: "/dashboard/activity-search",
      icon: <SearchIcon className="size-4" />,
    },
  ],

  documents: [
    {
      name: "Data Library",
      url: "/dashboard/data-library",
      icon: <DatabaseIcon className="size-4" />,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: <FileChartColumnIcon className="size-4" />,
    },
    {
      name: "Word Assistant",
      url: "/dashboard/wordassistant",
      icon: <FileTextIcon className="size-4" />,
    },
  ],
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <CommandIcon className="size-5" />
                <span className="text-base font-semibold">
                  Traveloop
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavDocuments items={data.documents} />

        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}