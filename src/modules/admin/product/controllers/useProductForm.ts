import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  productAdminService,
  CreateProductInput,
} from '../services/product.admin.service';

export function useProductForm(
  initial?: Partial<CreateProductInput> & { _id?: string }
) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial?._id;

  const submit = async (data: CreateProductInput) => {
    setLoading(true);
    try {
      if (isEdit && initial?._id) {
        await productAdminService.update(initial._id, data);
        toast.success('Product updated');
      } else {
        await productAdminService.create(data);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errors?.[0]?.message ||
        e?.message ||
        'Save failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, isEdit };
}