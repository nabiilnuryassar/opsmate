import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/shared/LoadingState'
import { useMe } from '@/features/auth/api/auth-api'
import { BUSINESS_CATEGORIES } from '@/features/business/types'
import { useBusiness, useUpdateBusiness } from '@/features/business/api/business-api'

const schema = z.object({
  name: z.string().min(1, 'Nama bisnis wajib diisi.'),
  category: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function BusinessProfilePage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { data: business, isLoading } = useBusiness()
  const updateBusiness = useUpdateBusiness()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: business
      ? {
          name: business.name,
          category: business.category ?? '',
          phone: business.phone ?? '',
          city: business.city ?? '',
          address: business.address ?? '',
          description: business.description ?? '',
          currency: business.currency ?? 'IDR',
        }
      : undefined,
  })

  const onSubmit = handleSubmit(async (values) => {
    await updateBusiness.mutateAsync(values)
  })

  return (
    <AppShell
      greeting="Pengaturan"
      businessName={business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <Card>
        <CardTitle>Profil Bisnis</CardTitle>
        {isLoading ? (
          <LoadingState message="Memuat profil bisnis..." className="py-4" />
        ) : (
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4" noValidate>
            <Field label="Nama Bisnis" error={errors.name?.message}>
              <input className="auth-input" {...register('name')} />
            </Field>
            <Field label="Kategori">
              <select className="auth-input" {...register('category')}>
                <option value="">Pilih kategori</option>
                {BUSINESS_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nomor WhatsApp">
              <input className="auth-input" inputMode="tel" {...register('phone')} />
            </Field>
            <Field label="Kota">
              <input className="auth-input" {...register('city')} />
            </Field>
            <Field label="Alamat">
              <textarea className="auth-input h-auto py-2" rows={3} {...register('address')} />
            </Field>
            <Field label="Deskripsi">
              <textarea className="auth-input h-auto py-2" rows={3} {...register('description')} />
            </Field>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={updateBusiness.isPending || !isDirty}>
                {updateBusiness.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              {updateBusiness.isSuccess && !isDirty && (
                <span className="text-sm text-success">Tersimpan.</span>
              )}
            </div>
          </form>
        )}
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
