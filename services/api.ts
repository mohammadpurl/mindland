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

export async function saveConversation() {
  return { ok: true }
}

export async function saveTrip() {
  return { tripId: `lesson_${Date.now()}` }
}

export async function extractPassengerDataWithOpenAI() {
  return { passengers: [] }
}

export async function createOrder() {
  return { id: '' }
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
