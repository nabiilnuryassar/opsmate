import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, Search, UserPlus, RotateCcw } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { formatRupiah, cn } from '@/lib/utils'
import { useMe } from '@/features/auth/api/auth-api'
import { useCustomers, useCreateCustomer } from '@/features/customers/api/customers-api'
import { useProducts } from '@/features/products/api/products-api'
import { useOrder, useCreateOrder, useUpdateOrder } from '../api/orders-api'
import type { OrderStatus, PaymentStatus } from '@/lib/status'

interface DraftItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
}

interface OrderTemplate {
  id: string
  name: string
  items: DraftItem[]
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

const MAX_TEMPLATES = 8

export function OrderFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const orderId = id ? Number(id) : undefined
  const isEdit = orderId != null

  const { data: user } = useMe()
  const { data: existing } = useOrder(orderId)
  const reorderId = !isEdit && searchParams.get('reorder') ? Number(searchParams.get('reorder')) : undefined
  const { data: reorderSource } = useOrder(reorderId)
  const { data: customersData } = useCustomers()
  const createCustomer = useCreateCustomer()
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
  const [hydratedFromExisting, setHydratedFromExisting] = useState(false)
  const [hydratedFromReorder, setHydratedFromReorder] = useState(false)

  const [showQuickCustomer, setShowQuickCustomer] = useState(false)
  const [quickCustomerName, setQuickCustomerName] = useState('')
  const [quickCustomerPhone, setQuickCustomerPhone] = useState('')

