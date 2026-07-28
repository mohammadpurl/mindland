export enum MessageSender {
  CLIENT = 'client',
  AVATAR = 'avatar',
}

export interface LipsyncCue {
  start: number
  end: number
  value: string
}

export interface Lipsync {
  mouthCues: LipsyncCue[]
}

export interface Message {
  id: string
  text: string
  sender: MessageSender
  audio?: string
  lipsync?: Lipsync
  facialExpression?: string
  animation?: string
  /** وقتی API صدا ندارد — Avatar از speechSynthesis مرورگر استفاده می‌کند */
  useBrowserTts?: boolean
}

export interface Passenger {
  id?: string
  first_name?: string
  last_name?: string
  national_id?: string
  passport_number?: string
  birth_date?: string
  gender?: string
}

export interface TicketInfo {
  id?: string
  flight_number?: string
  origin?: string
  destination?: string
  departure_date?: string
}
