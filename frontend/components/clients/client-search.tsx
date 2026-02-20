"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Client } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ClientSearchProps {
  onSearch: (query: string) => void
  onSelectClient: (client: Client) => void
  searchFn: (query: string) => Promise<Client[]>
}

export function ClientSearch({ onSearch, onSelectClient, searchFn }: ClientSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Client[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const results = await searchFn(q)
      setSuggestions(results)
    } catch {
      setSuggestions([])
    }
  }, [searchFn])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query)
      onSearch(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSuggestions, onSearch])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      onSelectClient(suggestions[highlightedIndex])
      setShowSuggestions(false)
      setQuery("")
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar clientes por nombre, email, CUIT..."
          className="pl-9 pr-9 h-10 bg-card"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setSuggestions([])
              setShowSuggestions(false)
              onSearch("")
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
            <span className="sr-only">Limpiar búsqueda</span>
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <ul className="py-1" role="listbox">
            {suggestions.map((client, idx) => (
              <li
                key={client.id}
                role="option"
                aria-selected={idx === highlightedIndex}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                  idx === highlightedIndex ? "bg-accent" : "hover:bg-muted"
                )}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => {
                  onSelectClient(client)
                  setShowSuggestions(false)
                  setQuery("")
                }}
              >
                <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                  {client.firstName[0]}
                  {client.lastName[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-card-foreground truncate">
                    {client.firstName} {client.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {client.businessName} &middot; {client.email}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
