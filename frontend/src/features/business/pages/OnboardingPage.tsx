import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BUSINESS_CATEGORIES } from '../types'
import { useBusiness, useUpdateBusiness } from '../api/business-api'

const schema = z.object({
  name: z.string().min(1, 'Nama bisnis wajib diisi.'),
  category: z.string().min(1, 'Pilih kategori bisnis.'),
  phone: z.string().min(1, 'Nomor WhatsApp wajib diisi.'),
  city: z.string().min(1, 'Kota wajib diisi.'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const STEPS = ['Profil Bisnis', 'Jenis Layanan', 'Selesai'] as const

export function OnboardingPage() {
  const navigate = useNavigate()
  const { data: business } = useBusiness()
  const updateBusiness = useUpdateBusiness()
  const [step, setStep] = useState(0)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: business
      ? {
          name: business.name,
          category: business.category ?? '',
          phone: business.phone ?? '',
          city: business.city ?? '',
          description: business.description ?? '',
        }
      : undefined,
  })

  const next = async () => {
    const fields: (keyof FormValues)[] =
      step === 0 ? ['name', 'category', 'phone', 'city'] : ['description']
    if (await trigger(fields)) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const onSubmit = handleSubmit(async (values) => {
    await updateBusiness.mutateAsync(values)
    navigate('/', { replace: true })
  })

  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-[460px]">
        <div className="mb-6 flex items-center justify-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  i <= step ? 'bg-primary-700 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`h-0.5 w-8 ${i < step ? 'bg-primary-700' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-[16px] border border-neutral-200 bg-white p-6 shadow-sm">
          <form onSubmit={onSubmit} noValidate>
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <Header title="Profil Bisnis" subtitle="Informasi ini membantu AI memahami bisnis kamu." />
                <Field label="Nama Bisnis" error={errors.name?.message}>
                  <input className="auth-input" {...register('name')} />
                </Field>
                <Field label="Kategori Bisnis" error={errors.category?.message}>
                  <select className="auth-input" {...register('category')}>
                    <option value="">Pilih kategori</option>
                    {BUSINESS_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Nomor WhatsApp" error={errors.phone?.message}>
                  <input className="auth-input" inputMode="tel" {...register('phone')} />
                </Field>
                <Field label="Kota" error={errors.city?.message}>
                  <input className="auth-input" {...register('city')} />
                </Field>
                <Button type="button" onClick={next}>
                  Lanjut
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <Header title="Jenis Layanan" subtitle="Ceritakan sedikit tentang bisnismu (opsional)." />
                <Field label="Deskripsi Singkat" error={errors.description?.message}>
                  <textarea
                    className="auth-input h-auto py-2"
                    rows={4}
                    placeholder="Contoh: Catering rumahan untuk acara kantor dan keluarga."
                    {...register('description')}
                  />
                </Field>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                    Kembali
                  </Button>
                  <Button type="button" className="flex-1" onClick={next}>
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900">Bisnismu siap!</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    Bisnis kamu sudah siap dicatat. Mulai dari input order pertama. Nanti saya bantu
                    buat laporan harian.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    Kembali
                  </Button>
                  <Button type="submit" className="flex-1" disabled={updateBusiness.isPending}>
                    {updateBusiness.isPending ? 'Menyimpan...' : 'Mulai Kelola Bisnis'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
    </div>
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
