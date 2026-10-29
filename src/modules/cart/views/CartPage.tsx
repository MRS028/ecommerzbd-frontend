import { Link } from 'react-router-dom';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { useCart } from '../controllers/useCart';
import { formatPrice } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/lib/constants';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();

  return (
    <>
      <SEO title="Shopping Cart" canonical="/cart" />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty.</p>
              <Link to={ROUTES.PRODUCTS}><Button>Continue Shopping</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.productId}-${item.variantId}`}>
                  <CardContent className="p-4 flex gap-4">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline"
                          onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}>−</Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="sm" variant="outline"
                          onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}>+</Button>
                        <Button size="sm" variant="destructive" className="ml-auto"
                          onClick={() => removeItem(item.productId, item.variantId)}>Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="h-fit">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <Button className="w-full" size="lg">Checkout</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </>
  );
}