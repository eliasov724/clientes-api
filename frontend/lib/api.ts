import type { Client, ClientFormData, PaginatedResponse } from "./types"

const API_BASE_URL = "http://localhost:8080/api/clientes"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Error inesperado",
    }))
    throw new Error(error.message || `HTTP error ${response.status}`)
  }
  return response.json()
}

export const clientApi = {

  async getAll(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Client>> {

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })

    const response = await fetch(
      `${API_BASE_URL}?${params}`
    )

    return handleResponse<PaginatedResponse<Client>>(response)
  },

  async getById(id: number): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    return handleResponse<Client>(response)
  },

  async create(data: ClientFormData): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse<Client>(response)
  },

  async update(id: number, data: ClientFormData): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse<Client>(response)
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Error al eliminar cliente",
      }))
      throw new Error(error.message || `HTTP error ${response.status}`)
    }
  },

async search(
  query: string,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<Client>> {

  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    size: size.toString(),
  })

  const response = await fetch(
    `${API_BASE_URL}/search?${params}`
  )

  return handleResponse<PaginatedResponse<Client>>(response)
}
  }
