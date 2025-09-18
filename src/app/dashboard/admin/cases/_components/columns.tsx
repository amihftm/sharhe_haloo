"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Case, User } from "@prisma/client"

// Define a type that includes the related User
export type CaseWithAuthor = Case & {
  author: User | null;
};


export const columns: ColumnDef<CaseWithAuthor>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عنوان کیس
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "specialty",
    header: "تخصص",
  },
  {
    accessorKey: "author.name",
    header: "ایجاد کننده",
    cell: ({ row }) => {
      return row.original.author?.name || 'نامشخص';
    }
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ایجاد",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      // Using Jalali date format for Persian locale
      return new Intl.DateTimeFormat('fa-IR').format(date)
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const caseData = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">باز کردن منو</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(caseData.id)}
            >
              کپی کردن شناسه کیس
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/admin/cases/edit/${caseData.id}`}>ویرایش</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href={`/cases/${caseData.id}`}>مشاهده</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
