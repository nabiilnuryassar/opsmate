export function AITypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-[16px] bg-ai-50 px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-ai-500 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-ai-500 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-ai-500" />
    </div>
  )
}
