export const BUSINESS_CATEGORIES = [
  { value: 'makanan_minuman', label: 'Makanan & Minuman' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'jasa_service', label: 'Jasa Service' },
  { value: 'toko_online', label: 'Toko Online' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'kesehatan_kecantikan', label: 'Kesehatan & Kecantikan' },
  { value: 'edukasi', label: 'Edukasi' },
  { value: 'otomotif', label: 'Otomotif' },
  { value: 'lainnya', label: 'Lainnya' },
] as const

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]['value']

export interface Business {
  id: number
  name: string
  category: BusinessCategory | null
  phone: string | null
  address: string | null
  city: string | null
  logo_url: string | null
  description: string | null
  currency: string
  is_complete: boolean
}

export interface UpdateBusinessPayload {
  name: string
  category?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  description?: string | null
  currency?: string | null
}
