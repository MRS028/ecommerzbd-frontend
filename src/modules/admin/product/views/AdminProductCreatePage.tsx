import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ImageUploader } from '../../components/ImageUploader';
import { useProductForm } from '../controllers/useProductForm';
import { useCategories } from '@/modules/admin/category/controllers/useCategories';

// ✅ Backend-এর হুবহু shape
const schema = z.object({
  name: z.string().min(2, 'Name min 2 chars'),
  description: z.string().min(10, 'Description min 10 chars'),
  price: z.number().min(0, 'Price required'),
  basePrice: z.number().min(0, 'Base price required'),
  stock: z.number().min(0, 'Stock required'),
  sku: z.string().min(2, 'SKU required'),
  category: z.string().min(1, 'Category required'), // ObjectId
  images: z.array(z.string()).min(1, 'At least 1 image'),
  featured: z.boolean(),
});

type ProductFormValues = z.infer<typeof schema>;

export default function AdminProductCreatePage() {
  const { submit, loading } = useProductForm();
  const { items: categories, loading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      basePrice: 0,
      stock: 0,
      sku: '',
      category: '',
      images: [],
      featured: false,
    },
  });

  const images = watch('images');
  const selectedCategory = watch('category');

  return (
    <>
      <SEO title="Add Product" />
      <form
        onSubmit={handleSubmit((data) => submit(data))}
        className="space-y-6 max-w-4xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Name + SKU */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input {...register('name')} placeholder="New Product" />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input {...register('sku')} placeholder="DKGF" />
                {errors.sku && (
                  <p className="text-sm text-destructive mt-1">{errors.sku.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Product description here"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Price + BasePrice + Stock */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="99.99"
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Base Price</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('basePrice', { valueAsNumber: true })}
                  placeholder="522"
                />
                {errors.basePrice && (
                  <p className="text-sm text-destructive mt-1">{errors.basePrice.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="100"
                />
                {errors.stock && (
                  <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={(v) => v && setValue('category', v, { shouldValidate: true })}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category..." />
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
              {!categoriesLoading && categories.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  No categories found. Create one from{' '}
                  <a href="/admin/categories" className="text-primary underline">
                    Categories
                  </a>{' '}
                  first.
                </p>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured product
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold">Images</h3>
            <ImageUploader
              value={images}
              onChange={(urls) =>
                setValue('images', urls, { shouldValidate: true })
              }
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