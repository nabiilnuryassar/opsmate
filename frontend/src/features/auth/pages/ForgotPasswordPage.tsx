import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().min(1, 'Email wajib diisi.').email('Format email tidak valid.'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    // The API always responds success to avoid leaking which emails exist.
    await api.post('/forgot-password', values).catch(() => undefined)
    setSent(true)
  })

  return (
    <AuthLayout
      title="Lupa Password"
      subtitle="Kami akan kirim link reset ke emailmu"
      footer={
        <Link to="/login" className="font-semibold text-primary-700">
          Kembali ke Masuk
        </Link>
      }
    >
      {sent ? (
        <p className="text-center text-sm text-neutral-700">
          Link reset password sudah dikirim ke email kamu. Cek inbox ya.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Email</span>
            <input type="email" className="auth-input" autoComplete="email" {...register('email')} />
            {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
