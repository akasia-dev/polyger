import 'isomorphic-unfetch'
import redaxios from 'redaxios'

const fetchWithTimeout =
  (timeoutMs: number) =>
  (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    return fetch(input, {
      ...init,
      signal: abortFetchSignal(timeoutMs)
    })
  }

const abortFetchSignal = (timeoutMs: number) => {
  if (typeof window === 'undefined' || window.AbortController === undefined) {
    return undefined
  }

  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), timeoutMs)

  return abortController.signal
}

export const axios = redaxios.create({
  fetch: fetchWithTimeout(4000)
}) as typeof redaxios