  const [templates, setTemplates] = useState<OrderTemplate[]>([])
  const [templateName, setTemplateName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const templateStorageKey = useMemo(
    () => `opsmate:order-templates:${user?.business?.id ?? 'default'}`,
    [user?.business?.id],
  )

  useEffect(() => {
    if (!isEdit || !existing || hydratedFromExisting) {
      return
    }

    setCustomerId(existing.customer?.id ?? '')
    setItems(
      (existing.items ?? [])
        .filter((item) => item.product_id != null)
        .map((item) => ({
          product_id: item.product_id ?? 0,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
    )
    setPaymentStatus(existing.payment_status)
    setStatus(existing.status)
    setNotes(existing.notes ?? '')
    setHydratedFromExisting(true)
  }, [existing, hydratedFromExisting, isEdit])

  useEffect(() => {
    if (isEdit || !reorderSource || hydratedFromReorder) {
      return
    }

    setCustomerId((prev) => prev || reorderSource.customer?.id || '')
    setItems(
      (reorderSource.items ?? [])
        .filter((item) => item.product_id != null)
        .map((item) => ({
          product_id: item.product_id ?? 0,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
    )
    setStatus('new')
    setPaymentStatus('unpaid')
    setNotes(reorderSource.notes ?? '')
    setHydratedFromReorder(true)
  }, [hydratedFromReorder, isEdit, reorderSource])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(templateStorageKey)
      if (!raw) {
        setTemplates([])
        return
      }

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        setTemplates([])
        return
      }

      const safeTemplates = parsed
        .filter((template) => template && typeof template.name === 'string' && Array.isArray(template.items))
        .map((template) => ({
          id: String(template.id ?? `${Date.now()}`),
          name: template.name,
          items: template.items
            .filter((item: DraftItem) => item?.product_id && item?.quantity > 0)
            .map((item: DraftItem) => ({
              product_id: item.product_id,
              product_name: item.product_name,
              price: item.price,
              quantity: item.quantity,
            })),
        }))
        .filter((template) => template.items.length > 0)
        .slice(0, MAX_TEMPLATES)

      setTemplates(safeTemplates)
    } catch {
      setTemplates([])
    }
  }, [templateStorageKey])

  useEffect(() => {
    localStorage.setItem(templateStorageKey, JSON.stringify(templates))
  }, [templateStorageKey, templates])

  const { data: productsData } = useProducts({ search: productSearch || undefined })
  const customers = customersData?.data ?? []
  const products = productsData?.data ?? []
  const quickProducts = products.slice(0, 6)

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const addProduct = (productId: number) => {
    const product = products.find((entry) => entry.id === productId)
    if (!product) {
      return
    }

    setItems((prev) => {
      const existingItem = prev.find((item) => item.product_id === productId)
      if (existingItem) {
        return prev.map((item) =>
          item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item,
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
        .map((item) =>
          item.product_id === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId))
  }

  const saveTemplate = () => {
    const name = templateName.trim()
    if (!name) {
      setError('Isi nama template dulu.')
      return
    }

    if (items.length === 0) {
      setError('Pilih produk dulu sebelum simpan template.')
      return
    }

    setTemplates((prev) => {
      const next = [
        {
          id:
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
              ? crypto.randomUUID()
              : `${Date.now()}`,
          name,
          items: items.map((item) => ({ ...item })),
        },
        ...prev.filter((template) => template.name.toLowerCase() !== name.toLowerCase()),
      ]
      return next.slice(0, MAX_TEMPLATES)
    })

    setTemplateName('')
    setError(null)
  }

  const applyTemplate = (template: OrderTemplate) => {
    setItems(template.items.map((item) => ({ ...item })))
    setError(null)
  }

  const removeTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId))
  }

  const onCreateInlineCustomer = async () => {
    const name = quickCustomerName.trim()
    if (!name) {
      setError('Nama customer cepat wajib diisi.')
      return
    }

    setError(null)
    const customer = await createCustomer.mutateAsync({
      name,
      phone: quickCustomerPhone.trim() || null,
      customer_type: 'new',
    })

    setCustomerId(customer.id)
    setQuickCustomerName('')
    setQuickCustomerPhone('')
    setShowQuickCustomer(false)
  }

  const onSubmit = async () => {
    setError(null)

    if (!customerId) {
      setError('Pilih customer dulu.')
      return
    }

    if (items.length === 0) {
      setError('Tambah minimal 1 produk.')
      return
    }

    const payload = {
      customer_id: Number(customerId),
      status,
      payment_status: paymentStatus,
      notes: notes || null,
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    if (isEdit) {
      await updateOrder.mutateAsync(payload)
    } else {
      await createOrder.mutateAsync(payload)
    }

    navigate('/orders')
  }

  const isPending = createOrder.isPending || updateOrder.isPending

  return (
    <AppShell
      greeting={isEdit ? 'Edit Order' : 'Quick Order'}
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
            onChange={(event) => setCustomerId(event.target.value ? Number(event.target.value) : '')}
            className="auth-input"
          >
            <option value="">Pilih pelanggan...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          {!showQuickCustomer ? (
            <button
              onClick={() => setShowQuickCustomer(true)}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-700"
            >
              <UserPlus className="h-4 w-4" /> Customer baru cepat
            </button>
          ) : (
            <div className="mt-3 rounded-[12px] border border-neutral-200 p-3">
              <p className="text-sm font-semibold text-neutral-900">Tambah customer cepat</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  value={quickCustomerName}
                  onChange={(event) => setQuickCustomerName(event.target.value)}
                  placeholder="Nama customer"
                  className="auth-input"
                />
                <input
                  value={quickCustomerPhone}
                  onChange={(event) => setQuickCustomerPhone(event.target.value)}
                  placeholder="No. WhatsApp"
                  className="auth-input"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={onCreateInlineCustomer}
                  disabled={createCustomer.isPending}
                >
                  {createCustomer.isPending ? 'Menyimpan...' : 'Simpan & Pilih'}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowQuickCustomer(false)}>
                  Batal
                </Button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Template Order">
          <div className="flex gap-2">
            <input
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="Contoh: Paket Meeting 10 Pax"
              className="auth-input"
            />
            <Button size="sm" onClick={saveTemplate} disabled={items.length === 0}>
              Simpan
            </Button>
          </div>

          {templates.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">
              Belum ada template. Pilih item order lalu simpan agar bisa dipakai ulang.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between gap-2 rounded-[12px] border border-neutral-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">{template.name}</p>
                    <p className="text-xs text-neutral-500">{template.items.length} item</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => applyTemplate(template)}>
                      <RotateCcw className="h-4 w-4" />
                      Gunakan
                    </Button>
                    <button
                      onClick={() => removeTemplate(template.id)}
                      className="rounded-[10px] border border-neutral-200 p-2 text-neutral-400 hover:text-danger"
                      aria-label={`Hapus template ${template.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Produk">
          {quickProducts.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-neutral-500">Pilih cepat</p>
              <div className="flex flex-wrap gap-2">
                {quickProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product.id)}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-primary-400 hover:text-primary-700"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative mt-3">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Cari atau pilih produk..."
              className="auth-input pl-9"
            />
          </div>

          {productSearch && (
            <div className="mt-2 flex flex-col gap-1">
              {products.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    addProduct(product.id)
                    setProductSearch('')
                  }}
                  className="flex items-center justify-between rounded-[12px] border border-neutral-200 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                >
                  <span>{product.name}</span>
                  <span className="text-neutral-500">{formatRupiah(product.price)}</span>
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
                  <p className="truncate text-sm font-semibold text-neutral-900">{item.product_name}</p>
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
          <Segmented options={PAYMENT_OPTIONS} value={paymentStatus} onChange={setPaymentStatus} />
        </Section>

        <Section title="Status Order">
          <Segmented options={STATUS_OPTIONS} value={status} onChange={setStatus} />
        </Section>

        <Section title="Catatan (Opsional)">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
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
  onChange: (value: T) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 rounded-[12px] border px-3 py-2 text-sm font-medium',
            value === option.value
              ? 'border-primary-700 bg-primary-50 text-primary-700'
              : 'border-neutral-200 text-neutral-500',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
