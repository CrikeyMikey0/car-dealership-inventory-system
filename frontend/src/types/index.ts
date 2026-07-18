export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedVehicles {
  data: Vehicle[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetVehiclesQuery {
  page?: number;
  limit?: number;
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  availability?: boolean;
  sortBy?: 'price' | 'make' | 'model' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchVehiclesQuery {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
