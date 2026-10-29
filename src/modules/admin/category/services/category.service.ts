import api from '@/shared/lib/api';
import { extractList, extractOne } from '@/shared/lib/api-response';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  fullPath?: string;
}

export const categoryAdminService = {
  async list() {
    const res = await api.get('/categories');
    return extractList<Category>(res);
  },
  async create(input: { name: string; isActive?: boolean; isFeatured?: boolean }) {
    const res = await api.post('/categories', input);
    return extractOne<Category>(res);
  },
  async update(id: string, input: Partial<Category>) {
    const res = await api.patch(`/categories/${id}`, input);
    return extractOne<Category>(res);
  },
  async remove(id: string) {
    // Do NOT swallow errors here — let caller catch and show modal.
    await api.delete(`/categories/${id}`);
  },
};