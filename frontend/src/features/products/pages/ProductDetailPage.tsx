import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, SlidersHorizontal } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/StatusBadge'
import { formatRupiah } from '@/lib/utils'
import { useMe } from '@/features/auth/api/auth-api'
import { useProduct, useDeleteProduct } from '../api/products-api'
import { StockAdjustmentModal } from '../components/StockAdjustmentModal'
import { StockMovementHistory } from '../components/StockMovementHistory'

export function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const productId = id ? Number(id) : undefined
  const { data: user } = useMe()
  const { data: product, isLoading } = useProduct(productId)
  const deleteProduct = useDeleteProduct()
  const [stockModal, setStockModal] = useState(false)

  const onDelete = async () => {
    if (!productId) return
    if (!confirm('Hapus produk ini?')) return
    await deleteProduct.mutateAsync(productId)
    navigate('/products')
  }

  return (
    <AppShell
      greeting="Detail Produk"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-neutral-500"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>

      {isLoading || !product ? (
        <p className="text-sm text-neutral-500">Memuat...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{product.name}</h1>
                <p className="text-sm text-neutral-500">
                  {product.type === 'service' ? 'Layanan' : 'Produk'}
                  {product.category ? ` · ${product.category}` : ''}
                </p>
              </div>
              {product.is_low_stock && <Badge label="Stok Hampir Habis" tone="danger" />}
            </div>
            <p className="mt-3 text-2xl font-bold text-primary-700">
              {formatRupiah(product.price)}
            </p>
            {product.description && (
              <p className="mt-2 text-sm text-neutral-700">{product.description}</p>
            )}
          </Card>

          {product.type === 'product' && (
            <Card>
              <div className="flex items-center justify-between">
                <CardTitle>Stok</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => setStockModal(true)}>
                  <SlidersHorizontal className="h-4 w-4" />
                  Sesuaikan
                </Button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <Info label="Stok Saat Ini" value={`${product.stock ?? 0} ${product.unit ?? ''}`} />
                <Info label="Stok Minimum" value={`${product.minimum_stock ?? 0}`} />
              </div>
              <div className="mt-4 border-t border-neutral-100 pt-3">
                <p className="mb-2 text-xs font-semibold text-neutral-500">Riwayat Stok</p>
                <StockMovementHistory productId={product.id} />
              </div>
            </Card>
          )}

          {product.margin != null && (
            <Card>
              <CardTitle>Margin</CardTitle>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <Info label="Harga Modal" value={formatRupiah(product.cost_price ?? 0)} />
                <Info label="Margin / unit" value={formatRupiah(product.margin)} />
              </div>
            </Card>
          )}

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(`/products/${product.id}/edit`)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={deleteProduct.isPending}>
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      )}

      {product && (
        <StockAdjustmentModal
          productId={product.id}
          open={stockModal}
          onClose={() => setStockModal(false)}
        />
      )}
    </AppShell>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="font-semibold text-neutral-900">{value}</p>
    </div>
  )
}
