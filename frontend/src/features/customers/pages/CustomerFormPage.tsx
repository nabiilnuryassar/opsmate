import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMe } from '@/features/auth/api/auth-api'
import {
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from '../api/customers-api'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi.'),
  phone: z.string().optional(),
  email: z.union([z.string().email('Format email tidak valid.'), z.literal('')]).optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  customer_type: z.enum(['new', 'regular', 'vip', 'inactive']),
})

type FormValues = z.infer<typeof schema>

const TYPE_OPTIONS = [
  { value: 'new', label: 'Baru' },
  { value: 'regular', label: 'Langganan' },
  { value: 'vip', label: 'VIP' },
  { value: 'inactive', label: 'Tidak Aktif' },
] as const

export function CustomerFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const customerId = id ? Number(id) : undefined
  const isEdit = customerId != null

  const { data: user } = useMe()
  const { data: existing } = useCustomer(customerId)
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer(customerId ?? 0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: existing
      ? {
          name: existing.name,
          phone: existing.phone ?? '',
          email: existing.email ?? '',
          address: existing.address ?? '',
          notes: existing.notes ?? '',
          customer_type: existing.customer_type,
        }
      : { name: '', phone: '', email: '', address: '', notes: '', customer_type: 'new' },
  })

  const onSubmit = handleSubmit(async (values) => {
    const payload = { ...values, email: values.email || null }
    if (isEdit) await updateCustomer.mutateAsync(payload)
    else await createCustomer.mutateAsync(payload)
    navigate('/customers')
  })

  return (
    <AppShell
      greeting={isEdit ? 'Edit Customer' : 'Tambah Customer'}
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
          <Field label="Nama" error={errors.name?.message}>
            <input className="auth-input" {...register('name')} />
          </Field>
          <Field label="Nomor WhatsApp / HP">
            <input className="auth-input" inputMode="tel" {...register('phone')} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" className="auth-input" {...register('email')} />
          </Field>
          <Field label="Alamat">
            <textarea className="auth-input h-auto py-2" rows={2} {...register('address')} />
          </Field>
          <Field label="Catatan">
            <textarea className="auth-input h-auto py-2" rows={2} {...register('notes')} />
          </Field>
          <Field label="Tipe Customer">
            <select className="auth-input" {...register('customer_type')}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Customer'}
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
