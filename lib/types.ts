export type BattalionCharacter = {
  name: string
  role: string
  note?: string
}

export type Battalion = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  lore: string | null
  characters: BattalionCharacter[]
  ranks: string[]
  accent: string
  sort_order: number
  created_at: string
}

export type Officer = {
  id: string
  name: string
  rank: string | null
  role: 'OFFICER' | 'ADMIN'
  battalion_id: string | null
  created_at: string
}

export type Training = {
  id: string
  title: string
  description: string | null
  scheduled_at: string
  battalion_id: string | null
  created_by: string | null
  created_at: string
}

export type Announcement = {
  id: string
  title: string
  body: string
  priority: 'STANDARD' | 'PRIORITY' | 'CRITICAL'
  created_by: string | null
  created_at: string
}
