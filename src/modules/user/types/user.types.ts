export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface IAuthProvider {
  provider: 'google' | 'facebook' | 'twitter' | 'github' | 'credentials';
  providerId: string;
}

export interface IAddress {
  _id?: string;
  type?: 'shipping' | 'billing';
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zila?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  picture?: string;
  avatar?: string;
  address?: string;
  addresses?: IAddress[];
  isDeleted?: boolean;
  isActive?: UserStatus;
  isVerified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role: Role;
  status?: UserStatus;
  auths?: IAuthProvider[];
  lastLogin?: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
  phone?: string;
}

export interface UpdateProfileInput {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  addresses?: IAddress[];
}

export interface UpdateUserInput extends UpdateProfileInput {
  email?: string;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  role?: Role;
  status?: UserStatus;
  search?: string;
  emailVerified?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedUsers {
  data: IUser[];
  pagination: PaginationMeta;
}

export interface UserStatistics {
  total: number;
  byRole: Record<Role, number>;
  byStatus: Record<UserStatus, number>;
  newThisMonth: number;
}