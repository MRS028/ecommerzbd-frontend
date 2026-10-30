import {
  IUser,
  CreateUserInput,
  UpdateProfileInput,
  UpdateUserInput,
  UserListQuery,
  PaginatedUsers,
  UserStatistics,
  Role,
  UserStatus,
} from "@/modules/user/types/user.types";
import api from "./api";

const BASE = "/users";

export const userApi = {
  getProfile: async (): Promise<IUser> => {
    const res = await api.get(`${BASE}/profile`);
    return res.data.data.user;
  },

  updateProfile: async (input: UpdateProfileInput): Promise<IUser> => {
    const res = await api.patch(`${BASE}/profile`, input);
    return res.data.data.user;
  },

  getUsers: async (query: UserListQuery = {}): Promise<PaginatedUsers> => {
    const res = await api.get(BASE, { params: query });
    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  },

  getUserStatistics: async (): Promise<UserStatistics> => {
    const res = await api.get(`${BASE}/statistics`);
    return res.data.data.statistics;
  },

  getUserById: async (id: string): Promise<IUser> => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data.data.user;
  },

  createUser: async (input: CreateUserInput): Promise<IUser> => {
    const res = await api.post(BASE, input);
    return res.data.data.user;
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<IUser> => {
    const res = await api.patch(`${BASE}/${id}`, input);
    return res.data.data.user;
  },

  updateUserRole: async (id: string, role: Role): Promise<IUser> => {
    const res = await api.patch(`${BASE}/${id}/role`, { role });
    return res.data.data.user;
  },

  updateUserStatus: async (id: string, status: UserStatus): Promise<IUser> => {
    const res = await api.patch(`${BASE}/${id}/status`, { status });
    return res.data.data.user;
  },

  banUser: async (id: string): Promise<void> => {
    await api.patch(`${BASE}/${id}/ban`);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/delete/${id}`);
  },
};
