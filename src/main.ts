import './style.css'
import { initPWA } from './pwa.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

initPWA(app)
