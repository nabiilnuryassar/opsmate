import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '@/components/ui/button'
import { useRegister } from '../api/auth-api'

const schema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi.'),
    business_name: z.string().min(1, 'Nama bisnis wajib diisi.'),
    email: z.string().min(1, 'Email wajib diisi.').email('Format email tidak valid.'),
    password: z.string().min(8, 'Password minimal 8 karakter.'),
    password_confirmation: z.string().min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Konfirmasi password tidak cocok.',
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const registerMut = useRegister()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerMut.mutateAsync(values)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 422) {
        const errors = err.response.data?.errors ?? {}
        for (const [field, msgs] of Object.entries(errors)) {
          setError(field as keyof FormValues, { message: (msgs as string[])[0] })
        }
      } else {
        setError('email', { message: 'Terjadi kesalahan. Coba lagi.' })
      }
    }
  })

  return (
    <AuthLayout
      title="Buat Akun"
      subtitle="Mulai rapikan operasional bisnismu"
      footer={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-primary-700">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Nama Lengkap" error={errors.name?.message}>
          <input className="auth-input" autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Nama Bisnis" error={errors.business_name?.message}>
          <input className="auth-input" {...register('business_name')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className="auth-input" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            className="auth-input"
            autoComplete="new-password"
            {...register('password')}
          />
        </Field>
        <Field label="Konfirmasi Password" error={errors.password_confirmation?.message}>
          <input
            type="password"
            className="auth-input"
            autoComplete="new-password"
            {...register('password_confirmation')}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Daftar & Mulai'}
        </Button>
      </form>
    </AuthLayout>
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
