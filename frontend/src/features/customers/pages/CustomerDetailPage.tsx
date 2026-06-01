import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, MessageCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { CustomerTypeBadge } from '@/components/shared/StatusBadge'
import { useMe } from '@/features/auth/api/auth-api'
import { AIInsightCard } from '@/features/ai/components/AIInsightCard'
import { FollowUpMessageModal } from '@/features/reminders/components/FollowUpMessageModal'
import { generateFollowUp } from '@/features/ai/api/ai-api'
import { useCustomer, useDeleteCustomer } from '../api/customers-api'

export function CustomerDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const customerId = id ? Number(id) : undefined
  const { data: user } = useMe()
  const { data: customer, isLoading } = useCustomer(customerId)
  const deleteCustomer = useDeleteCustomer()
  const [fuOpen, setFuOpen] = useState(false)
  const [fuMessage, setFuMessage] = useState('')
  const [fuLoading, setFuLoading] = useState(false)

  const onFollowUp = async () => {
    if (!customerId) return
    setFuMessage('')
    setFuLoading(true)
    setFuOpen(true)
    try {
      setFuMessage(await generateFollowUp({ customer_id: customerId, type: 'reorder' }))
    } finally {
      setFuLoading(false)
    }
  }

  const onDelete = async () => {
    if (!customerId) return
    if (!confirm('Hapus customer ini?')) return
    await deleteCustomer.mutateAsync(customerId)
    navigate('/customers')
  }

  return (
    <AppShell
      greeting="Detail Customer"
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

      {isLoading || !customer ? (
        <p className="text-sm text-neutral-500">Memuat...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{customer.name}</h1>
                <p className="text-sm text-neutral-500">{customer.phone ?? '-'}</p>
                {customer.email && (
                  <p className="text-sm text-neutral-500">{customer.email}</p>
                )}
              </div>
              <CustomerTypeBadge type={customer.customer_type} />
            </div>
            {customer.address && (
              <p className="mt-3 text-sm text-neutral-700">{customer.address}</p>
            )}

            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate(`/orders/new?customer=${customer.id}`)}
              >
                Buat Order
              </Button>
              {customer.phone && (
                <a
                  href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" variant="secondary">
                    <MessageCircle className="h-4 w-4" />
                    Follow-up
                  </Button>
                </a>
              )}
            </div>
          </Card>

          {customer.customer_type === 'inactive' && (
            <AIInsightCard
              text={`${customer.name} sudah lama tidak order. Mau saya bantu buatkan pesan untuk mengajak order lagi?`}
              actionLabel="Buat Pesan"
              onAction={onFollowUp}
            />
          )}

          {customer.notes && (
            <Card>
              <CardTitle>Catatan</CardTitle>
              <p className="mt-2 text-sm text-neutral-700">{customer.notes}</p>
            </Card>
          )}

          <Card>
            <CardTitle>Riwayat Order</CardTitle>
            <p className="mt-2 text-sm text-neutral-500">
              Riwayat order akan tampil di sini setelah customer memiliki order.
            </p>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/customers/${customer.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={deleteCustomer.isPending}>
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      )}

      <FollowUpMessageModal
        open={fuOpen}
        message={fuMessage}
        loading={fuLoading}
        onClose={() => setFuOpen(false)}
      />
    </AppShell>
  )
}
