const PROMPTS = [
  'Hari ini gimana?',
  'Siapa yang belum bayar?',
  'Produk apa yang paling laku?',
  'Stok apa yang mau habis?',
  'Buatkan laporan harian',
  'Buat promo minggu ini',
]

interface SuggestedPromptChipsProps {
  onPick: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPromptChips({ onPick, disabled }: SuggestedPromptChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {PROMPTS.map((p) => (
        <button
          key={p}
          type="button"
          disabled={disabled}
          onClick={() => onPick(p)}
          className="shrink-0 rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:border-primary-400 hover:text-primary-700 disabled:opacity-50"
        >
          {p}
        </button>
      ))}
    </div>
  )
}

export { PROMPTS }
