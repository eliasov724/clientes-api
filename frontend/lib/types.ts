export interface Client {
  id: number
  firstName: string
  lastName: string
  phone: string
  email: string
  cuit: string
  businessName: string
  createdAt?: string
  updatedAt?: string
}

export interface ClientFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  cuit: string
  businessName: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ApiError {
  message: string
  status: number
}
