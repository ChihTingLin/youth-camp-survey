const STATISTICS_TIMEOUT_MS = 15_000

export type PublicCount = number | null

interface StatisticsBase {
  ok: true
  generatedAt: string
  minimumResponses: number
  totalResponses: number
}

export interface UnavailablePublicStatistics extends StatisticsBase {
  available: false
}

export interface AvailablePublicStatistics extends StatisticsBase {
  available: true
  averagePhysicalEnergy: number | null
  averagePsychologicalEnergy: number | null
  focusAreas: Record<string, PublicCount>
  recentMoods: Record<string, PublicCount>
  bodySignals: Record<string, PublicCount>
}

export type PublicStatistics =
  | UnavailablePublicStatistics
  | AvailablePublicStatistics

export async function fetchPublicStatistics(): Promise<PublicStatistics> {
  const endpoint = import.meta.env.VITE_GOOGLE_SCRIPT_URL
  if (!endpoint) throw new Error('尚未設定統計資料來源。')

  const url = new URL(endpoint)
  url.searchParams.set('action', 'stats')
  const controller = new AbortController()
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    STATISTICS_TIMEOUT_MS,
  )

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('統計服務暫時無法使用。')

    const result = (await response.json()) as unknown
    if (!isPublicStatistics(result)) {
      throw new Error('統計資料格式無法辨識。')
    }

    return result
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('讀取統計資料逾時，請再試一次。', { cause: error })
    }
    throw error instanceof Error
      ? error
      : new Error('目前無法讀取統計資料。', { cause: error })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function isPublicStatistics(value: unknown): value is PublicStatistics {
  if (!isRecord(value) || value.ok !== true) return false
  if (
    typeof value.available !== 'boolean' ||
    typeof value.totalResponses !== 'number' ||
    typeof value.minimumResponses !== 'number' ||
    typeof value.generatedAt !== 'string'
  ) {
    return false
  }

  if (!value.available) return true

  return (
    isNullableNumber(value.averagePhysicalEnergy) &&
    isNullableNumber(value.averagePsychologicalEnergy) &&
    isCountRecord(value.focusAreas) &&
    isCountRecord(value.recentMoods) &&
    isCountRecord(value.bodySignals)
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === 'number'
}

function isCountRecord(value: unknown): value is Record<string, PublicCount> {
  return (
    isRecord(value) &&
    Object.values(value).every((count) => count === null || typeof count === 'number')
  )
}
