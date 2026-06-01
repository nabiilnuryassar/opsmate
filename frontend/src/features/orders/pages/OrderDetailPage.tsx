import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, MessageCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { PaymentStatusBadge, OrderStatusBadge } from '@/components/shared/StatusBadge'
import { formatRupiah } from '@/lib/utils'
import { useMe } from '@/features/auth/api/auth-api'
import { StatusControl } from '../components/StatusControl'
import { PaymentStatusControl } from '../components/PaymentStatusControl'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { AIInsightCard } from '@/features/ai/components/AIInsightCard'
import { FollowUpMessageModal } from '@/features/reminders/components/FollowUpMessageModal'
import { generateFollowUp } from '@/features/ai/api/ai-api'
import { useState } from 'react'
import {
  useOrder,
  useDeleteOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from '../api/orders-api'

export function OrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const orderId = id ? Number(id) : undefined
  const { data: user } = useMe()
  const { data: order, isLoading } = useOrder(orderId)
  const deleteOrder = useDeleteOrder()
  const updateStatus = useUpdateOrderStatus(orderId ?? 0)
  const updatePayment = useUpdatePaymentStatus(orderId ?? 0)
  const [fuOpen, setFuOpen] = useState(false)
  const [fuMessage, setFuMessage] = useState('')
  const [fuLoading, setFuLoading] = useState(false)

  const onFollowUp = async () => {
    if (!order?.customer) return
    setFuMessage('')
    setFuLoading(true)
    setFuOpen(true)
    try {
      setFuMessage(
        await generateFollowUp({
          customer_id: order.customer.id,
          order_id: order.id,
          type: 'payment',
        }),
      )
    } finally {
      setFuLoading(false)
    }
  }

  const onDelete = async () => {
    if (!orderId || !confirm('Hapus order ini?')) return
    await deleteOrder.mutateAsync(orderId)
    navigate('/orders')
  }

  return (
    <AppShell
      greeting="Detail Order"
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

      {isLoading || !order ? (
        <p className="text-sm text-neutral-500">Memuat...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{order.order_number}</h1>
                <p className="text-sm text-neutral-500">{order.order_date}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <PaymentStatusBadge status={order.payment_status} />
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </Card>

          {order.customer && (
            <Card>
              <CardTitle>Pelanggan</CardTitle>
              <p className="mt-2 font-semibold text-neutral-900">{order.customer.name}</p>
              <p className="text-sm text-neutral-500">{order.customer.phone ?? '-'}</p>
              {order.customer.phone && (
                <a
                  href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" variant="secondary" className="mt-2">
                    <MessageCircle className="h-4 w-4" />
                    Follow-up
                  </Button>
                </a>
              )}
            </Card>
          )}

          {order.payment_status === 'unpaid' && order.customer && (
            <AIInsightCard
              text={`${order.customer.name} belum menyelesaikan pembayaran order ini. Mau saya bantu buatkan pesan follow-up?`}
              actionLabel="Buat Pesan"
              onAction={onFollowUp}
            />
          )}

          <Card>
            <CardTitle>Item Order</CardTitle>
            <div className="mt-2 flex flex-col gap-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-700">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-medium text-neutral-900">{formatRupiah(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-neutral-100 pt-3 text-sm">
              <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
              <Row label="Diskon" value={`- ${formatRupiah(order.discount)}`} />
              <div className="mt-1 flex justify-between font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Ubah Status Order</CardTitle>
            <div className="mt-2">
              <StatusControl
                current={order.status}
                onChange={(s) => updateStatus.mutate(s)}
                disabled={updateStatus.isPending}
              />
            </div>
          </Card>

          <Card>
            <CardTitle>Ubah Status Pembayaran</CardTitle>
            <div className="mt-2">
              <PaymentStatusControl
                current={order.payment_status}
                onChange={(s) => updatePayment.mutate(s)}
                disabled={updatePayment.isPending}
              />
            </div>
          </Card>

          <Card>
            <CardTitle>Aktivitas</CardTitle>
            <div className="mt-3">
              <ActivityTimeline activities={order.activities ?? []} />
            </div>
          </Card>

          {order.notes && (
            <Card>
              <CardTitle>Catatan</CardTitle>
              <p className="mt-2 text-sm text-neutral-700">{order.notes}</p>
            </Card>
          )}

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(`/orders/${order.id}/edit`)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={deleteOrder.isPending}>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-neutral-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
