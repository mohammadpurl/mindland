import type { Language } from '@/hooks/useChat'

type ApiMessage = {
  text: string
  audio?: string
  lipsync?: { mouthCues: { start: number; end: number; value: string }[] }
  facialExpression?: string
  animation?: string
}

const lessonModeResponse = (text: string): { messages: ApiMessage[] } => ({
  messages: [
    {
      text,
      animation: 'Talking',
      facialExpression: 'default',
    },
  ],
})

/** Stub API — replace with real backend when chat service is ready */
export async function introduction(language: Language) {
  void language
  return lessonModeResponse('سلام! به مایلند خوش آمدی.')
}

export async function sendUserMessage(msg: string, sessionId: string, language: Language) {
  void sessionId
  void language
  return lessonModeResponse(`پیام شما دریافت شد: ${msg}`)
}

export async function saveConversation(_messages?: unknown) {
  return { ok: true }
}

export async function saveTrip(_data?: unknown) {
  const id = `lesson_${Date.now()}`
  return { id, tripId: id }
}

export async function extractPassengerDataWithOpenAI(_messages?: unknown) {
  return {
    passengers: [] as Array<Record<string, unknown>>,
    travelType: undefined as string | undefined,
    airportName: '',
    travelDate: '',
    passengerCount: '',
    flightNumber: '',
    flightType: '',
    additionalInfo: '',
    buyer_phone: '',
    buyer_email: '',
  }
}

export async function createOrder(_data?: unknown) {
  return { id: '', success: true, message: '', data: null, error: undefined as string | undefined }
}

export async function createPassenger() {
  return { id: '' }
}

export async function getOrderPrices() {
  return { total: 0 }
}

export async function fetchTrip() {
  return null
}

export async function findFlightByNumber() {
  return null
}

export async function updateTrip() {
  return { ok: true }
}

export async function getPaymentLinkNew() {
  return { url: '' }
}
