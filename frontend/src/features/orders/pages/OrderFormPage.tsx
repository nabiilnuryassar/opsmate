import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { formatRupiah, cn } from '@/lib/utils'
import { useMe } from '@/features/auth/api/auth-api'
import { useCustomers } from '@/features/customers/api/customers-api'
import { useProducts } from '@/features/products/api/products-api'
import { useOrder, useCreateOrder, useUpdateOrder } from '../api/orders-api'
import type { OrderStatus, PaymentStatus } from '@/lib/status'

interface DraftItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
}

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'unpaid', label: 'Belum Bayar' },
  { value: 'partial', label: 'DP' },
  { value: 'paid', label: 'Lunas' },
]

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'Baru' },
  { value: 'processing', label: 'Diproses' },
  { value: 'completed', label: 'Selesai' },
]

export function OrderFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const orderId = id ? Number(id) : undefined
  const isEdit = orderId != null

  const { data: user } = useMe()
  const { data: existing } = useOrder(orderId)
  const { data: customersData } = useCustomers()
  const createOrder = useCreateOrder()
  const updateOrder = useUpdateOrder(orderId ?? 0)

  const [customerId, setCustomerId] = useState<number | ''>(
    searchParams.get('customer') ? Number(searchParams.get('customer')) : '',
  )
  const [items, setItems] = useState<DraftItem[]>([])
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid')
  const [status, setStatus] = useState<OrderStatus>('new')
  const [notes, setNotes] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hydrate from an existing order once when editing.
  if (isEdit && existing && !hydrated) {
    setCustomerId(existing.customer?.id ?? '')
    setItems(
      (existing.items ?? []).map((i) => ({
        product_id: i.product_id ?? 0,
        product_name: i.product_name,
        price: i.price,
        quantity: i.quantity,
      })),
    )
    setPaymentStatus(existing.payment_status)
    setStatus(existing.status)
    setNotes(existing.notes ?? '')
    setHydrated(true)
  }

  const { data: productsData } = useProducts({ search: productSearch || undefined })
  const customers = customersData?.data ?? []
  const products = productsData?.data ?? []

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  )

  const addProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === productId)
      if (existing) {
        return prev.map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]
    })
  }

  const setQuantity = (productId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    )
  }

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId))
  }

  const onSubmit = async () => {
    setError(null)
    if (!customerId) return setError('Pilih customer dulu.')
    if (items.length === 0) return setError('Tambah minimal 1 produk.')

    const payload = {
      customer_id: Number(customerId),
      status,
      payment_status: paymentStatus,
      notes: notes || null,
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price,
      })),
    }

    if (isEdit) await updateOrder.mutateAsync(payload)
    else await createOrder.mutateAsync(payload)
    navigate('/orders')
  }

  const isPending = createOrder.isPending || updateOrder.isPending

  return (
    <AppShell
      greeting={isEdit ? 'Edit Order' : 'Tambah Order Baru'}
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

      <div className="flex flex-col gap-5 pb-28">
        <Section title="Pelanggan">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : '')}
            className="auth-input"
          >
            <option value="">Pilih pelanggan...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/customers/new')}
            className="mt-2 text-sm font-semibold text-primary-700"
          >
            + Tambah Customer Baru
          </button>
        </Section>

        <Section title="Produk">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Cari atau pilih produk..."
              className="auth-input pl-9"
            />
          </div>

          {productSearch && (
            <div className="mt-2 flex flex-col gap-1">
              {products.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    addProduct(p.id)
                    setProductSearch('')
                  }}
                  className="flex items-center justify-between rounded-[12px] border border-neutral-200 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                >
                  <span>{p.name}</span>
                  <span className="text-neutral-500">{formatRupiah(p.price)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-2 rounded-[12px] border border-neutral-200 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-neutral-500">{formatRupiah(item.price)}</p>
                </div>
                <Stepper
                  quantity={item.quantity}
                  onDec={() => setQuantity(item.product_id, -1)}
                  onInc={() => setQuantity(item.product_id, 1)}
                />
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-neutral-400 hover:text-danger"
                  aria-label="Hapus item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-neutral-400">Belum ada produk dipilih.</p>
            )}
          </div>
        </Section>

        <Section title="Status Pembayaran">
          <Segmented
            options={PAYMENT_OPTIONS}
            value={paymentStatus}
            onChange={setPaymentStatus}
          />
        </Section>

        <Section title="Status Order">
          <Segmented options={STATUS_OPTIONS} value={status} onChange={setStatus} />
        </Section>

        <Section title="Catatan (Opsional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Catatan untuk order ini..."
            className="auth-input h-auto py-2"
          />
        </Section>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white px-4 py-3 lg:left-[260px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-neutral-500">Total Tagihan</p>
            <p className="text-lg font-bold text-neutral-900">{formatRupiah(total)}</p>
          </div>
          <Button onClick={onSubmit} disabled={isPending} className="min-w-40">
            {isPending ? 'Menyimpan...' : 'Simpan Order'}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">{title}</h3>
      {children}
    </section>
  )
}

function Stepper({
  quantity,
  onDec,
  onInc,
}: {
  quantity: number
  onDec: () => void
  onInc: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDec}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
        aria-label="Kurangi"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
      <button
        onClick={onInc}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
        aria-label="Tambah"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 rounded-[12px] border px-3 py-2 text-sm font-medium',
            value === o.value
              ? 'border-primary-700 bg-primary-50 text-primary-700'
              : 'border-neutral-200 text-neutral-500',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
