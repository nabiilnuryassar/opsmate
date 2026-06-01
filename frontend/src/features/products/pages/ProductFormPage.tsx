import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMe } from '@/features/auth/api/auth-api'
import { useProduct, useCreateProduct, useUpdateProduct } from '../api/products-api'
import type { ProductPayload } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi.'),
  type: z.enum(['product', 'service']),
  category: z.string().optional(),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif.'),
  cost_price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0).optional(),
  minimum_stock: z.coerce.number().min(0).optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
})

type FormValues = z.input<typeof schema>

export function ProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const productId = id ? Number(id) : undefined
  const isEdit = productId != null

  const { data: user } = useMe()
  const { data: existing } = useProduct(productId)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(productId ?? 0)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: existing
      ? {
          name: existing.name,
          type: existing.type,
          category: existing.category ?? '',
          price: existing.price,
          cost_price: existing.cost_price ?? undefined,
          stock: existing.stock ?? undefined,
          minimum_stock: existing.minimum_stock ?? undefined,
          unit: existing.unit ?? '',
          description: existing.description ?? '',
          is_active: existing.is_active,
        }
      : {
          name: '',
          type: 'product',
          category: '',
          price: 0,
          unit: '',
          description: '',
          is_active: true,
        },
  })

  const type = watch('type')
  const isService = type === 'service'

  const onSubmit = handleSubmit(async (values) => {
    const payload = values as unknown as ProductPayload
    if (isEdit) await updateProduct.mutateAsync(payload)
    else await createProduct.mutateAsync(payload)
    navigate('/products')
  })

  return (
    <AppShell
      greeting={isEdit ? 'Edit Produk' : 'Tambah Produk'}
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

      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Nama Produk / Layanan" error={errors.name?.message}>
            <input className="auth-input" {...register('name')} />
          </Field>

          <Field label="Tipe">
            <select className="auth-input" {...register('type')}>
              <option value="product">Produk</option>
              <option value="service">Layanan</option>
            </select>
          </Field>

          <Field label="Kategori">
            <input className="auth-input" {...register('category')} />
          </Field>

          <Field label="Harga Jual" error={errors.price?.message}>
            <input type="number" inputMode="numeric" className="auth-input" {...register('price')} />
          </Field>

          <Field label="Harga Modal (opsional)">
            <input
              type="number"
              inputMode="numeric"
              className="auth-input"
              {...register('cost_price')}
            />
          </Field>

          {!isService && (
            <>
              <Field label="Stok">
                <input
                  type="number"
                  inputMode="numeric"
                  className="auth-input"
                  {...register('stock')}
                />
              </Field>
              <Field label="Stok Minimum">
                <input
                  type="number"
                  inputMode="numeric"
                  className="auth-input"
                  {...register('minimum_stock')}
                />
              </Field>
              <Field label="Satuan (pcs, kg, porsi)">
                <input className="auth-input" {...register('unit')} />
              </Field>
            </>
          )}

          <Field label="Deskripsi">
            <textarea className="auth-input h-auto py-2" rows={2} {...register('description')} />
          </Field>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input type="checkbox" {...register('is_active')} />
            Produk aktif
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
          </Button>
        </form>
      </Card>
    </AppShell>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  )
}
