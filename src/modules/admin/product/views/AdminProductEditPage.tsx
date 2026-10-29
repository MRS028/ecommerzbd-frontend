import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ImageUploader } from '../../components/ImageUploader';
import { useProductForm } from '../controllers/useProductForm';
import { productAdminService } from '../services/product.admin.service';
import { useCategories } from '@/modules/admin/category/controllers/useCategories';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(0),
  basePrice: z.number().min(0),
  stock: z.number().min(0),
  sku: z.string().min(2),
  category: z.string().min(1),
  images: z.array(z.string()).min(1),
  featured: z.boolean(),
});

type ProductFormValues = z.infer<typeof schema>;

export default function AdminProductEditPage() {
  const { id } = useParams();
  const [fetching, setFetching] = useState(true);
  const [initialProduct, setInitialProduct] = useState<any>(null);
  const { submit, loading } = useProductForm(initialProduct);
  const { items: categories, loading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', description: '', price: 0, basePrice: 0,
      stock: 0, sku: '', category: '', images: [], featured: false,
    },
  });

  const images = watch('images') || [];
  const selectedCategory = watch('category');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const p = await productAdminService.getById(id);
        setInitialProduct({ ...p, _id: p._id });

        // category যদি object হয়, _id বের করুন
        const categoryId =
          typeof p.category === 'string'
            ? p.category
            : p.category?._id ?? '';

        reset({
          name: p.name,
          description: p.description,
          price: Number(p.price ?? p.basePrice ?? 0),
          basePrice: Number(p.basePrice ?? p.price ?? 0),
          stock: Number(p.stock ?? p.totalStock ?? 0),
          sku: p.sku ?? '',
          category: categoryId,
          images: p.images ?? [],
          featured: Boolean(p.featured ?? p.isFeatured ?? false),
        });
      } finally {
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (fetching) {
    return (
      <div className="space-y-4 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Edit Product" />
      <form
        onSubmit={handleSubmit((data) => submit(data))}
        className="space-y-6 max-w-4xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input {...register('sku')} />
                {errors.sku && (
                  <p className="text-sm text-destructive mt-1">{errors.sku.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              </div>
              <div>
                <label className="text-sm font-medium">Base Price</label>
                <Input type="number" step="0.01" {...register('basePrice', { valueAsNumber: true })} />
              </div>
              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" {...register('stock', { valueAsNumber: true })} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={(v) => v && setValue('category', v, { shouldValidate: true })}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="featured" className="text-sm font-medium">Featured</label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold">Images</h3>
            <ImageUploader
              value={images}
              onChange={(urls) => setValue('images', urls, { shouldValidate: true })}
            />
            {errors.images && (
              <p className="text-sm text-destructive">{errors.images.message}</p>
            )}
          </CardContent>
        </Card>
      </form>
    </>
  );
}