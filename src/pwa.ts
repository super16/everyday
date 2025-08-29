import { registerSW } from 'virtual:pwa-register'

export function initPWA(_: Element) {
  let swActivated = false
  // check for updates every hour
  const period = 60 * 60 * 1000

  window.addEventListener('load', () => {
    registerSW({
      immediate: true,
      onRegisteredSW(swUrl, r) {
        if (period <= 0) return
        if (r?.active?.state === 'activated') {
          swActivated = true
          registerPeriodicSync(period, swUrl, r)
        }
        else if (r?.installing) {
          r.installing.addEventListener('statechange', (e) => {
            const sw = e.target as ServiceWorker
            swActivated = sw.state === 'activated'
            if (swActivated)
              registerPeriodicSync(period, swUrl, r)
          })
        }
      },
    })
  })
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}
