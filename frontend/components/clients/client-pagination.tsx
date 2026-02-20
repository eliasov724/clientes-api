"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClientPaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function ClientPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: ClientPaginationProps) {
  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

  if (totalElements === 0) return null

  return (
    <div className="flex items-center justify-between px-1 py-4">
      <p className="text-sm text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium text-foreground">{startItem}</span>
        {" "}a{" "}
        <span className="font-medium text-foreground">{endItem}</span>
        {" "}de{" "}
        <span className="font-medium text-foreground">{totalElements}</span>
        {" "}resultados
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="h-8 px-2"
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
          if (
            totalPages <= 7 ||
            page === 0 ||
            page === totalPages - 1 ||
            Math.abs(page - currentPage) <= 1
          ) {
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="size-8 px-0 text-xs"
              >
                {page + 1}
              </Button>
            )
          }
          if (
            (page === 1 && currentPage > 3) ||
            (page === totalPages - 2 && currentPage < totalPages - 4)
          ) {
            return (
              <span key={page} className="px-1 text-muted-foreground text-xs">
                ...
              </span>
            )
          }
          return null
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="h-8 px-2"
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Página siguiente</span>
        </Button>
      </div>
    </div>
  )
}
