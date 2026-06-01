import { MessageCircle, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/StatusBadge'
import type { BadgeTone } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { Reminder, ReminderPriority } from '../api/reminders-api'

const PRIORITY_BORDER: Record<ReminderPriority, string> = {
  urgent: 'border-l-danger',
  today: 'border-l-warning',
  later: 'border-l-neutral-300',
}

const PRIORITY_TONE: Record<ReminderPriority, BadgeTone> = {
  urgent: 'danger',
  today: 'warning',
  later: 'neutral',
}

const PRIORITY_LABEL: Record<ReminderPriority, string> = {
  urgent: 'Urgent',
  today: 'Hari Ini',
  later: 'Nanti',
}

interface ReminderCardProps {
  reminder: Reminder
  onMessage?: () => void
  onDone?: () => void
  onSnooze?: () => void
}

export function ReminderCard({ reminder, onMessage, onDone, onSnooze }: ReminderCardProps) {
  return (
    <div
      className={cn(
        'rounded-[16px] border border-l-4 border-neutral-200 bg-white p-4 shadow-sm',
        PRIORITY_BORDER[reminder.priority],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-neutral-900">{reminder.title}</p>
        <Badge label={PRIORITY_LABEL[reminder.priority]} tone={PRIORITY_TONE[reminder.priority]} />
      </div>
      {reminder.description && (
        <p className="mt-1 text-sm text-neutral-500">{reminder.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={onMessage}>
          <MessageCircle className="h-4 w-4" />
          Buat Pesan
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone}>
          <Check className="h-4 w-4" />
          Selesai
        </Button>
        <Button size="sm" variant="ghost" onClick={onSnooze}>
          <Clock className="h-4 w-4" />
          Tunda
        </Button>
      </div>
    </div>
  )
}

export { PRIORITY_TONE, PRIORITY_LABEL }
