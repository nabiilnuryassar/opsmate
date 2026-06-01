import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import { useMe } from '@/features/auth/api/auth-api'
import { ReminderCard } from '../components/ReminderCard'
import { FollowUpMessageModal } from '../components/FollowUpMessageModal'
import {
  useReminders,
  useCompleteReminder,
  useSnoozeReminder,
  generateFollowUp,
} from '../api/reminders-api'
import type { Reminder, ReminderPriority } from '../api/reminders-api'

const GROUPS: { key: ReminderPriority; label: string }[] = [
  { key: 'urgent', label: 'Urgent' },
  { key: 'today', label: 'Hari Ini' },
  { key: 'later', label: 'Nanti' },
]

export function ReminderListPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { data: reminders, isLoading } = useReminders()
  const complete = useCompleteReminder()
  const snooze = useSnoozeReminder()

  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loadingMsg, setLoadingMsg] = useState(false)

  const onMessage = async (r: Reminder) => {
    setMessage('')
    setLoadingMsg(true)
    setModalOpen(true)
    try {
      setMessage(await generateFollowUp(r.id))
    } finally {
      setLoadingMsg(false)
    }
  }

  const list = reminders ?? []
  const byPriority = (p: ReminderPriority) => list.filter((r) => r.priority === p)

  return (
    <AppShell
      greeting="Reminder"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold text-neutral-900">Perlu Ditindaklanjuti</h1>

        {isLoading ? (
          <LoadingState message="Memuat reminder..." />
        ) : list.length === 0 ? (
          <EmptyState
            title="Tidak ada yang perlu ditindaklanjuti"
            description="Semua order, pembayaran, dan stok dalam kondisi aman. Mantap!"
          />
        ) : (
          GROUPS.map(({ key, label }) => {
            const items = byPriority(key)
            if (items.length === 0) return null
            return (
              <section key={key} className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-neutral-500">{label}</h2>
                {items.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onMessage={() => onMessage(r)}
                    onDone={() => complete.mutate(r.id)}
                    onSnooze={() => snooze.mutate({ id: r.id })}
                  />
                ))}
              </section>
            )
          })
        )}
      </div>

      <FollowUpMessageModal
        open={modalOpen}
        message={message}
        loading={loadingMsg}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  )
}
