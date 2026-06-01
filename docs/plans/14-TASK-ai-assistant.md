# TASK-14 — AI Business Assistant

> Fase: Phase 2 — AI MVP
> Dependensi: TASK-09
> Estimasi: 2–3 hari

---

## Tujuan

Implementasi AI Assistant sebagai fitur pembeda utama: chat interface, tool calling, dan business context awareness. AI menjawab berdasarkan data bisnis real, bukan karangan.

---

## Scope

### 14.1 Backend — AI Service Layer

#### Database Migration: `ai_messages`
```
ai_messages
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── user_id (FK → users.id)
├── role (enum: user, assistant, system)
├── content (text)
├── metadata_json (json, nullable) ← tool calls, context
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
POST /api/ai/chat                  ← send message, get AI response
GET  /api/ai/messages              ← chat history
```

#### System Prompt (PRD §16.1)
```text
Kamu adalah AI Ops Manager untuk UMKM Indonesia.
Tugas kamu membantu pemilik bisnis memahami kondisi operasional hariannya.

Kamu boleh:
- merangkum data order
- memberi insight customer
- memberi insight stok
- membuat draft pesan follow-up
- membuat ide promo
- menjelaskan laporan harian

Kamu tidak boleh:
- mengarang data yang tidak tersedia
- mengubah data tanpa persetujuan user
- membuat janji bahwa pesan sudah dikirim
- memberi saran finansial mutlak
- menyebut angka jika tidak ada di data

Gunakan bahasa Indonesia yang ramah, jelas, dan praktis.
Prioritaskan jawaban singkat, actionable, dan cocok untuk owner UMKM.
```

#### AI Tool Functions (PRD §16.2)

```typescript
// Available tools for function/tool calling
get_today_summary()       → total orders, revenue, unpaid, completed, low stock
get_unpaid_orders()       → list of unpaid orders with customer info
get_low_stock_products()  → products with stock ≤ minimum_stock
get_top_products(period)  → best-selling products by period
get_inactive_customers()  → customers not ordering in 30+ days
generate_follow_up_message(customer_id, order_id) → WhatsApp message draft
generate_promo_ideas()    → promo ideas based on business data
```

#### Implementation Pattern
1. User sends message → `POST /api/ai/chat`
2. Backend builds context:
   - System prompt
   - Business context (name, category, recent metrics)
   - Chat history (last 20 messages)
   - Available tools
3. Call OpenAI-compatible API with tool calling
4. If tool called → execute, inject result, continue
5. Return final assistant response
6. Save both user & assistant messages

#### Security (PRD §12.2)
- AI tidak langsung akses database → pakai controlled tool functions
- Rate limit: max 20 AI requests/hour per user
- AI tidak boleh modify data tanpa user confirmation
- All AI interactions logged

---

### 14.2 Frontend — AI Assistant Screen

Referensi: [ai-assistant-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/ai-assistant-mobile.png)

Halaman: `/ai`

#### Layout (sesuai mockup):

**Header:**
```
← Tanya AI Assistant     [🗑️] [📎]
```

**Business Context Card (top):**
```
[Bot icon] Rina Catering         [AKTIF]
           12 order hari ini
```

**Chat Area:**
- AI bubbles: bg `#F5F3FF` (ai-soft), dark text
- User bubbles: bg `#0F766E` (primary), white text
- AI messages include:
  - Text responses
  - Data cards (embedded): customer name, tagihan amount
  - Action buttons: "Buat Pesan WhatsApp" (green)
- Timestamp: "09:41 AM" between messages

**Example AI Response (from mockup):**
```
Halo Kak Rina! Selamat pagi. Ada 3 customer belum bayar hari ini.
Mau saya bantu buatkan pesan follow-up agar cashflow aman?

┌──────────────────────────────┐
│ Pelanggan      Total Tagihan │
│ Sinta Permata  Rp250.000    │
│ [📱 Buat Pesan WhatsApp]    │
├──────────────────────────────┤
│ Pelanggan      Total Tagihan │
│ Budi Santoso   Rp125.000    │
│ [📱 Buat Pesan WhatsApp]    │
└──────────────────────────────┘
```

**Suggested Prompts (horizontal chips, bottom):**
- "Hari ini gimana?"
- "Siapa belum bayar?"
- "Bua..." (truncated)

**Input Area (fixed bottom):**
```
[Tanya sesuatu...]    [🎤] [➤ Send]
```
- Text input: rounded, full width
- Mic icon (future: voice input)
- Send button: primary green, circle

**Bottom Navigation:** same as all pages

---

### 14.3 AI Chat Components

| Component | Keterangan |
| --------- | ---------- |
| `AIChatPanel.tsx` | main chat container |
| `ChatBubble.tsx` | user/assistant bubble |
| `AIDataCard.tsx` | embedded data card (customer/order) |
| `AIActionButton.tsx` | action button within AI response |
| `SuggestedPromptChips.tsx` | horizontal scroll prompt chips |
| `ChatInput.tsx` | input bar + send button |
| `AITypingIndicator.tsx` | typing animation |

#### Suggested Prompts (DESIGN §14.8)
```
Hari ini gimana?
Siapa yang belum bayar?
Produk apa yang paling laku?
Stok apa yang mau habis?
Buatkan laporan harian
Buat promo minggu ini
```

#### AI Response Types
1. **Text only** — simple answer
2. **Text + Data cards** — answer with embedded order/customer cards
3. **Text + Action buttons** — answer with "Generate Pesan", "Lihat Order"
4. **Structured list** — bullet points with data

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_ai_messages_table.php` | migration |
| `app/Models/AIMessage.php` | model |
| `app/Http/Controllers/Api/AIController.php` | chat endpoint |
| `app/Services/AI/AIAssistantService.php` | orchestration |
| `app/Services/AI/AIToolService.php` | tool function implementations |
| `app/Services/AI/AIPromptBuilder.php` | system prompt + context builder |
| `config/ai.php` | AI configuration (model, API key, limits) |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/ai/pages/AIAssistantPage.tsx` | main page |
| `src/features/ai/components/AIChatPanel.tsx` | chat container |
| `src/features/ai/components/ChatBubble.tsx` | message bubbles |
| `src/features/ai/components/AIDataCard.tsx` | embedded data cards |
| `src/features/ai/components/SuggestedPromptChips.tsx` | prompt chips |
| `src/features/ai/components/ChatInput.tsx` | input bar |
| `src/features/ai/components/AITypingIndicator.tsx` | typing dots |
| `src/features/ai/hooks/useAIChat.ts` | TanStack Query/mutation |
| `src/types/ai.ts` | TypeScript types |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat bertanya tentang kondisi bisnis
- [ ] AI menjawab berdasarkan data bisnis real (tool calling)
- [ ] AI tidak mengarang data yang tidak ada
- [ ] AI menggunakan bahasa Indonesia ramah & praktis
- [ ] Chat history tersimpan dan bisa di-scroll
- [ ] Suggested prompt chips bekerja
- [ ] AI typing indicator tampil saat menunggu response
- [ ] AI response < 10 detik (PRD §12.1)
- [ ] Data cards embedded dalam AI response (sesuai mockup)
- [ ] Action buttons dalam AI response berfungsi
- [ ] Rate limit diterapkan
- [ ] Layout sesuai mockup ai-assistant-mobile.png
