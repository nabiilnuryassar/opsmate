import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '@/components/ui/button'
import { useLogin } from '../api/auth-api'

const schema = z.object({
  email: z.string().min(1, 'Email wajib diisi.').email('Format email tidak valid.'),
  password: z.string().min(1, 'Password wajib diisi.'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
      navigate('/', { replace: true })
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.errors?.email?.[0] ?? 'Email atau password salah.')
        : 'Terjadi kesalahan. Coba lagi.'
      setError('email', { message })
    }
  })

  return (
    <AuthLayout
      title="OpsMate AI"
      subtitle="Masuk untuk mengelola bisnismu"
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-primary-700">
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className="auth-input"
            {...register('email')}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="current-password"
            className="auth-input"
            {...register('password')}
          />
        </Field>

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary-700">
            Lupa password?
          </Link>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Masuk'}
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
