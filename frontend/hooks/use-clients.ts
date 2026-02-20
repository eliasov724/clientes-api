"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import type { Client, ClientFormData, PaginatedResponse } from "@/lib/types"
import { clientApi } from "@/lib/api"
import { mockClients } from "@/lib/mock-data"

const PAGE_SIZE = 10

function useMockFallback() {
  const dataRef = useRef<Client[]>([...mockClients])
  const nextIdRef = useRef(mockClients.length + 1)

  const getAll = useCallback(
    (page: number, size: number, search?: string): PaginatedResponse<Client> => {
      let filtered = dataRef.current
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (c) =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.businessName.toLowerCase().includes(q) ||
            c.cuit.includes(q)
        )
      }
      const start = page * size
      const content = filtered.slice(start, start + size)
      return {
        content,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        size,
        number: page,
        first: page === 0,
        last: start + size >= filtered.length,
      }
    },
    []
  )

  const create = useCallback((data: ClientFormData): Client => {
    const newClient: Client = {
      ...data,
      id: nextIdRef.current++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dataRef.current = [newClient, ...dataRef.current]
    return newClient
  }, [])

  const update = useCallback((id: number, data: ClientFormData): Client => {
    const idx = dataRef.current.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Client not found")
    const updated = { ...dataRef.current[idx], ...data, updatedAt: new Date().toISOString() }
    dataRef.current = [...dataRef.current]
    dataRef.current[idx] = updated
    return updated
  }, [])

  const remove = useCallback((id: number) => {
    dataRef.current = dataRef.current.filter((c) => c.id !== id)
  }, [])

  const getById = useCallback((id: number): Client | undefined => {
    return dataRef.current.find((c) => c.id === id)
  }, [])

  const search = useCallback((query: string): Client[] => {
    const q = query.toLowerCase()
    return dataRef.current
      .filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q)
      )
      .slice(0, 5)
  }, [])

  return { getAll, create, update, remove, getById, search }
}

export function useClients() {
  const [data, setData] = useState<PaginatedResponse<Client> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [useMock, setUseMock] = useState(false)
  const mock = useMockFallback()

  const fetchClients = useCallback(
    async (page: number = 0, search?: string) => {
      setLoading(true)
      setError(null)

      try {
        let result

        if (search && search.trim() !== "") {
          console.log("Llamando SEARCH...")
          result = await clientApi.search(search, page, PAGE_SIZE)
        } else {
          console.log("Llamando GET ALL...")
          result = await clientApi.getAll(page, PAGE_SIZE)
        }

        startTransition(() => {
          setData(result)
        })

      } catch (err) {
        console.error("ERROR REAL DEL BACKEND:", err)
        setError(
          err instanceof Error
            ? err.message
            : "Error inesperado al traer clientes"
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createClient = useCallback(
    async (formData: ClientFormData): Promise<Client> => {
      if (useMock) {
        return mock.create(formData)
      }
      return clientApi.create(formData)
    },
    [useMock, mock]
  )

  const updateClient = useCallback(
    async (id: number, formData: ClientFormData): Promise<Client> => {
      if (useMock) {
        return mock.update(id, formData)
      }
      return clientApi.update(id, formData)
    },
    [useMock, mock]
  )

  const deleteClient = useCallback(
    async (id: number): Promise<void> => {
      if (useMock) {
        mock.remove(id)
        return
      }
      return clientApi.delete(id)
    },
    [useMock, mock]
  )

  const getClient = useCallback(
    async (id: number): Promise<Client | undefined> => {
      if (useMock) {
        return mock.getById(id)
      }
      try {
        return await clientApi.getById(id)
      } catch {
        return undefined
      }
    },
    [useMock, mock]
  )

 const searchClients = useCallback(
   async (query: string): Promise<Client[]> => {
     if (useMock) {
       return mock.search(query)
     }
     try {
       const response = await clientApi.search(query, 0, 5)
       return response.content   // 🔥 ESTA ES LA CLAVE
     } catch {
       return mock.search(query)
     }
   },
   [useMock, mock]
 )
  return {
    data,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClient,
    searchClients,
  }
}
