// ═══════════════════════════════════════════════════════════
//  GILBERT MD - WhatsApp Bot v8.2 FULL FIXED (PAIRING PATCHED)
//  Bot Number: 6282373800186
// ═══════════════════════════════════════════════════════════

import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason, 
  delay, 
  downloadContentFromMessage, 
  proto, 
  prepareWAMessageMedia,
  Browsers, 
  fetchLatestWaWebVersion 
} from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
import axios from 'axios'
import { Jimp } from 'jimp'
import os from 'os'
import path from 'path'
import { execFile, spawn } from 'child_process'
import { promisify } from 'util'
const execFileAsync = promisify(execFile)

// ═══════════════ KONFIG ═══════════════
const BOT_NAME = "GILBERT MD"
const OWNER = "6285820673526"
const DEV_LIST = ["6282373800186", "6285820673526"]
const PAIRING_NUMBER = process.env.PHONE_NUMBER || "6282373800186"
const IS_JADIBOT = process.env.IS_JADIBOT === '1'
const JADIBOT_CODE_FILE = process.env.JADIBOT_CODE_FILE || null
const PREFIX = "."
const SESSION_PATH = IS_JADIBOT ? `./jadibot-sessions/${PAIRING_NUMBER}` : 'session'
const DATA_DIR = IS_JADIBOT ? `./jadibot-data/${PAIRING_NUMBER}` : '.'
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync('./jadibot-sessions')) fs.mkdirSync('./jadibot-sessions', { recursive: true })

// ═══════════════ SESSION GUARD (AUTO CLEAN) ═══════════════
if (fs.existsSync(SESSION_PATH)) {
  const credsPath = path.join(SESSION_PATH, 'creds.json')
  if (!fs.existsSync(credsPath)) {
    console.log('\x1b[33m[!] Folder session ada tapi creds.json gak ada → reset...\x1b[0m')
    try { fs.rmSync(SESSION_PATH, { recursive: true, force: true }) } catch {}
  } else {
    try {
      const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'))
      if (creds.me && creds.me.id) {
        console.log(`\x1b[32m[✓] Session valid: ${creds.me.id.split(':')[0]}\x1b[0m`)
      }
    } catch (e) {
      console.log('\x1b[33m[!] Session korup → reset...\x1b[0m')
      try { fs.rmSync(SESSION_PATH, { recursive: true, force: true }) } catch {}
    }
  }
}

// ═══════════════ KONTAK BISNIS ═══════════════
const BUSINESS_CONTACTS = [
  { nama: "Gilbert Store", kategori: "Digital Store", nomor: "6285820673526", deskripsi: "Akun premium, top up game", jam: "08:00 - 22:00 WIB", status: "OPEN" },
  { nama: "Gilbert Jasa", kategori: "Jasa Digital", nomor: "6282373800186", deskripsi: "Edit, joki tugas, desain", jam: "09:00 - 21:00 WIB", status: "OPEN" },
]

// ═══════════════ THUMBNAIL & READMORE ═══════════════
const THUMB = "https://cdn.imagetourls.com/uploads/tyImg/kTFZuIQ6.jpg" 
const THUMB_FALLBACK = THUMB 
const readmore = String.fromCharCode(8206).repeat(4001)

const THUMB_BUG = THUMB, THUMB_OWNER = THUMB, THUMB_PREMIUM = THUMB, THUMB_DEV = THUMB
const THUMB_PLUGIN = THUMB, THUMB_GROUP = THUMB, THUMB_TOOLS = THUMB, THUMB_ALL = THUMB
const THUMB_DL = THUMB, THUMB_STICKER = THUMB, THUMB_AI = THUMB, THUMB_MEDIA = THUMB
const THUMB_FUN = THUMB, THUMB_RANDOM = THUMB, THUMB_INFO = THUMB
const THUMB_GAME = THUMB, THUMB_IMAGE = THUMB, THUMB_ISLAMIC = THUMB, THUMB_KRISTEN = THUMB
const THUMB_CONTACT = THUMB, THUMB_MUSIC = THUMB, THUMB_UTILITY = THUMB
const AUDIO = "https://egabox.lovable.app/5ippsp.mp3"
const ROAST_IMG = THUMB
const PREMIUM_LV_REQUIREMENT = 1000
const LV_COOLDOWN = 60 * 60 * 1000
const MAX_WARN = 3
const SPAM_LIMIT = 5
const SPAM_INTERVAL = 5000

// ═══════════════ PATH ═══════════════
const FILE = path.join(DATA_DIR, 'owners.json')
const SELF_FILE = path.join(DATA_DIR, 'self.json')
const USER_FILE = path.join(DATA_DIR, 'users.json')
const BAN_FILE = path.join(DATA_DIR, 'banned.json')
const BAND_FILE = path.join(DATA_DIR, 'band.json')
const PREMIUM_FILE = path.join(DATA_DIR, 'premium.json')
const DEV_FILE = path.join(DATA_DIR, 'devs.json')
const WELCOME_FILE = path.join(DATA_DIR, 'welcome.json')
const GROUP_SETTINGS_FILE = path.join(DATA_DIR, 'group-settings.json')
const MUTED_FILE = path.join(DATA_DIR, 'muted.json')
const WARN_FILE = path.join(DATA_DIR, 'warns.json')
const SPAM_FILE = path.join(DATA_DIR, 'spam-tracker.json')
const POLL_FILE = path.join(DATA_DIR, 'polls.json')
const PLUGIN_DIR = path.join(DATA_DIR, 'plugins')

// ═══════════════ API ═══════════════
const API = "https://api.nexadev.my.id"
const API2 = "https://apii.nexadev.my.id"
const API3 = "https://api.synoxcloud.xyz"
const SCRIPTBLOX_API = "https://scriptblox.com/api"
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
const HEADERS = { "User-Agent": UA, "Accept": "application/json, text/plain, */*" }
const SBLox_HEADERS = { ...HEADERS, "Accept": "application/json", "Referer": "https://scriptblox.com/", "Origin": "https://scriptblox.com" }

// ═══════════════ INIT FILES ═══════════════
if (!fs.existsSync(PLUGIN_DIR)) fs.mkdirSync(PLUGIN_DIR, { recursive: true })
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([OWNER], null, 2))
if (!fs.existsSync(SELF_FILE)) fs.writeFileSync(SELF_FILE, JSON.stringify({ self: false }, null, 2))
if (!fs.existsSync(USER_FILE)) fs.writeFileSync(USER_FILE, JSON.stringify({}, null, 2))
if (!fs.existsSync(BAN_FILE)) fs.writeFileSync(BAN_FILE, JSON.stringify([], null, 2))
if (!fs.existsSync(BAND_FILE)) fs.writeFileSync(BAND_FILE, JSON.stringify([], null, 2))
if (!fs.existsSync(PREMIUM_FILE)) fs.writeFileSync(PREMIUM_FILE, JSON.stringify([], null, 2))
if (!fs.existsSync(DEV_FILE)) fs.writeFileSync(DEV_FILE, JSON.stringify(DEV_LIST, null, 2))
if (!fs.existsSync(WELCOME_FILE)) fs.writeFileSync(WELCOME_FILE, JSON.stringify({}, null, 2))
if (!fs.existsSync(GROUP_SETTINGS_FILE)) fs.writeFileSync(GROUP_SETTINGS_FILE, JSON.stringify({}, null, 2))
if (!fs.existsSync(MUTED_FILE)) fs.writeFileSync(MUTED_FILE, JSON.stringify({}, null, 2))
if (!fs.existsSync(WARN_FILE)) fs.writeFileSync(WARN_FILE, JSON.stringify({}, null, 2))
if (!fs.existsSync(SPAM_FILE)) fs.writeFileSync(SPAM_FILE, JSON.stringify({}, null, 2))
if (!fs.existsSync(POLL_FILE)) fs.writeFileSync(POLL_FILE, JSON.stringify({}, null, 2))

// ═══════════════ DB HELPERS ═══════════════
const getO = () => { try { return JSON.parse(fs.readFileSync(FILE)) } catch { return [OWNER] } }
const saveO = l => fs.writeFileSync(FILE, JSON.stringify(l, null, 2))
const getSelf = () => { try { return JSON.parse(fs.readFileSync(SELF_FILE)).self } catch { return false } }
const setSelf = v => fs.writeFileSync(SELF_FILE, JSON.stringify({ self: v }, null, 2))
const getUsers = () => { try { return JSON.parse(fs.readFileSync(USER_FILE)) } catch { return {} } }
const saveUsers = u => fs.writeFileSync(USER_FILE, JSON.stringify(u, null, 2))
const getBanned = () => { try { return JSON.parse(fs.readFileSync(BAN_FILE)) } catch { return [] } }
const saveBanned = b => fs.writeFileSync(BAN_FILE, JSON.stringify(b, null, 2))
const getBand = () => { try { return JSON.parse(fs.readFileSync(BAND_FILE)) } catch { return [] } }
const saveBand = b => fs.writeFileSync(BAND_FILE, JSON.stringify(b, null, 2))
const getPremium = () => { try { return JSON.parse(fs.readFileSync(PREMIUM_FILE)) } catch { return [] } }
const savePremium = p => fs.writeFileSync(PREMIUM_FILE, JSON.stringify(p, null, 2))
const getDevs = () => { try { return JSON.parse(fs.readFileSync(DEV_FILE)) } catch { return [...DEV_LIST] } }
const saveDevs = d => fs.writeFileSync(DEV_FILE, JSON.stringify(d, null, 2))
const getWelcome = () => { try { return JSON.parse(fs.readFileSync(WELCOME_FILE)) } catch { return {} } }
const saveWelcome = w => fs.writeFileSync(WELCOME_FILE, JSON.stringify(w, null, 2))
const getGroupSettings = () => { try { return JSON.parse(fs.readFileSync(GROUP_SETTINGS_FILE)) } catch { return {} } }
const saveGroupSettings = s => fs.writeFileSync(GROUP_SETTINGS_FILE, JSON.stringify(s, null, 2))
const getMuted = () => { try { return JSON.parse(fs.readFileSync(MUTED_FILE)) } catch { return {} } }
const saveMuted = m => fs.writeFileSync(MUTED_FILE, JSON.stringify(m, null, 2))
const getWarns = () => { try { return JSON.parse(fs.readFileSync(WARN_FILE)) } catch { return {} } }
const saveWarns = w => fs.writeFileSync(WARN_FILE, JSON.stringify(w, null, 2))
const getPolls = () => { try { return JSON.parse(fs.readFileSync(POLL_FILE)) } catch { return {} } }
const savePolls = p => fs.writeFileSync(POLL_FILE, JSON.stringify(p, null, 2))

let spamTracker = {}
try { spamTracker = JSON.parse(fs.readFileSync(SPAM_FILE, 'utf-8')) } catch {}
function saveSpamTracker() { try { fs.writeFileSync(SPAM_FILE, JSON.stringify(spamTracker, null, 2)) } catch {} }

const scriptSearchCache = {}

// ═══════════════ PERMISSION ═══════════════
const cleanNum = n => String(n || '').replace(/[^0-9]/g, '')
const isO = n => { const c = cleanNum(n); if (!c) return false; return getO().map(cleanNum).some(o => o === c) || c === cleanNum(OWNER) }
const isDev = n => { const c = cleanNum(n); if (!c) return false; return getDevs().map(cleanNum).some(d => d === c) }
const isBanned = n => { const c = cleanNum(n); if (!c) return false; return getBanned().map(cleanNum).some(b => b === c) }
const isBandUser = n => { const c = cleanNum(n); if (!c) return false; return getBand().map(cleanNum).some(b => b === c) }
const isPremium = n => { const c = cleanNum(n); if (!c) return false; return getPremium().map(cleanNum).some(p => p === c) }

function getUserData(num) {
  const users = getUsers()
  if (!users[num]) users[num] = { lv: 1, lastMessage: Date.now(), totalMessages: 0 }
  return users[num]
}
function updateUserLevel(num) {
  const users = getUsers(); const now = Date.now()
  if (!users[num]) { users[num] = { lv: 1, lastMessage: now, totalMessages: 1 }; saveUsers(users); return false }
  const user = users[num]
  user.totalMessages = (user.totalMessages || 0) + 1
  let leveledUp = false
  if (now - (user.lastMessage || now) >= LV_COOLDOWN) { user.lv = (user.lv || 1) + 1; user.lastMessage = now; leveledUp = true }
  if (user.totalMessages > 0 && user.totalMessages % 100 === 0) { user.lv = (user.lv || 1) + 1; leveledUp = true }
  saveUsers(users); return leveledUp
}
function getUserRole(num) {
  if (isDev(num)) return "Dev"
  if (isO(num)) return "Owner"
  if (isPremium(num)) return "Premium"
  const user = getUserData(num)
  if (user.lv >= PREMIUM_LV_REQUIREMENT) return "Premium LV"
  return "Member"
}
function getWarn(jid, num) { const w = getWarns(); if (!w[jid]) w[jid] = {}; return w[jid][num] || 0 }
function addWarn(jid, num) { const w = getWarns(); if (!w[jid]) w[jid] = {}; w[jid][num] = (w[jid][num] || 0) + 1; saveWarns(w); return w[jid][num] }
function resetWarn(jid, num) { const w = getWarns(); if (w[jid] && w[jid][num]) { w[jid][num] = 0; saveWarns(w) } }

function checkSpam(senderNum) {
  const now = Date.now()
  if (!spamTracker[senderNum]) spamTracker[senderNum] = []
  spamTracker[senderNum] = spamTracker[senderNum].filter(t => now - t < SPAM_INTERVAL)
  spamTracker[senderNum].push(now)
  saveSpamTracker()
  return spamTracker[senderNum].length >= SPAM_LIMIT
}

// ═══════════════ UI BOX MEWAH ═══════════════
function box(title, lines) {
  const maxLen = Math.max(title.length + 6, ...lines.map(l => l.length + 4), 30)
  const top = `╭──「 ${title} 」${'─'.repeat(Math.max(0, maxLen - title.length - 6))}╮`
  let out = top + '\n│\n'
  for (const l of lines) out += `│  ${l}\n`
  out += `│\n╰${'─'.repeat(maxLen)}╯`
  return out
}

function success(title, lines) {
  const time = new Date().toLocaleTimeString('id-ID')
  const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const content = Array.isArray(lines) ? lines : [lines]
  const t = `╭──「 [OK] ${title.toUpperCase()} 」───╮\n│\n│  ${content.join('\n│  ')}\n│\n│  🕒 ${time}\n│  📅 ${date}\n│\n╰──────────────────────────────╯`
  return t
}
const errorUI = (t, l) => box(`[X] ${t}`, typeof l === 'string' ? [l] : l)
const warning = (t, l) => box(`[!] ${t}`, typeof l === 'string' ? [l] : l)
const info = (t, l) => box(`[i] ${t}`, typeof l === 'string' ? [l] : l)
const loading = (t, l) => box(`[...] ${t}`, typeof l === 'string' ? [l] : l)

// ═══════════════ MENU ENGINE (GAYA SHIROINE) ═══════════════
function menuHeader(title, subtitle, push, role, lv) {
  let out = `╭─〔 ${title} 〕\n`
  out += `│ User: ${push}\n`
  out += `│ Role: ${role} | Lv: ${lv}\n`
  if (subtitle) out += `│ Info: ${subtitle}\n`
  out += `╰──────────`
  return out
}
function menuCat(title, items) {
  let out = `\n╭─〔 ${title} 〕\n`
  for (const it of items) {
    const idx = it.lastIndexOf('|')
    if (idx > -1) { out += `│ ${it.slice(0, idx).trim()}\n` }
    else { out += `│ ${it}\n` }
  }
  out += `╰──────────`
  return out
}
function menuFooter() {
  return `\n╰──────────\n\n_© ${BOT_NAME} ${new Date().getFullYear()}_`
}

// ═══════════════ UTILS ═══════════════
const formatTanggal = () => new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
const formatJam = () => new Date().toLocaleTimeString('id-ID')
const react = async (sock, jid, m, em) => { try { await sock.sendMessage(jid, { react: { text: em, key: m.key } }) } catch {} }

// ═══════════════ FAKE DOX ═══════════════
function fakeDox() {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)]
  const ips = ['182.253', '36.72', '114.79', '103.28', '125.160', '180.244', '110.136']
  const kota = ['Jakarta Pusat','Bandung','Surabaya','Medan','Makassar','Semarang','Yogyakarta','Bekasi','Tangerang','Depok','Bogor','Malang']
  const isp = ['IndiHome','Telkomsel Halo','XL Axiata','Tri Indonesia','Biznet','MyRepublic','First Media']
  const hp = ['Redmi 12','Samsung A54','iPhone 13 Pro','Oppo Reno 8','Vivo Y36','Realme 11','POCO X5','Infinix Note 30','Asus ROG 6']
  const jalan = ['Jl. Merdeka','Jl. Sudirman','Jl. Gatot Subroto','Jl. Ahmad Yani','Jl. Diponegoro','Jl. Pahlawan','Jl. Kartini','Jl. Mawar']
  const mac = Array.from({length:6}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':').toUpperCase()
  return {
    ip: `${pick(ips)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    kota: pick(kota), isp: pick(isp), device: pick(hp),
    alamat: `${pick(jalan)} No. ${Math.floor(Math.random()*200+1)}, RT ${String(Math.floor(Math.random()*10+1)).padStart(2,'0')}/RW ${String(Math.floor(Math.random()*10+1)).padStart(2,'0')}`,
    koordinat: `-6.${Math.floor(Math.random()*900+100)}, 106.${Math.floor(Math.random()*900+100)}`,
    mac, provider: pick(['Telkomsel','Indosat','XL','Tri','Smartfren'])
  }
}

// ═══════════════ SCRIPTBLOX API ═══════════════
async function scriptbloxSearch(query, page = 1) {
  const url = `${SCRIPTBLOX_API}/script/search?q=${encodeURIComponent(query)}&page=${page}&max=15`
  const res = await axios.get(url, { headers: SBLox_HEADERS, timeout: 25000, validateStatus: () => true })
  if (res.status !== 200 || !res.data) throw new Error(`ScriptBlox HTTP ${res.status}`)
  return res.data?.result?.scripts || []
}
async function scriptbloxGet(slug) {
  const res = await axios.get(`${SCRIPTBLOX_API}/script/${slug}`, { headers: SBLox_HEADERS, timeout: 25000, validateStatus: () => true })
  if (res.status !== 200 || !res.data) throw new Error(`ScriptBlox HTTP ${res.status}`)
  return res.data?.result?.script || res.data?.script || null
}
function getScriptThumb(slugOrObj) {
  if (typeof slugOrObj === 'object' && slugOrObj) {
    if (slugOrObj.thumbnail) return slugOrObj.thumbnail
    if (slugOrObj.image) return slugOrObj.image
    if (slugOrObj.game?.image) return slugOrObj.game.image
    if (slugOrObj.slug) return `https://scriptblox.com/api/script/thumbnail?slug=${encodeURIComponent(slugOrObj.slug)}`
    return THUMB
  }
  if (typeof slugOrObj === 'string') return `https://scriptblox.com/api/script/thumbnail?slug=${encodeURIComponent(slugOrObj)}`
  return THUMB
}
function formatViews(n) {
  n = Number(n) || 0
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

async function toWebp(buffer) {
  try {
    const image = await Jimp.read(buffer)
    image.scaleToFit({ w: 512, h: 512 })
    const png = await image.getBuffer('image/png')
    const img2 = await Jimp.read(png)
    const webp = await img2.getBuffer('image/webp')
    return Buffer.from(webp)
  } catch (e) { console.error('Jimp error:', e.message); return null }
}
async function apiGet(url, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try { const res = await axios.get(url, { headers: HEADERS, timeout: 60000, validateStatus: () => true }); if (res.status === 200 && res.data) return res.data } catch (e) {}
    if (i < retry - 1) await delay(2000)
  }
  throw new Error(`API failed: ${url}`)
}
function findUrlDeep(value, keys = ['url','download','downloadUrl','audio','audioUrl','mp3','link','file','src','resultUrl','media']) {
  if (!value) return null
  if (typeof value === 'string') return /^https?:\/\//i.test(value) ? value : null
  if (Array.isArray(value)) { for (const item of value) { const f = findUrlDeep(item, keys); if (f) return f } return null }
  if (typeof value === 'object') {
    for (const key of keys) if (typeof value[key] === 'string' && /^https?:\/\//i.test(value[key])) return value[key]
    for (const child of Object.values(value)) { const f = findUrlDeep(child, keys); if (f) return f }
  }
  return null
}
async function sendImageOrStickerFromUrl(sock, jid, m, url) {
  const res = await axios.get(url, { headers: HEADERS, responseType: 'arraybuffer', timeout: 60000, validateStatus: () => true })
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(res.data)
  const type = String(res.headers['content-type'] || '').toLowerCase()
  if (type.includes('image/webp')) await sock.sendMessage(jid, { sticker: buf }, { quoted: m })
  else if (type.startsWith('image/')) await sock.sendMessage(jid, { image: buf }, { quoted: m })
  else { const webp = await toWebp(buf); if (!webp) throw new Error('Unsupported'); await sock.sendMessage(jid, { sticker: webp }, { quoted: m }) }
}
async function sendStickerFromUrl(sock, jid, m, url, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try {
      const res = await axios.get(url, { headers: HEADERS, responseType: 'arraybuffer', timeout: 60000, validateStatus: () => true })
      if (res.status !== 200) { if (i < retry - 1) await delay(2000); continue }
      const buf = Buffer.from(res.data)
      const webp = await toWebp(buf)
      if (!webp) { if (i < retry - 1) await delay(1500); continue }
      await sock.sendMessage(jid, { sticker: webp }, { quoted: m })
      return true
    } catch (e) { if (i < retry - 1) await delay(2000) }
  }
  await sock.sendMessage(jid, { text: warning('SERVER DOWN', ['Coba lagi nanti.']) }, { quoted: m })
  return false
}

function getPlugins() {
  try {
    const files = fs.readdirSync(PLUGIN_DIR).filter(f => f.endsWith('.json'))
    const plugins = {}
    for (const file of files) { try { const data = JSON.parse(fs.readFileSync(path.join(PLUGIN_DIR, file), 'utf-8')); plugins[file.replace('.json', '')] = data } catch {} }
    return plugins
  } catch { return {} }
}
const savePlugin = (name, data) => fs.writeFileSync(path.join(PLUGIN_DIR, `${name}.json`), JSON.stringify(data, null, 2))
const deletePlugin = name => { const file = path.join(PLUGIN_DIR, `${name}.json`); if (fs.existsSync(file)) { fs.unlinkSync(file); return true } return false }
const pluginExists = name => fs.existsSync(path.join(PLUGIN_DIR, `${name}.json`))

async function sendThreat(sock, jid, m, senderNum, warnCount) {
  const targetTag = `@${(m.key.participant || jid).split('@')[0]}`
  const d = fakeDox()
  const threat = `╭──「 [!] SYSTEM ALERT 」\n│\n│  Target     : ${targetTag}\n│  Status     : BLACKLISTED\n│  Hukuman    : BUG + DOX PUBLIK\n│  Pelanggaran: ${warnCount}x / ${MAX_WARN}\n│\n╰──────────────────────────\n\n╭──「 DATA TERDETEKSI 」\n│\n│  IP Address : ${d.ip}\n│  Provider   : ${d.provider}\n│  Lokasi     : ${d.kota}, Indonesia\n│  ISP        : ${d.isp}\n│  Device     : ${d.device}\n│  Alamat     : ${d.alamat}\n│  Koordinat  : ${d.koordinat}\n│  MAC Addr   : ${d.mac}\n│\n╰──────────────────────────\n\n╭──「 PAKET DIKIRIM 」\n│\n│  Paket    : 1x SARDEN + KECAP\n│  Kurir    : J&T Extreme\n│  Estimasi : HARI INI ${new Date().getHours()}:${String(new Date().getMinutes() + 30).padStart(2, '0')}\n│  Biaya    : Rp 0,- (GRATIS ONGKIR)\n│\n╰──────────────────────────\n\n╭──「 EFEK AKTIF 」\n│\n│  - WhatsApp lag 5 menit\n│  - Baterai bocor 50%\n│  - Sinyal drop mendadak\n│  - Auto-restart tiap jam\n│\n╰──────────────────────────\n\n  BATALIN? KETIK .MAAF`
  try { await sock.sendMessage(jid, { image: { url: ROAST_IMG }, caption: threat, mentions: [m.key.participant || jid] }, { quoted: m }) }
  catch { await sock.sendMessage(jid, { text: threat, mentions: [m.key.participant || jid] }, { quoted: m }) }
}

function printBanner() {
  console.clear()
  const tag = IS_JADIBOT ? ` [JADIBOT: ${PAIRING_NUMBER}]` : ''
  console.log(`\n\x1b[36m╔══════════════════════════════════════════════════╗\n║      \x1b[1m\x1b[33m${BOT_NAME}${tag}\x1b[0m\x1b[36m\n║      \x1b[0m\x1b[37mWhatsApp Bot - Powered by Baileys\x1b[0m\x1b[36m\n╚══════════════════════════════════════════════════╝\x1b[0m\n`)
}

function resolveSender(m, jid, isG, metadata) {
  const participantJid = isG ? (m.key.participant || jid) : jid
  const sources = []
  if (m.key.participantAlt) sources.push(m.key.participantAlt)
  if (m.key.remoteJidAlt) sources.push(m.key.remoteJidAlt)
  if (m.key.participantPn) sources.push(m.key.participantPn)
  if (m.key.senderPn) sources.push(m.key.senderPn)
  if (participantJid.endsWith('@s.whatsapp.net')) sources.push(participantJid)
  for (const src of sources) {
    const num = cleanNum(src)
    if (num.length >= 10 && num.length <= 15) return num
  }
  if (isG && metadata) {
    const cleanPJ = cleanNum(participantJid)
    const matched = metadata.participants.find(p => p.id === participantJid || cleanNum(p.id) === cleanPJ || (p.lid && p.lid === participantJid))
    if (matched) {
      for (const p of [matched.phoneNumber, matched.id].filter(Boolean)) {
        const num = cleanNum(p)
        if (num.length >= 10 && num.length <= 15) return num
      }
    }
  }
  return cleanNum(participantJid)
}

async function spawnJadibot(phone, ownerJid, mainSock) {
  const codeFile = `./jadibot-code-${phone}.txt`
  if (fs.existsSync(codeFile)) try { fs.unlinkSync(codeFile) } catch {}
  const child = spawn('node', ['index.js'], { cwd: process.cwd(), env: { ...process.env, PHONE_NUMBER: phone, IS_JADIBOT: '1', JADIBOT_CODE_FILE: codeFile }, detached: true, stdio: 'ignore' })
  child.unref()
  let code = null
  for (let i = 0; i < 40; i++) {
    await delay(500)
    if (fs.existsSync(codeFile)) { code = fs.readFileSync(codeFile, 'utf-8').trim(); try { fs.unlinkSync(codeFile) } catch {}; break }
  }
  return code
}

// ═══════════════ START BOT ═══════════════
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH)

  // ─── Ambil versi WA Web terbaru dengan fallback ───
  let waVersion = null
  try {
    const v = await fetchLatestWaWebVersion()
    waVersion = v?.version || null
    if (waVersion) console.log('\x1b[32m[✓] WA Web version:\x1b[0m', waVersion)
  } catch (e) {
    console.log('\x1b[33m[!] Gagal fetch versi WA, pakai default Baileys\x1b[0m')
  }

  const sock = makeWASocket({
    auth: state,
    ...(waVersion ? { version: waVersion } : {}),
    logger: pino({ level: 'fatal' }),
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    markOnlineOnConnect: false,
    syncFullHistory: false,
  })

  sock.ev.on('creds.update', saveCreds)
  let pairingRequested = false
  let reconnectAttempt = 0

  // ═══════════════ CONNECTION UPDATE ═══════════════
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    // ─── PAIRING CODE LOGIC (FIXED) ───
    if (qr && !pairingRequested && !sock.authState.creds.registered) {
      pairingRequested = true
      printBanner()

      let phone = String(PAIRING_NUMBER || '').replace(/[^0-9]/g, '')
      if (phone.startsWith('0')) phone = '62' + phone.slice(1)
      if (phone.startsWith('620')) phone = '62' + phone.slice(3)

      console.log(`\x1b[36m[📱]\x1b[0m Nomor   : \x1b[1m+${phone}\x1b[0m`)
      console.log(`\x1b[36m[📱]\x1b[0m Panjang : ${phone.length} digit\n`)

      if (phone.length < 10 || phone.length > 15) {
        console.log('\x1b[31m[❌] Nomor tidak valid! Cek env PHONE_NUMBER (contoh: 6282373800186).\x1b[0m\n')
        pairingRequested = false
        return
      }

      try {
        await delay(1500)

        const code = await sock.requestPairingCode(phone)
        if (!code || code.length < 6) throw new Error('Code invalid dari server')

        const formatted = code.match(/.{1,4}/g)?.join('-') || code

        console.log(`\x1b[32m╭──────────────────────────────────────────────╮\x1b[0m`)
        console.log(`\x1b[32m│\x1b[0m    \x1b[1m\x1b[33m✅ PAIRING CODE BERHASIL\x1b[0m                  \x1b[32m│\x1b[0m`)
        console.log(`\x1b[32m├──────────────────────────────────────────────┤\x1b[0m`)
        console.log(`\x1b[32m│\x1b[0m  \x1b[37mNomor :\x1b[0m \x1b[1m\x1b[36m+${phone.padEnd(32)}\x1b[0m\x1b[32m│\x1b[0m`)
        console.log(`\x1b[32m│\x1b[0m  \x1b[37mKode  :\x1b[0m \x1b[1m\x1b[33m${formatted.padEnd(32)}\x1b[0m\x1b[32m│\x1b[0m`)
        console.log(`\x1b[32m╰──────────────────────────────────────────────╯\x1b[0m`)
        console.log(`\x1b[33m👉 WhatsApp → Perangkat Tertaut → Tautkan dgn Nomor Telepon\x1b[0m`)
        console.log(`\x1b[31m⏰ Kode expired 60 detik! Masukkan TANPA strip (contoh: ${code}).\x1b[0m\n`)

        if (JADIBOT_CODE_FILE) {
          try { fs.writeFileSync(JADIBOT_CODE_FILE, formatted) } catch {}
        }
      } catch (e) {
        pairingRequested = false
        console.error(`\x1b[31m[❌] Gagal request code: ${e.message}\x1b[0m`)
        console.log('\x1b[33m💡 Tips: Hapus folder session di tab Files, lalu restart.\x1b[0m\n')
      }
    }

    // ─── CONNECTION CLOSE ───
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = code !== DisconnectReason.loggedOut

      console.log(`\x1b[31m[❌] Koneksi terputus (code: ${code})\x1b[0m`)

      if (code === 401) {
        try { fs.rmSync(SESSION_PATH, { recursive: true, force: true }) } catch {}
        console.log(`\x1b[33m[⚠️]\x1b[0m Session dihapus. Restart server untuk pairing baru.\n`)
        process.exit(0)
      }

      if (shouldReconnect && reconnectAttempt < 10) {
        reconnectAttempt++
        const waitTime = Math.min(5000 * reconnectAttempt, 30000)
        console.log(`\x1b[33m[🔄]\x1b[0m Reconnect attempt ${reconnectAttempt}/10 dalam ${waitTime/1000}s...\n`)
        setTimeout(() => {
          pairingRequested = false
          start()
        }, waitTime)
      }
    }

    // ─── CONNECTED ───
    if (connection === 'open') {
      reconnectAttempt = 0
      const myId = sock.user?.id?.split(':')[0] || '-'
      console.log(`\x1b[32m╭──────────────────────────────────────────────╮\x1b[0m`)
      console.log(`\x1b[32m│\x1b[0m   \x1b[1m\x1b[33m✅ ${BOT_NAME}${IS_JADIBOT ? ' (JADIBOT)' : ''} CONNECTED\x1b[0m\x1b[32m        │\x1b[0m`)
      console.log(`\x1b[32m│\x1b[0m   \x1b[37mUser: ${myId.padEnd(37)}\x1b[0m\x1b[32m│\x1b[0m`)
      console.log(`\x1b[32m╰──────────────────────────────────────────────╯\x1b[0m\n`)
      if (IS_JADIBOT && JADIBOT_CODE_FILE && fs.existsSync(JADIBOT_CODE_FILE)) {
        try { fs.unlinkSync(JADIBOT_CODE_FILE) } catch {}
      }
    }
  })

  // ═══════════════ WELCOME / LEAVE ═══════════════
  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    try {
      const welcomeData = getWelcome()
      const gData = welcomeData[id] || {}
      const meta = await sock.groupMetadata(id)
      const groupName = meta.subject

      if (action === 'add' && gData.welcomeOn === true) {
        for (const p of participants) {
          const pNum = p.split('@')[0]
          let ppUrl
          try { ppUrl = await sock.profilePictureUrl(p, 'image') } catch { ppUrl = THUMB }
          let text = gData.welcomeText || `Selamat datang @user\nDi grup {group}\nMember ke-{count}`
          const finalText = text
            .replace(/{push}/g, `@${pNum}`)
            .replace(/{group}/g, groupName)
            .replace(/{count}/g, meta.participants.length)
            .replace(/@user/g, `@${pNum}`)
          await sock.sendMessage(id, { image: { url: ppUrl }, caption: finalText, mentions: [p] })
            .catch(async () => { await sock.sendMessage(id, { text: finalText, mentions: [p] }) })
        }
      }
      if (action === 'remove' && gData.leaveOn === true) {
        for (const p of participants) {
          const pNum = p.split('@')[0]
          let ppUrl
          try { ppUrl = await sock.profilePictureUrl(p, 'image') } catch { ppUrl = THUMB }
          let text = gData.leaveText || `@user keluar grup\nDari {group}\nSisa: {count}`
          const finalText = text
            .replace(/{push}/g, `@${pNum}`)
            .replace(/{group}/g, groupName)
            .replace(/{count}/g, meta.participants.length)
            .replace(/@user/g, `@${pNum}`)
          await sock.sendMessage(id, { image: { url: ppUrl }, caption: finalText, mentions: [p] })
            .catch(async () => { await sock.sendMessage(id, { text: finalText, mentions: [p] }) })
        }
      }
    } catch (e) { console.log('Welcome event error:', e.message) }
  })

  // ═══════════════ MESSAGES ═══════════════
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    try {
    const jid = m.key.remoteJid
    const isG = jid.endsWith('@g.us')
    const isSelf = m.key.fromMe

    let metadata = null
    if (isG) { try { metadata = await sock.groupMetadata(jid) } catch {} }

    const sNum = resolveSender(m, jid, isG, metadata)
    const push = m.pushName || "User"

    let isAdmin = false, botAdmin = false, botNum = ''
    if (metadata) {
      botNum = cleanNum((sock.user.id || '').split(':')[0].split('@')[0])
      const botJid = botNum + '@s.whatsapp.net'
      const participantJid = m.key.participant || jid
      const senderP = metadata.participants.find(p => p.id === participantJid || cleanNum(p.id) === sNum)
      isAdmin = !!(senderP?.admin)
      const botP = metadata.participants.find(p => p.id === botJid || cleanNum(p.id) === botNum)
      botAdmin = !!(botP?.admin)
    }

    if (isBandUser(sNum) && !isDev(sNum) && !isO(sNum)) return
    if (isBanned(sNum) && !isDev(sNum) && !isO(sNum)) return

    const isOwner = isO(sNum) || isSelf || isDev(sNum)
    const isDevUser = isDev(sNum)
    const isPrem = isPremium(sNum) || getUserData(sNum).lv >= PREMIUM_LV_REQUIREMENT
    const role = getUserRole(sNum)

    if (getSelf() && !isOwner && !isDevUser) return

    if (isG && metadata) {
      const muted = getMuted()
      if (muted[jid] && muted[jid].map(cleanNum).includes(sNum) && !isOwner && !isDevUser) return
    }

    let txt = (m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || "").trim()

    let flow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
    if (flow) { try { txt = JSON.parse(flow).id } catch {} }
    if (!txt) return

    // ═══ AUTO MOD ═══
    if (isG && !isOwner && !isDevUser) {
      const gs = getGroupSettings()
      const currentGs = gs[jid] || {}
      if (currentGs.antilink === true) {
        const linkRegex = /(chat\.whatsapp\.com|wa\.me|http:\/\/|https:\/\/|t\.me|bit\.ly)/i
        if (linkRegex.test(txt)) {
          try { await sock.sendMessage(jid, { delete: m.key }) } catch {}
          const warnNow = addWarn(jid, sNum)
          const targetTag = `@${(m.key.participant || jid).split('@')[0]}`
          await react(sock, jid, m, "🚫")
          if (warnNow >= MAX_WARN) {
            await sendThreat(sock, jid, m, sNum, warnNow)
            resetWarn(jid, sNum)
            try { if (botAdmin) { await delay(3000); await sock.groupParticipantsUpdate(jid, [m.key.participant], 'remove') } } catch {}
          } else {
            await sock.sendMessage(jid, { text: warning('ANTI-LINK', [`${targetTag} jangan kirim link!`, `Warn: ${warnNow}/${MAX_WARN}`]), mentions: [m.key.participant || jid] }, { quoted: m })
          }
          return
        }
      }
      if (currentGs.antitoxic === true) {
        const badwords = ['anjing','anjg','bangsat','bngst','kontol','kntl','memek','goblok','gblk','tolol','idiot','bego','ngentot','jancok','jancuk','asu','peler']
        const txtLower = txt.toLowerCase().replace(/[^a-z0-9 ]/g, '')
        const found = badwords.find(bw => txtLower.includes(bw))
        if (found) {
          try { await sock.sendMessage(jid, { delete: m.key }) } catch {}
          const warnNow = addWarn(jid, sNum)
          const targetTag = `@${(m.key.participant || jid).split('@')[0]}`
          await react(sock, jid, m, "⚠️")
          if (warnNow >= MAX_WARN) {
            await sendThreat(sock, jid, m, sNum, warnNow)
            resetWarn(jid, sNum)
            try { if (botAdmin) { await delay(3000); await sock.groupParticipantsUpdate(jid, [m.key.participant], 'remove') } } catch {}
          } else {
            await sock.sendMessage(jid, { text: warning('ANTI-TOXIC', [`${targetTag} jangan kasar!`, `Kata: ${found}`, `Warn: ${warnNow}/${MAX_WARN}`]), mentions: [m.key.participant || jid] }, { quoted: m })
          }
          return
        }
      }
    }

    if (!isOwner && !isDevUser && txt && checkSpam(sNum)) {
      spamTracker[sNum] = []; saveSpamTracker()
      const warnNow = addWarn(jid, sNum)
      const targetTag = `@${(m.key.participant || jid).split('@')[0]}`
      await react(sock, jid, m, "🚨")
      if (warnNow >= MAX_WARN) {
        await sendThreat(sock, jid, m, sNum, warnNow)
        resetWarn(jid, sNum)
        if (isG && botAdmin) { try { await delay(3000); await sock.groupParticipantsUpdate(jid, [m.key.participant], 'remove') } catch {} }
      } else {
        await sock.sendMessage(jid, { text: warning('ANTI-SPAM', [`${targetTag} STOP SPAM!`, `Warn: ${warnNow}/${MAX_WARN}`]), mentions: [m.key.participant || jid] }, { quoted: m })
      }
      return
    }

    const leveledUp = updateUserLevel(sNum)
    if (leveledUp) { try { await sock.sendMessage(jid, { text: success('LEVEL UP', [`@${sNum} naik ke LV ${getUserData(sNum).lv}!`]), mentions: [m.key.participant || jid] }) } catch {} }

    const up = process.uptime()
    const jUp = Math.floor(up / 3600), mUp = Math.floor((up % 3600) / 60), sUp = Math.floor(up % 60)
    const tgl = formatTanggal(), jam = formatJam()
    const userData = getUserData(sNum)
    const userLv = userData.lv || 1

    const buttonIds = [
      "allmenu","menu","help","category","information","contact_owner",
      "bugmenu","ownermenu","pluginmenu","premiummenu","devmenu",
      "groupmenu","toolsmenu","mediamenu","aimenu","listdev",
      "downloadmenu","dlmenu","stickermenu","stikermenu","funmenu",
      "randommenu","infomenu","adminlist","cekwarn","listplugin",
      "gamemenu","imagemenu","islamicmenu","kristenmenu","christianmenu",
      "contactmenu","kontakmenu","businessmenu","bisnismenu",
      "musicmenu","utilitymenu","scriptmenu"
    ]
    let isCmd = false, cmd = "", args = [], q = ""
    if (buttonIds.includes(txt.toLowerCase())) { isCmd = true; cmd = txt.toLowerCase() }
    else if (txt.startsWith(PREFIX) || txt.startsWith('!')) {
      isCmd = true
      args = txt.slice(1).trim().split(/ +/)
      cmd = (args.shift() || '').toLowerCase()
      q = args.join(" ")
    }

    const hasPrefix = txt.startsWith(PREFIX) || txt.startsWith('!')
    const isButton = buttonIds.includes(txt.toLowerCase())
    if (!hasPrefix && !isButton) return

    const reply = async t => await sock.sendMessage(jid, { text: t }, { quoted: m })
    const replyImg = async t => await sock.sendMessage(jid, { image: { url: THUMB }, caption: t }, { quoted: m })

    const replyRoast = async () => {
      const texts = [
        success('ACCESS DENIED', ['Kamu siapa? Owner aja kagak.', `Owner asli: ${OWNER}`]),
        warning('BUKAN BUAT LU', ['Command ini khusus Owner & Dev.']),
        errorUI('HALT!', ['Level lo belum cukup buat command ini.']),
      ]
      await sock.sendMessage(jid, { image: { url: ROAST_IMG }, caption: texts[Math.floor(Math.random() * texts.length)] }, { quoted: m })
    }
    const replyPremiumOnly = async () => {
      await sock.sendMessage(jid, { image: { url: ROAST_IMG }, caption: warning('PREMIUM ONLY', ['Fitur ini khusus Premium!', `Level kamu: ${userLv}`, `Butuh LV: ${PREMIUM_LV_REQUIREMENT}`]) }, { quoted: m })
    }

    const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quotedUser = m.message.extendedTextMessage?.contextInfo?.participant

    // ═══════════════ MENU UTAMA ═══════════════
    if (cmd === "menu" || cmd === "help") {
      await react(sock, jid, m, "⏳")
      const hour = new Date().getHours()
      const greeting = hour < 11 ? "Pagi" : hour < 15 ? "Siang" : hour < 18 ? "Sore" : "Malam"
      const plugins = getPlugins()

      const t = `*Haloo* ${push} 👋

Halo *${push}*, selamat ${greeting}.

╭─〔 USER PROFILE 〕
│ Nama   : ${push}
│ Role   : ${role}
│ Level  : ${userLv}
│ Pesan  : ${userData.totalMessages || 1}
│ Prefix : ${PREFIX}
╰──────────

╭─〔 BOT STATUS 〕
│ Uptime  : ${jUp}j ${mUp}m ${sUp}d
│ Waktu   : ${jam}
│ Tanggal : ${tgl}
│ Owner   : ${OWNER}
│ Self    : ${getSelf() ? "ON" : "OFF"}
│ Plugin  : ${Object.keys(plugins).length} aktif
╰──────────

${readmore}.allmenu untuk melihat semua menu`

      const tasks = [
        (async () => { try { await sock.sendMessage(jid, { audio: { url: AUDIO }, mimetype: 'audio/mp4', ptt: false }) } catch {} })(),
        (async () => {
          try {
            const media = await prepareWAMessageMedia(
              { image: { url: THUMB } },
              { upload: sock.waUploadToServer }
            )
            const interactiveMessage = proto.Message.InteractiveMessage.create({
              header: proto.Message.InteractiveMessage.Header.create({
                title: BOT_NAME,
                hasMediaAttachment: true,
                imageMessage: media.imageMessage,
              }),
              body: proto.Message.InteractiveMessage.Body.create({ text: t }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: `© ${BOT_NAME}` }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "Contact Owner (+62 858-2067-3526)",
                      url: `https://wa.me/${OWNER}`,
                      merchant_url: `https://wa.me/${OWNER}`,
                    }),
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "Information",
                      url: "https://whatsapp.com/channel/0029VbBup818qJ013J1oJ63d",
                      merchant_url: "https://whatsapp.com/channel/0029VbBup818qJ013J1oJ63d",
                    }),
                  },
                ],
              }),
            })
            const messageContent = proto.Message.create({
              messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
              interactiveMessage,
            })
            await sock.relayMessage(jid, { viewOnceMessage: { message: messageContent } }, {})
          } catch (err) {
            console.error('Gagal mengirim menu Native Flow:', err.message)
            await sock.sendMessage(jid, { image: { url: THUMB }, caption: t }, { quoted: m })
          }
        })(),
      ]
      await Promise.allSettled(tasks)
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ SCRIPTBLOX SEARCH ═══════════════
    if (cmd === "search" || cmd === "sblox" || cmd === "rbx" || cmd === "script") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}search <query>`, `Contoh: ${PREFIX}search blox fruit`]))
      await react(sock, jid, m, "🔍")
      await replyImg(`🔎 *Mencari script "${q}"...*`)

      try {
        const scripts = await scriptbloxSearch(q)
        if (!scripts.length) {
          await react(sock, jid, m, "❌")
          return replyImg(errorUI('GAK KETEMU', [`Script "${q}" gak nemu.`, 'Coba keyword lain!']))
        }

        scriptSearchCache[sNum] = { query: q, scripts: scripts.slice(0, 10), time: Date.now() }
        const maxSend = Math.min(scripts.length, 5)

        await replyImg(`✅ *Dapet ${scripts.length} script!*\n\nNih ${maxSend} teratas:`)

        for (const [i, s] of scripts.slice(0, maxSend).entries()) {
          const type = (s.scriptType || '').toLowerCase() === 'free' ? '🟢 FREE' : '🔴 PAID'
          const verif = s.verified ? ' ✅' : ''
          const keySys = s.keySystem ? ' 🔑' : ''
          const caption = `╭──「 *SCRIPT #${i + 1}* 」\n│\n│ 🎮 ${String(s.game?.name || '-').slice(0, 28)}\n│ 📦 ${type}${keySys}${verif}\n│ 👁 ${formatViews(s.views)} views\n│ 👤 ${String(s.user?.username || 'unknown').slice(0, 25)}\n│ 🔗 https://scriptblox.com/script/${s.slug}\n│\n╰──────────────────────────`
          try { await sock.sendMessage(jid, { image: { url: getScriptThumb(s) }, caption }, i === 0 ? { quoted: m } : {}) }
          catch { await reply(caption) }
          await delay(800)
        }
        await replyImg(`💡 *${PREFIX}getscript <no>* — ambil kodenya\n💡 *${PREFIX}getscript info <no>* — detail script\n\n_Total ${scripts.length} hasil, cuma ${maxSend} yang ditampilin._`)
        await react(sock, jid, m, "✅")
      } catch (e) {
        await react(sock, jid, m, "❌")
        return replyImg(errorUI('ERROR', [e.message || 'ScriptBlox lagi down, coba nanti.']))
      }
      return
    }

    // ═══════════════ GET SCRIPT ═══════════════
    if (cmd === "getscript" || cmd === "gs") {
      const cache = scriptSearchCache[sNum]
      if (!cache) return replyImg(errorUI('BELUM SEARCH', [`Ketik ${PREFIX}search <query> dulu.`]))
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}getscript <no|all|info>`]))
      const arg = q.toLowerCase().trim()
      if (arg === 'all') {
        await react(sock, jid, m, "📜")
        await replyImg(info('MENGIRIM SEMUA', [`${cache.scripts.length} script`, 'Tunggu...']))
        for (const [i, s] of cache.scripts.entries()) {
          try {
            const detail = await scriptbloxGet(s.slug)
            const code = detail?.script || s.script || '-- code gak tersedia --'
            const caption = `╭──「 ${i + 1}. ${s.title} 」\n│ 🎮 ${s.game?.name || '-'}\n│ 🔗 https://scriptblox.com/script/${s.slug}\n╰──────────────────────────`
            try { await sock.sendMessage(jid, { image: { url: getScriptThumb(s) }, caption }, { quoted: m }) }
            catch { await reply(caption) }
            await delay(400)
            await reply('```lua\n' + String(code).slice(0, 3000) + '\n```')
            await delay(800)
          } catch (e) { await reply(errorUI('GAGAL', [`${s.title}: ${e.message}`])) }
        }
        await react(sock, jid, m, "✅")
        return
      }
      if (arg.startsWith('info')) {
        const n = parseInt(arg.replace(/[^0-9]/g, '')) - 1
        if (isNaN(n) || n < 0 || n >= cache.scripts.length) return replyImg(errorUI('NOMOR SALAH', [`Range 1-${cache.scripts.length}`]))
        const s = cache.scripts[n]
        const caption = `╭──「 ${s.title} 」\n│ 🎮 Game: ${s.game?.name || '-'}\n│ 📦 Tipe: ${s.scriptType || '-'}\n│ 🔑 KeySys: ${s.keySystem ? 'YA' : 'TIDAK'}\n│ ✅ Verified: ${s.verified ? 'YA' : 'TIDAK'}\n│ 👁 Views: ${formatViews(s.views)}\n│ 👤 Creator: ${s.user?.username || '-'}\n│ 📅 Update: ${s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('id-ID') : '-'}\n│ 🔗 Link: https://scriptblox.com/script/${s.slug}\n╰──────────────────────────` + (s.features ? `\n\n📝 Fitur:\n${String(s.features).slice(0, 600)}` : '')
        try { await sock.sendMessage(jid, { image: { url: getScriptThumb(s) }, caption }, { quoted: m }) }
        catch { await reply(caption) }
        return
      }
      const idx = parseInt(arg) - 1
      if (isNaN(idx) || idx < 0 || idx >= cache.scripts.length) return replyImg(errorUI('NOMOR SALAH', [`Range 1-${cache.scripts.length}`]))
      const s = cache.scripts[idx]
      await react(sock, jid, m, "📥")
      let fullScript = s.script
      if (!fullScript) { try { const detail = await scriptbloxGet(s.slug); fullScript = detail?.script } catch {} }
      if (!fullScript) return replyImg(errorUI('GAGAL', ['Kode script gak bisa diambil.']))
      const caption = `╭──「 ${s.title} 」\n│ 🎮 Game: ${s.game?.name || '-'}\n│ 📦 Tipe: ${s.scriptType || '-'}${s.keySystem ? ' 🔑 KEY' : ''}\n│ 👁 Views: ${formatViews(s.views)}\n│ 👤 Creator: ${s.user?.username || '-'}\n│ 🔗 Link: https://scriptblox.com/script/${s.slug}\n╰──────────────────────────\n\n📜 KODE SCRIPT:`
      try { await sock.sendMessage(jid, { image: { url: getScriptThumb(s) }, caption }, { quoted: m }) }
      catch { await reply(caption) }
      await delay(500)
      await reply('```lua\n' + String(fullScript).slice(0, 3000) + '\n```')
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ SCRIPT MENU ═══════════════
    if (cmd === "scriptmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('SCRIPT MENU', 'ScriptBlox Roblox', push, role, userLv)}${readmore}
${menuCat('SEARCH', ['.search <query>|Cari script + foto','.sblox <query>|Alias search','.rbx <query>|Alias pendek'])}
${menuCat('AMBIL SCRIPT', ['.getscript <no>|Ambil kode + foto','.getscript all|Semua kode','.getscript info <no>|Detail script','.gs <no>|Alias'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ BUG MENU ═══════════════
    if (cmd === "bugmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('BUG MENU', 'Premium & Dev only', push, role, userLv)}${readmore}
${menuCat('CRASH SYSTEM', ['.delayhard|Hard Crash','.crashios|iOS Crash','.forclose|Force Close','.fc|Brutal FC 100%'])}
${menuCat('INVISIBLE POWER', ['.delayinvis|Invisible','.blank|Blank Screen','.superblank|Super Blank','.delayeasy|Easy Delay'])}
${menuCat('SPAM DEWA', ['.delayspm|Spam Delay','.jembuot|Jembuot Ganas'])}
${menuCat('BAND SYSTEM', ['.band 628xx|Blokir user','.unband 628xx|Buka blokir','.listband|List blokir'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Owner", id: "ownermenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Premium", id: "premiummenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_BUG }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_BUG }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ OWNER MENU ═══════════════
    if (cmd === "ownermenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('OWNER MENU', 'Full access', push, role, userLv)}${readmore}
${menuCat('OWNER CONTROL', ['.owner|VCard Owner','.listowner|List Owner','.addowner 62|Add Owner','.delowner 62|Hapus Owner'])}
${menuCat('DEV CONTROL', ['.adddev 62|Add Dev','.deldev 62|Hapus Dev','.listdev|List Dev'])}
${menuCat('BAN SYSTEM', ['.ban 628xx|Ban user','.unban 628xx|Unban','.listban|List banned'])}
${menuCat('BAND SYSTEM', ['.band 628xx|Band user','.unband 628xx|Unband','.listband|List band'])}
${menuCat('SYSTEM', ['.join <link>|Join grup','.out|Leave grup','.restart|Restart bot','.self on/off|Self mode'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Premium", id: "premiummenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Dev", id: "devmenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_OWNER }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_OWNER }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ DEV MENU ═══════════════
    if (cmd === "devmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('DEV MENU', 'Developer tools', push, role, userLv)}${readmore}
${menuCat('PREMIUM CONTROL', ['.addpremium 62|Add Premium','.delpremium 62|Hapus Premium','.listpremium|List Premium'])}
${menuCat('DEV CONTROL', ['.adddev 62|Add Dev','.deldev 62|Hapus Dev','.listdev|List Dev'])}
${menuCat('OWNER CONTROL', ['.addowner 62|Add Owner','.delowner 62|Hapus Owner','.listowner|List Owner'])}
${menuCat('LEVEL SYSTEM', ['.addlv 62 500|Tambah LV','.unlv 62 100|Kurang LV','.resetlv 62|Reset LV','.cekuser 62|Info user'])}
${menuCat('JADIBOT', ['.jadibot 62|Bikin bot','.listjadibot|List bot','.stopjadibot 62|Stop bot'])}
${menuCat('SYSTEM', ['.dev|Kontak Dev','.self on/off|Self mode','.restart|Restart','.broadcast <text>|Broadcast'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Premium", id: "premiummenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Dev Contact", id: "listdev" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_DEV }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_DEV }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ PREMIUM MENU ═══════════════
    if (cmd === "premiummenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('PREMIUM MENU', 'Premium access', push, role, userLv)}${readmore}
${menuCat('PREMIUM CONTROL', ['.addpremium 62|Tambah','.delpremium 62|Hapus','.listpremium|List'])}
${menuCat('AKSES PREMIUM', ['Semua Tools','Bug Menu (Semua)','Media (brat, iqc, nokia)','AI Unlimited','TikTok, YouTube','Downloader All'])}
${menuCat('SYARAT', ['Di-add manual oleh Dev',`Atau capai LV ${PREMIUM_LV_REQUIREMENT}`])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Dev", id: "devmenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_PREMIUM }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_PREMIUM }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ GROUP MENU ═══════════════
    if (cmd === "groupmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('GROUP MENU', '100 Command', push, role, userLv)}${readmore}
${menuCat('1. MEMBER CONTROL', [
  '.kick @user|Kick 1 user',
  '.add 628xx|Add member',
  '.promote @user|Promote',
  '.demote @user|Demote',
  '.kickall|Kick semua',
  '.promoteall|Promote semua',
  '.demoteall|Demote semua',
  '.kickadmin|Kick admin',
  '.kickinactive|Kick inactive',
  '.kickbot|Kick bot',
])}
${menuCat('2. GROUP SETTINGS', [
  '.lock|Tutup grup',
  '.unlock|Buka grup',
  '.close|Close',
  '.open|Open',
  '.setname <text>|Ganti nama',
  '.setdesc <text>|Ganti desc',
  '.setppgroup|Set PP grup',
  '.link|Link invite',
  '.revoke|Reset link',
  '.groupinfo|Info grup',
])}
${menuCat('3. TAG & MENTION', [
  '.tagall|Tag semua',
  '.hidetag|Hidetag',
  '.tagadmin|Tag admin',
  '.tagmember|Tag member',
  '.tagme|Tag diri',
  '.mentionall|Mention all',
  '.tagrandom|Tag random',
  '.tagaktif|Tag aktif',
  '.tagjoin|Tag yang join',
  '.tagnew|Tag member baru',
])}
${menuCat('4. WELCOME / LEAVE', [
  '.welcome on/off|Toggle welcome',
  '.setwelcome <text>|Set text',
  '.resetwelcome|Reset',
  '.getwelcome|Lihat text',
  '.leave on/off|Toggle leave',
  '.setleave <text>|Set text',
  '.resetleave|Reset',
  '.getleave|Lihat text',
  '.welcomepp on/off|Pakai PP user',
  '.testwelcome|Test welcome',
])}
${menuCat('5. AUTO MODERATION', [
  '.antilink on/off',
  '.antitoxic on/off',
  '.antispam on/off',
  '.antibot on/off',
  '.antidelete on/off',
  '.antifoto on/off',
  '.antisticker on/off',
  '.antivideo on/off',
  '.antiaudio on/off',
  '.antidocument on/off',
])}
${menuCat('6. WARN & MUTE', [
  '.warn @user|Warn user',
  '.unwarn @user|Hapus warn',
  '.cekwarn|Cek warn',
  '.listwarn|List pelanggar',
  '.resetwarn|Reset semua',
  '.maaf|Minta maaf',
  '.mute @user|Mute user',
  '.unmute @user|Unmute',
  '.muteall|Mute semua',
  '.listmute|List mute',
])}
${menuCat('7. ANTI FEATURES', [
  '.antifake on/off',
  '.antijudol on/off',
  '.antipromosi on/off',
  '.antispamlink on/off',
  '.antispamtoxic on/off',
  '.antibroadcast on/off',
  '.antiaudioall on/off',
  '.antivideoall on/off',
  '.antiforward on/off',
  '.antistatus on/off',
])}
${menuCat('8. GROUP INFO', [
  '.listmember|List member',
  '.adminlist|List admin',
  '.listadmin|List admin v2',
  '.countmember|Hitung member',
  '.groupstats|Statistik grup',
  '.topaktif|Top aktif',
  '.memberjoin|Member join',
  '.memberleave|Member leave',
  '.lastseen|Last seen',
  '.online|Cek online',
])}
${menuCat('9. POLL & VOTE', [
  '.poll <tanya>|Buat poll',
  '.votepoll <nomor>|Vote poll',
  '.closepoll|Tutup poll',
  '.pollresult|Hasil poll',
  '.vote <pilihan>|Vote',
  '.votestart|Mulai vote',
  '.votestop|Stop vote',
  '.votestatus|Status vote',
  '.votelist|List vote',
  '.votecount|Hitung vote',
])}
${menuCat('10. ADVANCED', [
  '.groupreset|Reset data grup',
  '.groupbackup|Backup grup',
  '.grouprestore|Restore grup',
  '.grouplockall|Lock semua',
  '.groupunlockall|Unlock semua',
  '.groupcloseall|Close semua',
  '.groupopenall|Open semua',
  '.groupclean|Bersihkan',
  '.groupleave|Leave grup',
  '.grouprejoin|Rejoin grup',
])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Admin List", id: "adminlist" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Cek Warn", id: "cekwarn" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_GROUP }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_GROUP }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ PLUGIN MENU ═══════════════
    if (cmd === "pluginmenu") {
      await react(sock, jid, m, "⏳")
      const plugins = getPlugins()
      const t = `${menuHeader('PLUGIN MENU', `${Object.keys(plugins).length} aktif`, push, role, userLv)}${readmore}
${menuCat('PLUGIN CONTROL', ['.addplugin nama|resp','.delplugin nama','.listplugin'])}
${menuCat('FORMAT', ['Text  : .addplugin halo|Halo','Image : .addplugin foto|Cap|image|URL','Audio : .addplugin lagu|Desc|audio|URL'])}
${menuCat('VARIABLE', ['{push}     Nama user','{uptime}   Waktu aktif','{time}     Jam sekarang','{date}     Tanggal','{owner}    Nomor owner','{botname}  Nama bot','{sender}   Nomor sender','{role}     Role user','{lv}       Level user'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "List Plugin", id: "listplugin" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_PLUGIN }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_PLUGIN }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ TOOLS MENU ═══════════════
    if (cmd === "toolsmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('TOOLS MENU', 'Utilities', push, role, userLv)}${readmore}
${menuCat('INFO', ['.cuaca <kota>|Cek cuaca','.jarak a|b|Jarak kota','.gempa|Info gempa','.wikipedia <topik>|Wiki'])}
${menuCat('WEB', ['.ssweb <url>|Screenshot web','.web2zip <url>|Web to ZIP'])}
${menuCat('UTILITY', ['.shortlink <url>|Short URL','.qrcode <text>|Bikin QR','.readmore <text>|Read more','.calc <expr>|Kalkulator','.ping|Cek latency'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_TOOLS }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_TOOLS }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ DOWNLOAD MENU ═══════════════
    if (cmd === "downloadmenu" || cmd === "dlmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('DOWNLOAD MENU', 'Media downloader', push, role, userLv)}${readmore}
${menuCat('YT', ['.ytplay <judul>|YT Audio','.ytsearch <judul>|YT Search','.ytmp3 <url>|YT MP3','.ytmp4 <url>|YT MP4'])}
${menuCat('SOSMED', ['.tt <url>|TikTok','.ig <url>|Instagram','.fb <url>|Facebook','.tw <url>|Twitter/X','.pinterest <q>|Pinterest','.spotify <url>|Spotify'])}
${menuCat('OTHER', ['.soundcloud <url>|SoundCloud','.capcut <url>|CapCut','.likee <url>|Likee','.mediafire <url>|MediaFire','.terabox <url>|TeraBox'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_DL }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_DL }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ STICKER MENU ═══════════════
    if (cmd === "stickermenu" || cmd === "stikermenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('STICKER MENU', 'Sticker maker', push, role, userLv)}${readmore}
${menuCat('STICKER', ['.s / .sticker|Reply media','.rvo|View once','.brat <text>','.bratvid <text>','.bratpatrick <text>','.bratvid2 <text>','.iqc <text|jam|url>','.nokia <text>'])}
${menuCat('CONVERT', ['.toimage|Sticker to image','.togif|Sticker to GIF','.attp <text>|ATTP animated','.ttp <text>|TTP text'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_STICKER }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_STICKER }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ AI MENU ═══════════════
    if (cmd === "aimenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('AI MENU', 'Artificial Intelligence', push, role, userLv)}${readmore}
${menuCat('CHAT AI', ['.ai <tanya>|AI Chat','.gpt4 <tanya>|GPT-4','.deepseek <tanya>|DeepSeek','.chatgptpro <t>|ChatGPT Pro','.gemini <tanya>|Google Gemini','.claude <tanya>|Claude AI','.llama <tanya>|Llama AI'])}
${menuCat('IMAGE AI', ['.aiimage <prompt>|Generate image','.removebg (reply)|Hapus BG','.upscale (reply)|Upscale','.remini (reply)|HD kan'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_AI }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_AI }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ MEDIA MENU ═══════════════
    if (cmd === "mediamenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('MEDIA MENU', 'All media tools', push, role, userLv)}${readmore}
${menuCat('MEDIA', ['.s / .sticker|Sticker','.rvo|View once','.tt <url>|TikTok','.ytplay <judul>|YT Audio','.brat <text>|Brat sticker','.iqc|IQC','.nokia <text>|Nokia'])}
${menuCat('CONVERT', ['.toimage|Sticker to img','.togif|Sticker to gif','.toaudio|Video to audio','.tovideo|Audio to video'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_MEDIA }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_MEDIA }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ FUN MENU ═══════════════
    if (cmd === "funmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('FUN MENU', 'Have fun', push, role, userLv)}${readmore}
${menuCat('GAME', ['.slot|Slot machine','.dadu|Dadu','.coinflip|Coin flip','.truth|Truth','.dare|Dare','.suit <p>|Suit vs bot'])}
${menuCat('QUIZ', ['.tebaktebakan|Tebak-tebakan','.asahotak|Asah otak','.kuis|Kuis random','.trivia|Trivia'])}
${menuCat('FUN', ['.gombalan|Gombalan','.pickupline|Pickup line','.jokes|Jokes','.pantun|Pantun','.katabijak|Kata bijak'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_FUN }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_FUN }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ RANDOM MENU ═══════════════
    if (cmd === "randommenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('RANDOM MENU', 'Random content', push, role, userLv)}${readmore}
${menuCat('RANDOM', ['.quote|Random quote','.gempa|Info gempa','.wikipedia <topik>|Wiki','.faktaunik|Fakta unik','.randomnama|Random nama','.randomnomor|Random nomor'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_RANDOM }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_RANDOM }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ INFO MENU ═══════════════
    if (cmd === "infomenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('INFO MENU', 'Information', push, role, userLv)}${readmore}
${menuCat('INFO', ['.gempa|Info gempa','.wikipedia <topik>|Wikipedia','.cuaca <kota>|Cuaca','.jarak a|b|Jarak kota','.kurs|Kurs mata uang','.crypto <coin>|Harga crypto'])}
${menuCat('BERITA', ['.berita|Berita terkini','.cnn|Berita CNN','.detik|Berita Detik','.kompas|Berita Kompas'])}
${menuFooter()}`
      const btn = [{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) }]
      try { await sock.sendMessage(jid, { image: { url: THUMB_INFO }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_INFO }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ GAME MENU ═══════════════
    if (cmd === "gamemenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('GAME MENU', 'Fun & games', push, role, userLv)}${readmore}
${menuCat('TEBAK-TEBAKAN', ['.tebakgambar|Tebak gambar','.tebakkata|Tebak kata','.tebaklirik|Tebak lirik','.tebakanime|Tebak anime','.tebaklagu|Tebak lagu','.tebakfilm|Tebak film'])}
${menuCat('KATA', ['.susunkata|Susun kata','.kuis|Kuis random','.trivia|Trivia','.hangman|Hangman','.scramble|Scramble'])}
${menuCat('CLASSIC', ['.suit <pilihan>|Suit vs bot','.slot|Slot machine','.dadu|Dadu','.coinflip|Coin flip','.family100|Family 100'])}
${menuCat('SCORE', ['.leaderboard|Top player','.myscore|Score kamu','.resetgame|Reset game'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Suit", id: "suit" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Slot", id: "slot" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_GAME }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_GAME }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ IMAGE MENU ═══════════════
    if (cmd === "imagemenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('IMAGE MENU', 'Image editor', push, role, userLv)}${readmore}
${menuCat('EDIT', ['.remini (reply)|HD kan foto','.removebg (reply)|Hapus BG','.blur (reply)|Blur foto','.pixelate (reply)|Pixelate','.invert (reply)|Invert warna','.grayscale (reply)|Hitam putih'])}
${menuCat('EFFECT', ['.naruto (reply)|Efek naruto','.jail (reply)|Efek jail','.wanted (reply)|Poster wanted','.triggered (reply)|Triggered','.passed (reply)|Passed'])}
${menuCat('TEXT IMAGE', ['.attp <text>|ATTP animated','.ttp <text>|TTP text','.carbon <code>|Carbon code','.quoteimg <text>|Quote image','.memegen <text>|Meme generator'])}
${menuCat('EMOJI', ['.emojimix 😂+😭|Gabung emoji','.emojitoimg 😀|Emoji to img'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Remini", id: "remini" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "RemoveBG", id: "removebg" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_IMAGE }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_IMAGE }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ ISLAMIC MENU ═══════════════
    if (cmd === "islamicmenu" || cmd === "islamimenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('ISLAMIC MENU', 'Konten Islami', push, role, userLv)}${readmore}
${menuCat('AL-QURAN', ['.surah <nama>|Surah lengkap','.ayat <surah:ayat>|Ayat tertentu','.tafsir <surah:ayat>|Tafsir ayat','.juz <nomor>|Juz Al-Quran'])}
${menuCat('SHOLAT', ['.jadwalsholat <kota>|Jadwal sholat','.niat <sholat>|Niat sholat','.doaharian|Doa sehari-hari','.doapilihan|Doa pilihan'])}
${menuCat('DZIKIR', ['.asmaulhusna|99 nama Allah','.dzikir|Dzikir random','.tahlil|Bacaan tahlil','.istighfar|Istighfar'])}
${menuCat('PENGETAHUAN', ['.kisahnabi <nama>|Kisah nabi','.hadits|Hadits random','.fiqih <topik>|Fiqih','.kajian|Kajian singkat'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Jadwal Sholat", id: "jadwalsholat" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu Kristen", id: "kristenmenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_ISLAMIC }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_ISLAMIC }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ KRISTEN MENU ═══════════════
    if (cmd === "kristenmenu" || cmd === "christianmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('KRISTEN MENU', 'Konten Kristen', push, role, userLv)}${readmore}
${menuCat('ALKITAB', ['.alkitab <kitab>|Baca Alkitab','.ayatkristen <kitab:ayat>|Ayat tertentu','.injil|Injil hari ini','.mazmur|Mazmur','.amsal|Amsal'])}
${menuCat('DOA', ['.doakristen|Doa harian','.doapagi|Doa pagi','.doamalam|Doa malam','.bapakami|Doa Bapa Kami','.salamMaria|Doa Salam Maria'])}
${menuCat('PUJIAN', ['.lagu <judul>|Lirik lagu rohani','.pujian|Pujian random','.kidung|Kidung Jemaat','.nkb|Nyanyikanlah Kidung Baru'])}
${menuCat('PENGETAHUAN', ['.renungan|Renungan harian','.kisahalkitab|Kisah Alkitab','.firman|Firman hari ini','.katekismus|Katekismus'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Alkitab", id: "alkitab" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Bapa Kami", id: "bapakami" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_KRISTEN }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_KRISTEN }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ KONTAK BISNIS ═══════════════
    if (cmd === "contactmenu" || cmd === "kontakmenu" || cmd === "businessmenu" || cmd === "bisnismenu") {
      await react(sock, jid, m, "⏳")
      let t = `${menuHeader('KONTAK BISNIS', 'Business directory', push, role, userLv)}${readmore}\n\n`
      BUSINESS_CONTACTS.forEach((c, i) => {
        t += `╭──「 ${c.status} ${c.nama} 」\n`
        t += `│\n`
        t += `│  Kategori   : ${c.kategori}\n`
        t += `│  Deskripsi  : ${c.deskripsi}\n`
        t += `│  Jam Buka   : ${c.jam}\n`
        t += `│  Nomor      : wa.me/${c.nomor}\n`
        t += `│\n`
        t += `╰──────────────────────────\n\n`
      })
      t += `  Info: Klik nomor di atas buat chat\n  Bukan kontak bot, tapi bisnis partner\n\n`
      t += `${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Kontak Owner", id: "contact_owner" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Kontak Dev", id: "listdev" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_CONTACT }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_CONTACT }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ MUSIC MENU ═══════════════
    if (cmd === "musicmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('MUSIC MENU', 'Music & audio', push, role, userLv)}${readmore}
${menuCat('PLAY', ['.ytplay <judul>|YT Audio','.ytsearch <judul>|YT Search','.ytmp3 <url>|YT MP3','.ytmp4 <url>|YT MP4'])}
${menuCat('INFO', ['.lirik <judul>|Cari lirik','.chord <judul>|Chord gitar','.spotify <url>|Spotify down','.shazam (reply audio)|Identify song'])}
${menuCat('OTHER', ['.soundcloud <url>|SoundCloud','.playlist|Random playlist','.radio|Radio online'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "YTPlay", id: "ytplay" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Lirik", id: "lirik" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_MUSIC }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_MUSIC }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ UTILITY MENU ═══════════════
    if (cmd === "utilitymenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('UTILITY MENU', 'Kalkulator & tools', push, role, userLv)}${readmore}
${menuCat('HITUNG', ['.calc <expression>|Kalkulator','.bmi <bb> <tb>|Hitung BMI','.umur <tgl_lahir>|Hitung umur','.diskon <harga> <persen>|Diskon','.pajak <harga>|Hitung pajak','.splitbill <total> <orang>|Split bill'])}
${menuCat('CATATAN', ['.notes|Simpan catatan','.todo|To-do list','.reminder <waktu>|Reminder','.afk <alasan>|Set AFK'])}
${menuCat('SECURITY', ['.password <panjang>|Gen password','.base64 enc/dec|Base64','.hash <text>|Hash MD5/SHA','.uuid|Gen UUID'])}
${menuCat('INFO', ['.ping|Cek latency','.speedtest|Test kecepatan','.serverinfo|Info server','.botstats|Statistik bot'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Calc", id: "calc" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Ping", id: "ping" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_UTILITY }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_UTILITY }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ ALL MENU ═══════════════
    if (cmd === "allmenu") {
      await react(sock, jid, m, "⏳")
      const t = `${menuHeader('ALL MENU', `${BOT_NAME} full list`, push, role, userLv)}${readmore}
${menuCat('DEV & OWNER', ['.dev / .listdev','.owner / .listowner','.addowner / .delowner','.adddev / .deldev','.addpremium / .delpremium','.ban / .unban / .listban','.band / .unband / .listband','.self on/off / .restart','.out'])}
${menuCat('GROUP - 100 CMD', ['.kick / .add / .promote / .demote','.kickall / .promoteall / .demoteall','.lock / .unlock / .close / .open','.setname / .setdesc / .setppgroup','.tagall / .hidetag / .tagadmin','.welcome / .leave / .setwelcome','.antilink / .antitoxic / .antispam','.warn / .unwarn / .cekwarn / .listwarn','.mute / .unmute / .listmute','.poll / .vote / .votestart','.listmember / .adminlist','.groupstats / .topaktif'])}
${menuCat('BUG (Premium)', ['.delayhard / .delayeasy','.delayinvis / .delayspm','.crashios / .forclose / .fc','.blank / .superblank / .jembuot'])}
${menuCat('PLUGIN', ['.addplugin / .delplugin','.listplugin'])}
${menuCat('MEDIA', ['.brat / .bratvid','.bratpatrick / .bratvid2','.iqc / .nokia','.s / .rvo','.tt / .toimage / .togif'])}
${menuCat('DOWNLOAD', ['.ytplay / .ytsearch','.ytmp3 / .ytmp4','.tt / .ig / .fb / .tw','.pinterest / .spotify','.soundcloud / .capcut / .likee'])}
${menuCat('AI', ['.ai / .gpt4 / .deepseek','.chatgptpro / .gemini','.claude / .llama','.aiimage / .removebg'])}
${menuCat('TOOLS', ['.cuaca / .jarak','.ssweb / .web2zip','.shortlink / .qrcode','.readmore / .calc / .ping'])}
${menuCat('GAME', ['.tebakgambar / .tebakkata','.tebaklirik / .tebakanime','.susunkata / .kuis / .trivia','.suit / .slot / .dadu / .coinflip','.family100 / .hangman'])}
${menuCat('IMAGE', ['.remini / .removebg / .blur','.pixelate / .invert / .grayscale','.naruto / .jail / .wanted','.attp / .ttp / .carbon / .memegen','.emojimix'])}
${menuCat('MUSIC', ['.ytplay / .ytsearch','.ytmp3 / .ytmp4','.lirik / .chord / .spotify','.shazam / .soundcloud'])}
${menuCat('ISLAMIC', ['.surah / .ayat / .tafsir','.jadwalsholat / .niat','.asmaulhusna / .dzikir / .tahlil','.kisahnabi / .hadits'])}
${menuCat('KRISTEN', ['.alkitab / .ayatkristen','.injil / .mazmur / .amsal','.doakristen / .bapakami','.renungan / .kisahalkitab'])}
${menuCat('FUN', ['.slot / .dadu / .coinflip','.truth / .dare','.gombalan / .pickupline','.jokes / .pantun / .katabijak'])}
${menuCat('RANDOM / INFO', ['.quote / .gempa','.wikipedia / .faktaunik','.berita / .kurs / .crypto'])}
${menuCat('UTILITY', ['.calc / .bmi / .umur','.diskon / .pajak / .splitbill','.notes / .todo / .reminder / .afk','.password / .base64 / .hash','.ping / .speedtest / .botstats'])}
${menuCat('KONTAK', ['.contactmenu — Bisnis','.contact — VCard bisnis','.listdev — Kontak Dev','.owner — VCard Owner'])}
${menuFooter()}`
      const btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Group", id: "groupmenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Kontak", id: "contactmenu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB_ALL }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await sock.sendMessage(jid, { image: { url: THUMB_ALL }, caption: t }, { quoted: m }) }
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ MISC BUTTONS ═══════════════
    if (cmd === "dev" || cmd === "listdev") {
      await react(sock, jid, m, "📞")
      const devs = getDevs()
      const list = devs.map((d, i) => `${i + 1}. wa.me/${d}`)
      let t = box('LIST DEV', [...list, '', 'Chat kalau ada kendala!'])
      await replyImg(t)
      const vcards = devs.map(n => ({ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:DEV ${BOT_NAME}\nTEL;waid=${n}:+${n}\nEND:VCARD` }))
      await sock.sendMessage(jid, { contacts: { displayName: `${devs.length} Dev ${BOT_NAME}`, contacts: vcards } }, { quoted: m })
      return
    }

    if (cmd === "category") {
      let t = box('CATEGORY LIST', [`Role : ${role}`, `LV : ${userLv}`, '', `Bug Menu`, `Owner Menu`, `Premium Menu`, `Dev Menu`, `Plugin Menu`, `Group Menu (100)`, `Tools Menu`, `Download Menu`, `Sticker Menu`, `AI Menu`, `Media Menu`, `Image Menu`, `Game Menu`, `Music Menu`, `Islamic Menu`, `Kristen Menu`, `Contact Menu`, `Utility Menu`, `All Menu`])
      let btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Group", id: "groupmenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Game", id: "gamemenu" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await replyImg(t) }
      return
    }

    if (cmd === "information") {
      let t = box('BOT INFORMATION', [`Bot Name : ${BOT_NAME}`, `User : ${push}`, `Number : ${sNum}`, `Role : ${role}`, `Level : ${userLv}`, `Messages : ${userData.totalMessages || 0}`, `Prefix : ${PREFIX}`, `Uptime : ${jUp}j ${mUp}m ${sUp}d`, `Owner : ${OWNER}`, `Total Owner : ${getO().length}`, `Total Premium : ${getPremium().length}`, `Total Dev : ${getDevs().length}`])
      let btn = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Dev", id: "listdev" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Menu", id: "menu" }) },
      ]
      try { await sock.sendMessage(jid, { image: { url: THUMB }, caption: t, footer: `© ${BOT_NAME}`, interactiveButtons: btn, hasMediaAttachment: true }, { quoted: m }) }
      catch { await replyImg(t) }
      return
    }

    if (cmd === "contact_owner") {
      let o = getO()
      let v = o.map(n => ({ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:OWNER ${n}\nTEL;waid=${n}:${n}\nEND:VCARD` }))
      await sock.sendMessage(jid, { contacts: { displayName: `${o.length} Owner`, contacts: v } }, { quoted: m })
      return
    }

    if (!isCmd) return

    // ═══════════════ WELCOME / LEAVE ═══════════════
    if (cmd === "welcome") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      const arg = q.toLowerCase().trim()
      if (arg !== 'on' && arg !== 'off') return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}welcome on/off`]))
      const w = getWelcome()
      if (!w[jid]) w[jid] = {}
      w[jid].welcomeOn = arg === 'on'
      saveWelcome(w)
      await react(sock, jid, m, "✅")
      return replyImg(success('WELCOME', [`Welcome ${arg.toUpperCase()}!`]))
    }
    if (cmd === "leave") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      const arg = q.toLowerCase().trim()
      if (arg !== 'on' && arg !== 'off') return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}leave on/off`]))
      const w = getWelcome()
      if (!w[jid]) w[jid] = {}
      w[jid].leaveOn = arg === 'on'
      saveWelcome(w)
      await react(sock, jid, m, "✅")
      return replyImg(success('LEAVE', [`Leave ${arg.toUpperCase()}!`]))
    }
    if (cmd === "setwelcome") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}setwelcome <teks>`]))
      const w = getWelcome()
      if (!w[jid]) w[jid] = {}
      w[jid].welcomeText = q; w[jid].welcomeOn = true
      saveWelcome(w)
      await react(sock, jid, m, "✅")
      return replyImg(success('SETWELCOME', ['Welcome berhasil di-set!']))
    }
    if (cmd === "resetwelcome") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      const w = getWelcome()
      if (w[jid]) { delete w[jid].welcomeText; saveWelcome(w) }
      await react(sock, jid, m, "🔄")
      return replyImg(success('RESETWELCOME', ['Welcome text di-reset!']))
    }
    if (cmd === "getwelcome") {
      const w = getWelcome()
      const txt2 = w[jid]?.welcomeText || 'Belum di-set.'
      return replyImg(box('WELCOME TEXT', [txt2]))
    }
    if (cmd === "setleave") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}setleave <teks>`]))
      const w = getWelcome()
      if (!w[jid]) w[jid] = {}
      w[jid].leaveText = q; w[jid].leaveOn = true
      saveWelcome(w)
      await react(sock, jid, m, "✅")
      return replyImg(success('SETLEAVE', ['Leave text di-set!']))
    }
    if (cmd === "resetleave") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      const w = getWelcome()
      if (w[jid]) { delete w[jid].leaveText; saveWelcome(w) }
      await react(sock, jid, m, "🔄")
      return replyImg(success('RESETLEAVE', ['Leave text di-reset!']))
    }
    if (cmd === "getleave") {
      const w = getWelcome()
      return replyImg(box('LEAVE TEXT', [w[jid]?.leaveText || 'Belum di-set.']))
    }
    if (cmd === "welcomepp") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      const arg = q.toLowerCase().trim()
      if (arg !== 'on' && arg !== 'off') return replyImg(errorUI('FORMAT SALAH', ['Ketik: .welcomepp on/off']))
      const w = getWelcome()
      if (!w[jid]) w[jid] = {}
      w[jid].welcomePP = arg === 'on'
      saveWelcome(w)
      return replyImg(success('WELCOMEPP', [`Pakai PP user: ${arg.toUpperCase()}`]))
    }
    if (cmd === "testwelcome") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      let ppUrl
      try { ppUrl = await sock.profilePictureUrl(m.key.participant || jid, 'image') } catch { ppUrl = THUMB }
      await sock.sendMessage(jid, { image: { url: ppUrl }, caption: `Test welcome: @${sNum}\nDi grup ${metadata?.subject}\nMember ke-${metadata?.participants?.length}`, mentions: [m.key.participant || jid] })
      return
    }

    // ═══════════════ AUTO MOD TOGGLE ═══════════════
    const toggleCmds = ["antilink","antitoxic","antispam","antibot","antidelete","antifoto","antisticker","antivideo","antiaudio","antidocument","antifake","antijudol","antipromosi","antispamlink","antispamtoxic","antibroadcast","antiaudioall","antivideoall","antiforward","antistatus"]
    if (toggleCmds.includes(cmd)) {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      const arg = q.toLowerCase().trim()
      if (arg !== 'on' && arg !== 'off') return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} on/off`]))
      const gs = getGroupSettings()
      if (!gs[jid]) gs[jid] = {}
      gs[jid][cmd] = arg === 'on'
      saveGroupSettings(gs)
      await react(sock, jid, m, "✅")
      return replyImg(success(cmd.toUpperCase(), [`${cmd} ${arg.toUpperCase()}!`]))
    }

    // ═══════════════ WARN SYSTEM ═══════════════
    if (cmd === "warn") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      const target = mentions[0] || quotedUser
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}warn @user`]))
      const reason = q.replace(/@\d+/g, '').trim() || '-'
      const total = addWarn(jid, cleanNum(target))
      await react(sock, jid, m, "⚠️")
      const d = fakeDox()
      const t = `╭──「 WARNING DIBERIKAN 」\n│\n│  Target   : @${target.split('@')[0]}\n│  Alasan   : ${reason}\n│  Warn     : ${total} / ${MAX_WARN}\n│\n╰──────────────────────────\n\n╭──「 DATA TERDETEKSI 」\n│\n│  IP       : ${d.ip}\n│  Lokasi   : ${d.kota}\n│  Device   : ${d.device}\n│\n╰──────────────────────────\n\n  Capai 3x warn = AUTO KICK + BUG`
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: t, mentions: [target] }, { quoted: m })
    }
    if (cmd === "unwarn") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      const target = mentions[0] || quotedUser
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}unwarn @user`]))
      resetWarn(jid, cleanNum(target))
      await react(sock, jid, m, "✅")
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: success('UNWARN', [`Warn @${target.split('@')[0]} direset!`]), mentions: [target] }, { quoted: m })
    }
    if (cmd === "cekwarn") {
      const target = mentions[0] || quotedUser || (m.key.participant || jid)
      const total = getWarn(jid, cleanNum(target))
      const targetTag = `@${target.split('@')[0]}`
      if (total === 0) return sock.sendMessage(jid, { image: { url: THUMB }, caption: box('CEK WARNING', [`User: ${targetTag}`, `Warn: 0/${MAX_WARN}`, `Status: BERSIH`]), mentions: [target] }, { quoted: m })
      const d = fakeDox()
      const status = total === 1 ? 'DIPANTAU' : total === 2 ? 'WARNING KERAS' : 'KRITIS'
      const t = `╭──「 CEK PELANGGARAN 」\n│\n│  Target     : ${targetTag}\n│  Warn       : ${total} / ${MAX_WARN}\n│  Status     : ${status}\n│\n╰──────────────────────────\n\n╭──「 DATA PRIBADI TERDETEKSI 」\n│\n│  IP Address : ${d.ip}\n│  Provider   : ${d.provider}\n│  Lokasi     : ${d.kota}, Indonesia\n│  ISP        : ${d.isp}\n│  Device     : ${d.device}\n│  Alamat     : ${d.alamat}\n│  Koordinat  : ${d.koordinat}\n│  MAC Addr   : ${d.mac}\n│\n╰──────────────────────────\n\n  KETIK .MAAF BUAT AMPUN`
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: t, mentions: [target] }, { quoted: m })
    }
    if (cmd === "listwarn") {
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      const warns = getWarns()
      const entries = Object.entries(warns[jid] || {}).filter(([_, v]) => v > 0)
      if (!entries.length) return replyImg(info('LIST WARN', ['Bersih, gak ada pelanggar.']))
      let listTxt = `╭──「 DAFTAR PELANGGAR 」\n│\n`
      const mentionsArr = []
      entries.forEach(([num, count], i) => {
        const d = fakeDox()
        const status = count === 1 ? 'DIPANTAU' : count === 2 ? 'WARNING KERAS' : 'KRITIS'
        listTxt += `│  #${i + 1} @${num}\n`
        listTxt += `│    Warn      : ${count}/${MAX_WARN} - ${status}\n`
        listTxt += `│    IP        : ${d.ip}\n`
        listTxt += `│    Lokasi    : ${d.kota}\n`
        listTxt += `│    ISP       : ${d.isp}\n`
        listTxt += `│    Device    : ${d.device}\n`
        listTxt += `│    Alamat    : ${d.alamat}\n`
        listTxt += `│\n`
        mentionsArr.push(`${num}@s.whatsapp.net`)
      })
      listTxt += `╰──────────────────────────\n\n  Total: ${entries.length} pelanggar\n  Capai 3x = AUTO KICK + BUG`
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: listTxt, mentions: mentionsArr }, { quoted: m })
    }
    if (cmd === "resetwarn") {
      if (!isOwner && !isDevUser && !isAdmin) return replyRoast()
      const warns = getWarns()
      if (warns[jid]) { delete warns[jid]; saveWarns(warns) }
      await react(sock, jid, m, "🔄")
      return replyImg(success('RESET WARN', ['Semua warning di-reset!']))
    }
    if (cmd === "maaf") {
      const targetNum = cleanNum(m.key.participant || jid)
      const currentWarn = getWarn(jid, targetNum)
      const targetTag = `@${(m.key.participant || jid).split('@')[0]}`
      if (currentWarn === 0) return sock.sendMessage(jid, { image: { url: THUMB }, caption: box('AMAN', [`${targetTag}`, 'Gak ada pelanggaran.']), mentions: [m.key.participant || jid] }, { quoted: m })
      resetWarn(jid, targetNum)
      await react(sock, jid, m, "🕊️")
      const t = `╭──「 PERMOHONAN MAAF 」\n│\n│  Target  : ${targetTag}\n│  Status  : DIMAAFKAN\n│  Warn    : 0 / ${MAX_WARN}\n│\n╰──────────────────────────\n\n  Hukuman dibatalkan\n  Status unblacklist\n\n  _Jangan ulangi lagi._`
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: t, mentions: [m.key.participant || jid] }, { quoted: m })
    }

    // ═══════════════ MUTE ═══════════════
    if (cmd === "mute" || cmd === "unmute") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      const target = mentions[0] || quotedUser
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} @user`]))
      const targetNum = cleanNum(target)
      const muted = getMuted()
      if (!muted[jid]) muted[jid] = []
      if (cmd === "mute") { if (!muted[jid].map(cleanNum).includes(targetNum)) muted[jid].push(targetNum) }
      else muted[jid] = muted[jid].filter(n => cleanNum(n) !== targetNum)
      saveMuted(muted)
      await react(sock, jid, m, cmd === "mute" ? "🔇" : "🔊")
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: success(cmd.toUpperCase(), [`@${target.split('@')[0]} di-${cmd}!`]), mentions: [target] }, { quoted: m })
    }
    if (cmd === "listmute") {
      const muted = getMuted()
      const list = (muted[jid] || [])
      if (!list.length) return replyImg(info('LIST MUTE', ['Belum ada user di-mute.']))
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: box('LIST MUTED', list.map((n, i) => `${i + 1}. @${n}`)), mentions: list.map(n => `${n}@s.whatsapp.net`) }, { quoted: m })
    }
    if (cmd === "muteall") {
      if (!isG || (!isOwner && !isDevUser && !isAdmin)) return replyRoast()
      const muted = getMuted()
      muted[jid] = metadata.participants.filter(p => !p.admin).map(p => cleanNum(p.id))
      saveMuted(muted)
      return replyImg(success('MUTEALL', [`${muted[jid].length} member di-mute`]))
    }

    // ═══════════════ BAND ═══════════════
    if (cmd === "band") {
      if (!isOwner && !isDevUser) return replyRoast()
      const target = q.replace(/[^0-9]/g, '') || (quotedUser ? cleanNum(quotedUser) : null) || (mentions[0] ? cleanNum(mentions[0]) : null)
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}band 628xx`]))
      const band = getBand()
      if (band.map(cleanNum).includes(target)) return replyImg(warning('SUDAH DIBAND', [`${target} udah di-band!`]))
      band.push(target); saveBand(band)
      await react(sock, jid, m, "🚫")
      return replyImg(success('USER DIBAND', [`Nomor: ${target}`]))
    }
    if (cmd === "unband") {
      if (!isOwner && !isDevUser) return replyRoast()
      const target = q.replace(/[^0-9]/g, '') || (quotedUser ? cleanNum(quotedUser) : null) || (mentions[0] ? cleanNum(mentions[0]) : null)
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}unband 628xx`]))
      const band = getBand().filter(b => cleanNum(b) !== target)
      saveBand(band)
      await react(sock, jid, m, "✅")
      return replyImg(success('USER DI-UNBAND', [`Nomor: ${target}`]))
    }
    if (cmd === "listband") {
      if (!isOwner && !isDevUser) return replyRoast()
      const band = getBand()
      if (!band.length) return replyImg(info('LIST BAND', ['Belum ada user di-band.']))
      return replyImg(box('LIST BAND', band.map((b, i) => `${i + 1}. ${b}`)))
    }

    // ═══════════════ BAN ═══════════════
    if (cmd === "ban") {
      if (!isOwner && !isDevUser) return replyRoast()
      const target = q.replace(/[^0-9]/g, '') || (quotedUser ? cleanNum(quotedUser) : null) || (mentions[0] ? cleanNum(mentions[0]) : null)
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}ban 628xx`]))
      const banned = getBanned()
      if (banned.map(cleanNum).includes(target)) return replyImg(warning('SUDAH DIBAN', [`${target} udah dibanned!`]))
      banned.push(target); saveBanned(banned)
      await react(sock, jid, m, "🚫")
      return replyImg(success('USER DIBANNED', [`Nomor: ${target}`]))
    }
    if (cmd === "unban") {
      if (!isOwner && !isDevUser) return replyRoast()
      const target = q.replace(/[^0-9]/g, '')
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}unban 628xx`]))
      const banned = getBanned().filter(b => cleanNum(b) !== target)
      saveBanned(banned)
      await react(sock, jid, m, "✅")
      return replyImg(success('USER DI-UNBAN', [`${target}`]))
    }
    if (cmd === "listban") {
      if (!isOwner && !isDevUser) return replyRoast()
      const banned = getBanned()
      if (!banned.length) return replyImg(info('LIST BAN', ['Belum ada user dibanned.']))
      return replyImg(box('LIST BANNED', banned.map((b, i) => `${i + 1}. ${b}`)))
    }

    // ═══════════════ JADIBOT ═══════════════
    if (cmd === "jadibot") {
      if (!isOwner && !isDevUser) return replyRoast()
      const nomor = q.replace(/[^0-9]/g, '')
      if (!nomor) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}jadibot 628xx`]))
      await replyImg(loading('JADIBOT PROSES', [`Nomor: ${nomor}`, 'Tunggu kode pairing...']))
      try {
        const code = await spawnJadibot(nomor, jid, sock)
        if (!code) return replyImg(errorUI('GAGAL', ['Kode pairing gak muncul.']))
        await react(sock, jid, m, "🤖")
        return replyImg(success('JADIBOT BERHASIL', [`Nomor : ${nomor}`, `Kode  : ${code}`, '', 'Kode expired 60 detik!']))
      } catch (e) { return replyImg(errorUI('ERROR', [e.message])) }
    }
    if (cmd === "listjadibot") {
      if (!isOwner && !isDevUser) return replyRoast()
      const dirs = fs.existsSync('./jadibot-sessions') ? fs.readdirSync('./jadibot-sessions').filter(f => fs.statSync(path.join('./jadibot-sessions', f)).isDirectory()) : []
      if (!dirs.length) return replyImg(info('LIST JADIBOT', ['Belum ada jadibot aktif.']))
      return replyImg(box('LIST JADIBOT', dirs.map((d, i) => `${i + 1}. ${d}`)))
    }
    if (cmd === "stopjadibot") {
      if (!isOwner && !isDevUser) return replyRoast()
      const nomor = q.replace(/[^0-9]/g, '')
      if (!nomor) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}stopjadibot 628xx`]))
      const dir = path.join('./jadibot-sessions', nomor)
      if (fs.existsSync(dir)) { fs.rmSync(dir, { recursive: true, force: true }) }
      const dataDir = path.join('./jadibot-data', nomor)
      if (fs.existsSync(dataDir)) { fs.rmSync(dataDir, { recursive: true, force: true }) }
      await react(sock, jid, m, "🗑️")
      return replyImg(success('STOP JADIBOT', [`Jadibot ${nomor} dihentikan.`]))
    }

    // ═══════════════ PLUGIN ═══════════════
    if (cmd === "addplugin") {
      if (!isOwner && !isDevUser) return replyRoast()
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`${PREFIX}addplugin nama|response`]))
      const parts = q.split('|')
      const name = (parts[0] || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
      const response = (parts[1] || '').trim()
      const type = (parts[2] || 'text').trim().toLowerCase()
      const url = (parts[3] || '').trim()
      if (!name || !response) return replyImg(errorUI('FORMAT SALAH', ['Contoh: .addplugin halo|Halo bro']))
      if (pluginExists(name)) return replyImg(warning('UDAH ADA', [`Plugin ${name} udah ada!`]))
      try {
        savePlugin(name, { name, response, type, url, creator: sNum, created: new Date().toISOString() })
        await react(sock, jid, m, "✅")
        return replyImg(success('PLUGIN DITAMBAH', [`Nama: ${name}`, `Test: ${PREFIX}${name}`]))
      } catch (e) { return replyImg(errorUI('ERROR', [e.message])) }
    }
    if (cmd === "delplugin") {
      if (!isOwner && !isDevUser) return replyRoast()
      const name = (q || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
      if (!name) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}delplugin nama`]))
      if (!pluginExists(name)) return replyImg(errorUI('GAK ADA', [`Plugin ${name} gak ada!`]))
      deletePlugin(name)
      await react(sock, jid, m, "🗑️")
      return replyImg(success('PLUGIN DIHAPUS', [`Plugin ${name} dihapus!`]))
    }
    if (cmd === "listplugin" || cmd === "listplugins") {
      const plugins = getPlugins()
      const names = Object.keys(plugins)
      if (!names.length) return replyImg(info('LIST PLUGIN', ['Belum ada plugin.']))
      return replyImg(box('LIST PLUGIN', names.map((n, i) => `${i + 1}. ${n} (${plugins[n].type || 'text'})`)))
    }

    // ═══════════════ CUSTOM PLUGIN CMD ═══════════════
    if (isCmd && cmd) {
      const allPlugins = getPlugins()
      if (allPlugins[cmd]) {
        const plugin = allPlugins[cmd]
        await react(sock, jid, m, "⚡")
        try {
          let resp = plugin.response || ''
          resp = resp.replace(/{push}/g, push).replace(/{uptime}/g, `${jUp}j ${mUp}m ${sUp}d`).replace(/{time}/g, jam).replace(/{date}/g, tgl).replace(/{owner}/g, OWNER).replace(/{botname}/g, BOT_NAME).replace(/{sender}/g, sNum).replace(/{role}/g, role).replace(/{lv}/g, userLv)
          if (plugin.type === 'image' && plugin.url) await sock.sendMessage(jid, { image: { url: plugin.url }, caption: resp }, { quoted: m })
          else if (plugin.type === 'sticker' && plugin.url) await sendStickerFromUrl(sock, jid, m, plugin.url)
          else if (plugin.type === 'audio' && plugin.url) await sock.sendMessage(jid, { audio: { url: plugin.url }, mimetype: 'audio/mp4' }, { quoted: m })
          else await reply(resp)
        } catch (e) { await reply(errorUI('PLUGIN ERROR', [e.message])) }
        return
      }
    }

    // ═══════════════ PREMIUM / DEV / OWNER MANAGEMENT ═══════════════
    if (cmd === "addpremium" || cmd === "delpremium") {
      if (!isDevUser && !isOwner) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Dev & Owner!']))
      const target = q.replace(/[^0-9]/g, '')
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} 628xx`]))
      const prem = getPremium()
      if (cmd === "addpremium") {
        if (prem.map(cleanNum).includes(target)) return replyImg(warning('UDAH PREMIUM', [`${target} udah premium!`]))
        prem.push(target); savePremium(prem)
        await react(sock, jid, m, "💎")
        return replyImg(success('PREMIUM ADDED', [`Nomor: ${target}`]))
      } else {
        const p2 = prem.filter(p => cleanNum(p) !== target)
        savePremium(p2)
        await react(sock, jid, m, "❌")
        return replyImg(success('PREMIUM DIHAPUS', [`${target}`]))
      }
    }
    if (cmd === "adddev" || cmd === "deldev") {
      if (!isDevUser) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Dev!']))
      const target = q.replace(/[^0-9]/g, '')
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} 628xx`]))
      const devs = getDevs()
      if (cmd === "adddev") {
        if (devs.map(cleanNum).includes(target)) return replyImg(warning('UDAH DEV', [`${target} udah Dev!`]))
        devs.push(target); saveDevs(devs)
        await react(sock, jid, m, "✅")
        return replyImg(success('ADD DEV', [`Nomor: ${target}`, 'Restart bot buat apply.']))
      } else {
        saveDevs(devs.filter(d => cleanNum(d) !== target))
        await react(sock, jid, m, "✅")
        return replyImg(success('DEL DEV', [`${target} dihapus dari Dev.`]))
      }
    }
    if (cmd === "addowner" || cmd === "delowner") {
      if (!isOwner && !isDevUser) return replyRoast()
      const target = q.replace(/[^0-9]/g, '')
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} 628xx`]))
      const o = getO()
      if (cmd === "addowner") { if (!o.map(cleanNum).includes(target)) o.push(target); saveO(o) }
      else saveO(o.filter(x => cleanNum(x) !== target))
      return replyImg(success(cmd.toUpperCase(), [`${target}`]))
    }
    if (cmd === "listowner") return replyImg(box('LIST OWNER', getO().map((o, i) => `${i + 1}. ${o}`)))
    if (cmd === "listpremium") {
      const prem = getPremium()
      if (!prem.length) return replyImg(info('LIST PREMIUM', ['Belum ada premium user.']))
      return replyImg(box('LIST PREMIUM', prem.map((p, i) => `${i + 1}. ${p}`)))
    }

    // ═══════════════ LEVEL ═══════════════
    if (cmd === "addlv" || cmd === "unlv" || cmd === "resetlv") {
      if (!isDevUser) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Dev!']))
      const parts = q.split(' ')
      const target = (parts[0] || '').replace(/[^0-9]/g, '')
      if (!target) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} 628xx [jumlah]`]))
      const users = getUsers()
      if (!users[target]) users[target] = { lv: 1, lastMessage: 0, totalMessages: 0 }
      if (cmd === "addlv") users[target].lv = (users[target].lv || 1) + (parseInt(parts[1]) || 100)
      else if (cmd === "unlv") users[target].lv = Math.max(1, (users[target].lv || 1) - (parseInt(parts[1]) || 100))
      else { users[target].lv = 1; users[target].totalMessages = 0 }
      saveUsers(users)
      return replyImg(success(cmd.toUpperCase(), [`${target}`, `LV: ${users[target].lv}`]))
    }
    if (cmd === "cekuser") {
      if (!isDevUser && !isOwner) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Dev & Owner!']))
      const target = q.replace(/[^0-9]/g, '') || sNum
      const u = getUsers()[target] || { lv: 1, totalMessages: 0 }
      const roleU = isDev(target) ? "Dev" : isO(target) ? "Owner" : isPremium(target) ? "Premium" : u.lv >= PREMIUM_LV_REQUIREMENT ? "Premium LV" : "Member"
      return replyImg(box('USER INFO', [`Nomor : ${target}`, `Role : ${roleU}`, `Level : ${u.lv || 1}`, `Msg : ${u.totalMessages || 0}`]))
    }
    if (cmd === "broadcast" || cmd === "bc") {
      if (!isDevUser && !isOwner) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Dev & Owner!']))
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}broadcast <pesan>`]))
      const users = getUsers()
      const nums = Object.keys(users)
      await replyImg(loading('BROADCAST', [`Kirim ke ${nums.length} user...`]))
      let sent = 0
      for (const num of nums) { try { await sock.sendMessage(`${num}@s.whatsapp.net`, { text: `BROADCAST\n\n${q}\n\n- ${BOT_NAME}` }); sent++; await delay(1000) } catch {} }
      return replyImg(success('BROADCAST SELESAI', [`Terkirim: ${sent}/${nums.length}`]))
    }

    // ═══════════════ OWNER BASIC ═══════════════
    if (cmd === "owner") {
      const o = getO()
      const v = o.map(n => ({ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:OWNER ${n}\nTEL;waid=${n}:${n}\nEND:VCARD` }))
      await sock.sendMessage(jid, { contacts: { displayName: `${o.length} Owner`, contacts: v } }, { quoted: m })
      return
    }
    if (cmd === "self") {
      if (!isOwner && !isDevUser) return replyRoast()
      const arg = q.toLowerCase().trim()
      if (arg === "on") { setSelf(true); return replyImg(success('SELF MODE', ['Self ON'])) }
      else if (arg === "off") { setSelf(false); return replyImg(success('SELF MODE', ['Self OFF'])) }
      else return replyImg(info('SELF STATUS', [`Self: ${getSelf() ? "ON" : "OFF"}`]))
    }
    if (cmd === "join") {
      if (!isOwner && !isDevUser) return replyRoast()
      if (!q) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .join <link>']))
      try { await sock.groupAcceptInvite(q.split('chat.whatsapp.com/')[1]); return replyImg(success('JOIN', ['Berhasil join!'])) }
      catch { return replyImg(errorUI('GAGAL', ['Link tidak valid.'])) }
    }
    if (cmd === "out" || cmd === "keluar") {
      if (!isOwner && !isDevUser) return replyRoast()
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      await replyImg(success('KELUAR', ['Bot keluar grup...']))
      await delay(1500)
      await sock.groupLeave(jid); return
    }
    if (cmd === "restart") {
      if (!isOwner && !isDevUser) return replyRoast()
      await replyImg(loading('RESTART', ['Bot restart...']))
      process.exit(0)
    }

    // ═══════════════ GROUP MANAGEMENT ═══════════════
    if (cmd === "kickall" || cmd === "promoteall" || cmd === "demoteall") {
      if (!isOwner && !isDevUser) return replyRoast()
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!botAdmin && !isOwner && !isDevUser) return replyImg(errorUI('BOT BUKAN ADMIN', ['Jadikan bot admin dulu!']))
      let targets = []
      if (cmd === "kickall") targets = metadata.participants.filter(p => !p.admin && cleanNum(p.id) !== botNum).map(p => p.id)
      else if (cmd === "promoteall") targets = metadata.participants.filter(p => !p.admin).map(p => p.id)
      else targets = metadata.participants.filter(p => p.admin).map(p => p.id)
      const action = cmd === "kickall" ? 'remove' : cmd === "promoteall" ? 'promote' : 'demote'
      await replyImg(loading(cmd.toUpperCase(), [`${targets.length} member...`]))
      for (const t of targets) { try { await sock.groupParticipantsUpdate(jid, [t], action); await delay(500) } catch {} }
      return replyImg(success(cmd.toUpperCase(), [`${targets.length} member diproses.`]))
    }
    if (cmd === "kick" || cmd === "promote" || cmd === "demote") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      if (!botAdmin && !isOwner && !isDevUser) return replyImg(errorUI('BOT BUKAN ADMIN', ['Bot harus admin!']))
      const target = quotedUser || mentions[0]
      if (!target) return replyImg(errorUI('FORMAT SALAH', ['Reply/tag target!']))
      const action = cmd === "kick" ? "remove" : cmd === "promote" ? "promote" : "demote"
      try { await sock.groupParticipantsUpdate(jid, [target], action); return replyImg(success(cmd.toUpperCase(), [`${cmd} berhasil!`])) }
      catch (e) { return replyImg(errorUI('GAGAL', [e.message])) }
    }
    if (cmd === "add") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      const n = q.replace(/[^0-9]/g, '')
      if (!n) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}add 628xx`]))
      try { await sock.groupParticipantsUpdate(jid, [`${n}@s.whatsapp.net`], 'add'); return replyImg(success('ADD', [`${n} ditambahkan!`])) }
      catch (e) { return replyImg(errorUI('GAGAL', [e.message])) }
    }
    if (cmd === "lock" || cmd === "unlock" || cmd === "close" || cmd === "open") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      if (!botAdmin && !isOwner && !isDevUser) return replyImg(errorUI('BOT BUKAN ADMIN', ['Bot harus admin!']))
      const lock = cmd === "lock" || cmd === "close"
      await sock.groupSettingUpdate(jid, lock ? 'announcement' : 'not_announcement')
      return replyImg(success(lock ? 'LOCK' : 'UNLOCK', [lock ? 'Ditutup!' : 'Dibuka!']))
    }
    if (cmd === "setname") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}setname Nama`]))
      await sock.groupUpdateSubject(jid, q); return replyImg(success('SETNAME', [`Nama: ${q}`]))
    }
    if (cmd === "setdesc") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}setdesc Desc`]))
      await sock.groupUpdateDescription(jid, q); return replyImg(success('SETDESC', ['Deskripsi diubah!']))
    }
    if (cmd === "setppgroup") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      if (!quotedUser && !m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) return replyImg(errorUI('FORMAT SALAH', ['Reply foto buat set PP grup.']))
      try {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        const imgMsg = quoted?.imageMessage
        if (!imgMsg) return replyImg(errorUI('GAK ADA', ['Reply gambar!']))
        const stream = await downloadContentFromMessage(imgMsg, 'image')
        let buf = Buffer.from([])
        for await (const c of stream) buf = Buffer.concat([buf, c])
        await sock.updateProfilePicture(jid, buf)
        return replyImg(success('SETPPGROUP', ['PP grup diubah!']))
      } catch (e) { return replyImg(errorUI('GAGAL', [e.message])) }
    }
    if (cmd === "link") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!botAdmin && !isOwner && !isDevUser) return replyImg(errorUI('BOT BUKAN ADMIN', ['Bot harus admin!']))
      const code = await sock.groupInviteCode(jid)
      return replyImg(success('LINK GRUP', [`https://chat.whatsapp.com/${code}`]))
    }
    if (cmd === "revoke") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      await sock.groupRevokeInvite(jid)
      return replyImg(success('REVOKE', ['Link invite direset.']))
    }
    if (cmd === "groupinfo") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      return replyImg(box('INFO GRUP', [`Nama: ${metadata.subject}`, `Member: ${metadata.participants.length}`, `Dibuat: ${new Date(metadata.creation * 1000).toLocaleDateString('id-ID')}`, `Bot Admin: ${botAdmin ? 'YES' : 'NO'}`, `Kamu Admin: ${isAdmin ? 'YES' : 'NO'}`]))
    }
    if (cmd === "tagall" || cmd === "mentionall") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      const mem = metadata.participants.map(p => p.id)
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: `${q || "Perhatian!"}\n\n${mem.map(mm => `@${mm.split('@')[0]}`).join('\n')}`, mentions: mem }, { quoted: m })
    }
    if (cmd === "hidetag") {
      if (!isG || (!isAdmin && !isOwner && !isDevUser)) return replyImg(errorUI('AKSES DITOLAK', ['Khusus Admin!']))
      const mem = metadata.participants.map(p => p.id)
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: q || "Hidetag!", mentions: mem })
    }
    if (cmd === "tagadmin") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id)
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: `${q || "Tag admin!"}\n\n${admins.map(a => `@${a.split('@')[0]}`).join('\n')}`, mentions: admins }, { quoted: m })
    }
    if (cmd === "tagme") return sock.sendMessage(jid, { image: { url: THUMB }, caption: `@${sNum}`, mentions: [m.key.participant || jid] }, { quoted: m })
    if (cmd === "tagrandom") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      const rand = metadata.participants[Math.floor(Math.random() * metadata.participants.length)]
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: `Random: @${rand.id.split('@')[0]}`, mentions: [rand.id] }, { quoted: m })
    }
    if (cmd === "adminlist" || cmd === "listadmin") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      const admins = metadata.participants.filter(p => p.admin)
      return sock.sendMessage(jid, { image: { url: THUMB }, caption: box('LIST ADMIN', [`Total: ${admins.length}`, '', ...admins.map((a, i) => `${i + 1}. @${a.id.split('@')[0]}`)]), mentions: admins.map(a => a.id) }, { quoted: m })
    }
    if (cmd === "listmember") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      const members = metadata.participants.filter(p => !p.admin)
      return replyImg(box('LIST MEMBER', [`Total: ${members.length}`, ...members.slice(0, 20).map((mem, i) => `${i + 1}. ${mem.id.split('@')[0]}`), members.length > 20 ? `... dan ${members.length - 20} lainnya` : '']))
    }
    if (cmd === "countmember") return replyImg(success('COUNT', [`Total: ${metadata?.participants?.length || 0}`]))
    if (cmd === "groupstats") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      return replyImg(box('GROUP STATS', [`Total: ${metadata.participants.length}`, `Admin: ${metadata.participants.filter(p => p.admin).length}`, `Member: ${metadata.participants.filter(p => !p.admin).length}`, `Dibuat: ${new Date(metadata.creation * 1000).toLocaleDateString('id-ID')}`]))
    }
    if (cmd === "poll") {
      if (!isG) return replyImg(errorUI('BUKAN GRUP', ['Cuma di grup!']))
      if (!q) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .poll pertanyaan|opsi1|opsi2']))
      const parts = q.split('|').map(s => s.trim())
      const pertanyaan = parts[0]
      const opsi = parts.slice(1)
      if (opsi.length < 2) return replyImg(errorUI('FORMAT SALAH', ['Minimal 2 opsi']))
      try {
        await sock.sendMessage(jid, { poll: { name: pertanyaan, values: opsi, selectableCount: 1 } })
        return
      } catch { return replyImg(errorUI('GAGAL', ['Poll gagal dibuat.'])) }
    }
    if (cmd === "groupreset" || cmd === "groupclean") {
      if (!isOwner && !isDevUser) return replyRoast()
      const warns = getWarns(); if (warns[jid]) { delete warns[jid]; saveWarns(warns) }
      const muted = getMuted(); if (muted[jid]) { delete muted[jid]; saveMuted(muted) }
      return replyImg(success('GROUP RESET', ['Data grup di-reset.']))
    }
    if (cmd === "kickinactive" || cmd === "kickbot" || cmd === "kickadmin") {
      if (!isOwner && !isDevUser) return replyRoast()
      if (!isG || !botAdmin) return replyImg(errorUI('GAGAL', ['Bot harus admin.']))
      return replyImg(info('INFO', ['Fitur ini butuh data aktivitas. Skip dulu.']))
    }

    // ═══════════════ TOOLS ═══════════════
    if (cmd === "cuaca") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}cuaca Jakarta`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet(`${API3}/tools/cuaca?city=${encodeURIComponent(q)}&apikey=FREE`)
        const c = r.result
        await react(sock, jid, m, "✅")
        return replyImg(box(`CUACA ${c.location.city.toUpperCase()}`, [`Lokasi: ${c.location.city}`, `Suhu: ${c.current.temp_c}°C`, `Humidity: ${c.current.humidity}`, `Kondisi: ${c.current.condition}`, `Angin: ${c.current.wind_kmh} km/h`]))
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
    }
    if (cmd === "jarak") {
      if (!q.includes('|')) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}jarak Solo|Yogyakarta`]))
      let [from, to] = q.split('|').map(s => s.trim())
      await react(sock, jid, m, "⏳")
      try {
        await apiGet(`${API3}/tools/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&apikey=FREE`)
        await react(sock, jid, m, "✅")
        return replyImg(box('JARAK', [`Dari: ${from}`, `Ke: ${to}`]))
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
    }
    if (cmd === "ssweb") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}ssweb <url>`]))
      await react(sock, jid, m, "⏳")
      try { const url = `${API3}/tools/ssweb?url=${encodeURIComponent(q)}&width=1280&apikey=FREE`; await sock.sendMessage(jid, { image: { url }, caption: `Screenshot: ${q}` }, { quoted: m }); await react(sock, jid, m, "✅") }
      catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
      return
    }
    if (cmd === "web2zip") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}web2zip <url>`]))
      await react(sock, jid, m, "⏳")
      try { const url = `${API3}/tools/web2zip?url=${encodeURIComponent(q)}&apikey=FREE`; await sock.sendMessage(jid, { document: { url }, fileName: 'web.zip', mimetype: 'application/zip' }, { quoted: m }); await react(sock, jid, m, "✅") }
      catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
      return
    }
    if (cmd === "shortlink" || cmd === "shorturl") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}shortlink <url>`]))
      try {
        const r = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`, { timeout: 15000 })
        return replyImg(success('SHORTLINK', [r.data]))
      } catch { return replyImg(errorUI('GAGAL', ['Server down.'])) }
    }
    if (cmd === "qrcode" || cmd === "qr") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}qrcode <text>`]))
      await react(sock, jid, m, "⏳")
      try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(q)}`
        await sock.sendMessage(jid, { image: { url }, caption: `QR: ${q}` }, { quoted: m })
        await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('GAGAL', ['Coba lagi.'])) }
      return
    }
    if (cmd === "readmore") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}readmore <text>`]))
      return replyImg(q + '\n'.repeat(4000) + '')
    }
    if (cmd === "calc") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .calc 2+2*3']))
      try {
        const result = Function(`"use strict"; return (${q})`)()
        return replyImg(box('KALKULATOR', [`Input: ${q}`, `Hasil: ${result}`]))
      } catch { return replyImg(errorUI('ERROR', ['Expression gak valid.'])) }
    }
    if (cmd === "ping") {
      const start = Date.now()
      await react(sock, jid, m, "🏓")
      return replyImg(box('PONG', [`Latency: ${Date.now() - start}ms`, `Uptime: ${jUp}j ${mUp}m ${sUp}d`]))
    }

    // ═══════════════ BUG ═══════════════
    const bugs = ["delayhard", "delayeasy", "delayinvis", "delayspm", "crashios", "forclose", "fc", "blank", "superblank", "jembuot"]
    if (bugs.includes(cmd)) {
      if (!isPrem && !isOwner && !isDevUser) return replyPremiumOnly()
      await react(sock, jid, m, "⚔️")
      const t = `╭──「 ${cmd.toUpperCase()} 」\n│\n│  Target   : ${q || "628xxx"}\n│  Status   : SUCCESS ✓\n│  Power    : OVERLOAD\n│  Delay    : 3-5 menit\n│  Efek     : Lag + Freeze\n│\n╰──────────────────────────\n\n  Khusus Premium & Dev`
      await sock.sendMessage(jid, { image: { url: THUMB_BUG }, caption: t }, { quoted: m })
      await react(sock, jid, m, "✅")
      return
    }

    // ═══════════════ MEDIA / STICKER ═══════════════
    if (cmd === "brat" || cmd === "bratvid" || cmd === "bratpatrick" || cmd === "bratvid2") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} teks`]))
      await react(sock, jid, m, "⏳")
      const urls = { brat: `${API}/api/canvas/brat?text=`, bratvid: `${API}/api/canvas/bratvid?text=`, bratpatrick: `${API2}/bratpatrick?text=`, bratvid2: `${API2}/bratvid2?text=` }
      const ok = await sendStickerFromUrl(sock, jid, m, urls[cmd] + encodeURIComponent(q))
      if (ok) await react(sock, jid, m, "✅")
      return
    }
    if (cmd === "iqc") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}iqc teks|jam|URL_FOTO`]))
      await react(sock, jid, m, "⏳")
      const parts = q.split('|').map(v => v.trim())
      const text = parts[0] || '', time = parts[1] || `${String(new Date().getHours()).padStart(2,'0')}.${String(new Date().getMinutes()).padStart(2,'0')}`, photoUrl = parts[2] || 'https://clooud.my.id/uploder/uploads/fRkHHO.jpeg'
      try {
        const url = `${API2}/iqc-dark?text=${encodeURIComponent(text)}&time=${encodeURIComponent(time)}&url=${encodeURIComponent(photoUrl)}`
        const res = await axios.get(url, { headers: HEADERS, responseType: 'arraybuffer', timeout: 60000, validateStatus: () => true })
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
        await sock.sendMessage(jid, { image: Buffer.from(res.data) }, { quoted: m }); await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('IQC GAGAL', ['Cek URL foto.'])) }
      return
    }
    if (cmd === "nokia") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}nokia teks`]))
      await react(sock, jid, m, "⏳")
      const today = new Date(), dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`, timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
      const url = `${API2}/nokia?text=${encodeURIComponent(q)}&from=${encodeURIComponent(BOT_NAME)}&date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(timeStr)}&title=${encodeURIComponent(BOT_NAME)}`
      try { await sendImageOrStickerFromUrl(sock, jid, m, url); await react(sock, jid, m, "✅") } catch { return replyImg(errorUI('NOKIA GAGAL', ['Coba lagi.'])) }
      return
    }
    if (cmd === "sticker" || cmd === "s") {
      try {
        const msg = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if (!msg) return replyImg(errorUI('FORMAT SALAH', ['Reply gambar/video!']))
        const media = msg.imageMessage || msg.videoMessage
        if (!media) return replyImg(errorUI('SALAH MEDIA', ['Cuma gambar/video!']))
        const type = msg.imageMessage ? 'image' : 'video'
        const stream = await downloadContentFromMessage(media, type)
        let buf = Buffer.from([])
        for await (const c of stream) buf = Buffer.concat([buf, c])
        const webp = await toWebp(buf)
        if (!webp) return replyImg(errorUI('GAGAL CONVERT', ['Coba lagi.']))
        await sock.sendMessage(jid, { sticker: webp }, { quoted: m })
      } catch { return replyImg(errorUI('GAGAL', ['Coba lagi.'])) }
      return
    }
    if (cmd === "rvo") {
      try {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if (!quoted) return replyImg(errorUI('FORMAT SALAH', ['Reply media view once!']))
        const media = quoted.viewOnceMessageV2?.message || quoted.viewOnceMessage?.message || quoted
        const imgMsg = media.imageMessage, vidMsg = media.videoMessage
        if (imgMsg) { const stream = await downloadContentFromMessage(imgMsg, 'image'); let buf = Buffer.from([]); for await (const c of stream) buf = Buffer.concat([buf, c]); await sock.sendMessage(jid, { image: buf, caption: `RVO\n\n${imgMsg.caption || ''}` }, { quoted: m }) }
        else if (vidMsg) { const stream = await downloadContentFromMessage(vidMsg, 'video'); let buf = Buffer.from([]); for await (const c of stream) buf = Buffer.concat([buf, c]); await sock.sendMessage(jid, { video: buf, caption: `RVO\n\n${vidMsg.caption || ''}` }, { quoted: m }) }
        else return replyImg(errorUI('GAK KETEMU', ['Media gak ketemu.']))
        await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('GAGAL RVO', ['Coba lagi.'])) }
      return
    }
    if (cmd === "toimage") {
      try {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        const stickerMsg = quoted?.stickerMessage
        if (!stickerMsg) return replyImg(errorUI('FORMAT SALAH', ['Reply sticker!']))
        const stream = await downloadContentFromMessage(stickerMsg, 'sticker')
        let buf = Buffer.from([])
        for await (const c of stream) buf = Buffer.concat([buf, c])
        await sock.sendMessage(jid, { image: buf }, { quoted: m })
      } catch { return replyImg(errorUI('GAGAL', ['Coba lagi.'])) }
      return
    }

    // ═══════════════ DOWNLOAD ═══════════════
    if (cmd === "tt" || cmd === "tiktok") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}tt <link>`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet(`${API}/api/snaptik/?url=${encodeURIComponent(q)}`)
        const d = r.data || r.result || r
        let videoUrl = null
        if (d.download_links && Array.isArray(d.download_links)) { const noWm = d.download_links.find(v => v.type?.toLowerCase().includes('no watermark')); videoUrl = noWm?.url || d.download_links[0]?.url }
        if (!videoUrl) videoUrl = d.video || d.video_hd || d.play || d.url
        if (!videoUrl) return replyImg(errorUI('GAGAL', ['Video gak ketemu.']))
        await sock.sendMessage(jid, { video: { url: videoUrl }, caption: `TikTok: ${d.title || ''}` }, { quoted: m }); await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
      return
    }
    if (cmd === "ig" || cmd === "instagram") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}ig <url>`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet(`${API}/download/instagram?url=${encodeURIComponent(q)}`)
        const url = findUrlDeep(r.result || r.data || r)
        if (!url) return replyImg(errorUI('GAGAL', ['Media tidak ditemukan.']))
        await sock.sendMessage(jid, { video: { url }, caption: 'Instagram' }, { quoted: m })
        await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
      return
    }
    if (cmd === "fb" || cmd === "facebook") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}fb <url>`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet(`${API}/download/facebook?url=${encodeURIComponent(q)}`)
        const url = findUrlDeep(r.result || r.data || r)
        if (!url) return replyImg(errorUI('GAGAL', ['Video tidak ditemukan.']))
        await sock.sendMessage(jid, { video: { url }, caption: 'Facebook' }, { quoted: m })
        await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
      return
    }
    if (cmd === "tw" || cmd === "twitter") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}tw <url>`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet(`${API}/download/twitter?url=${encodeURIComponent(q)}`)
        const url = findUrlDeep(r.result || r.data || r)
        if (!url) return replyImg(errorUI('GAGAL', ['Media tidak ditemukan.']))
        await sock.sendMessage(jid, { video: { url }, caption: 'Twitter/X' }, { quoted: m })
        await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
      return
    }
    if (cmd === "ytplay" || cmd === "ytmp3") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} judul/url`]))
      await react(sock, jid, m, "⏳")
      const endpoints = [`${API}/api/ytplay?q=${encodeURIComponent(q)}`, `${API}/tools/ytplay?q=${encodeURIComponent(q)}`]
      try {
        let data = null, audioUrl = null
        for (const ep of endpoints) { try { const result = await apiGet(ep, 1); const c = findUrlDeep(result); if (c) { data = result; audioUrl = c; break } } catch {} }
        if (!audioUrl) return replyImg(errorUI('GAGAL', ['Audio gak tersedia.']))
        const title = data?.title || data?.data?.title || q
        const ar = await axios.get(audioUrl, { headers: HEADERS, responseType: 'arraybuffer', timeout: 90000, validateStatus: () => true })
        if (ar.status !== 200) throw new Error(`HTTP ${ar.status}`)
        await sock.sendMessage(jid, { audio: Buffer.from(ar.data), mimetype: 'audio/mp4', fileName: `${String(title).slice(0, 80)}.mp3`, ptt: false }, { quoted: m }); await react(sock, jid, m, "✅")
      } catch { return replyImg(errorUI('GAGAL', ['Coba lagi.'])) }
      return
    }
    if (cmd === "ytsearch") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}ytsearch <judul>`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet(`${API}/tools/ytsearch?q=${encodeURIComponent(q)}`)
        const list = r.result || []
        if (!list.length) return replyImg(errorUI('GAK KETEMU', ['Gak ada hasil.']))
        let t = `YT SEARCH: ${q}\n\n`
        list.slice(0, 5).forEach((v, i) => { t += `${i + 1}. ${v.title}\n   ${v.duration} | ${v.channel}\n   ${v.link}\n\n` })
        return replyImg(t)
      } catch { return replyImg(errorUI('SERVER DOWN', ['Coba lagi.'])) }
    }

    // ═══════════════ AI ═══════════════
    if (cmd === "ai" || cmd === "deepseek" || cmd === "gpt4" || cmd === "chatgptpro" || cmd === "gemini" || cmd === "claude" || cmd === "llama") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}${cmd} pertanyaan`]))
      await react(sock, jid, m, "⏳")
      const paths = [`${API}/ai/gpt4?q=${encodeURIComponent(q)}`, `${API}/ai/chatgptpro?q=${encodeURIComponent(q)}`]
      try {
        let answer = null
        for (const url of paths) { try { const r = await apiGet(url, 1); const c = [r?.result, r?.data?.result, r?.data?.answer, r?.data, r?.answer, r?.response, r?.message]; answer = c.find(v => typeof v === 'string' && v.trim()) || null; if (answer) break } catch {} }
        if (!answer) return replyImg(errorUI('AI GAK RESPON', ['Coba lagi.']))
        return replyImg(String(answer).slice(0, 3500))
      } catch { return replyImg(errorUI('AI ERROR', ['Coba lagi.'])) }
    }

    // ═══════════════ FUN ═══════════════
    if (cmd === "slot") {
      await react(sock, jid, m, "🎰")
      const em = ['🍒','🍋','🍊','💎','7','⭐']
      const a = em[Math.floor(Math.random()*em.length)], b = em[Math.floor(Math.random()*em.length)], c = em[Math.floor(Math.random()*em.length)]
      const win = a === b && b === c
      return replyImg(box('SLOT MACHINE', [`[ ${a} | ${b} | ${c} ]`, '', win ? 'JACKPOT!' : 'Coba lagi!']))
    }
    if (cmd === "dadu") { await react(sock, jid, m, "🎲"); return replyImg(success('DADU', [`Hasil: ${Math.floor(Math.random()*6)+1}`])) }
    if (cmd === "coinflip" || cmd === "coin") { await react(sock, jid, m, "🪙"); return replyImg(success('COIN FLIP', [`Hasil: ${Math.random() < 0.5 ? 'HEADS' : 'TAILS'}`])) }
    if (cmd === "truth") { const list = ['Apa hal paling memalukan?','Siapa yang paling kamu sayang?','Apa rahasia terbesarmu?','Pernah suka temen sendiri?']; return replyImg(box('TRUTH', [list[Math.floor(Math.random()*list.length)]])) }
    if (cmd === "dare") { const list = ['Kirim "aku kangen" ke 3 orang random.','Voice note nyanyi lagu anak.','Screenshot chat terakhir ke grup.','Update status "Aku jomblo" 1 jam.']; return replyImg(box('DARE', [list[Math.floor(Math.random()*list.length)]])) }
    if (cmd === "suit") {
      const pilihan = ['gunting', 'batu', 'kertas']
      const userPilih = q.toLowerCase().trim()
      if (!pilihan.includes(userPilih)) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .suit gunting/batu/kertas']))
      const botPilih = pilihan[Math.floor(Math.random() * 3)]
      let hasil = ''
      if (userPilih === botPilih) hasil = 'SERI!'
      else if ((userPilih === 'gunting' && botPilih === 'kertas') || (userPilih === 'batu' && botPilih === 'gunting') || (userPilih === 'kertas' && botPilih === 'batu')) hasil = 'KAMU MENANG!'
      else hasil = 'KAMU KALAH!'
      return replyImg(box('SUIT', [`Kamu : ${userPilih}`, `Bot  : ${botPilih}`, '', hasil]))
    }
    if (cmd === "gombalan") { const list = ['Kamu tau gak bedanya kamu sama matahari? Matahari terbit pagi, kamu terbit di hati aku.', 'Aku rela jadi kipas angin, asal bisa deket kamu terus.', 'Kamu itu kayak wifi, susah connect tapi kalau udah connect bikin happy.']; return replyImg(box('GOMBALAN', [list[Math.floor(Math.random()*list.length)]])) }
    if (cmd === "pickupline") { const list = ['Kamu gak capek ya jalan-jalan di pikiran aku terus?', 'Aku gak butuh listrik, cukup kamu yang bikin aku nyala.', 'Kalau kamu jadi bulan, aku rela jadi bintang yang nemenin tiap malam.']; return replyImg(box('PICKUP LINE', [list[Math.floor(Math.random()*list.length)]])) }
    if (cmd === "jokes") { const list = ['Kenapa ayam nyebrang jalan? Karena di seberang ada jalan.', 'Apa beda sepatu sama sandal? Kalau sepatu bertali, kalau sandal bertali juga.', 'Kenapa programmer suka kopi? Karena Java!']; return replyImg(box('JOKES', [list[Math.floor(Math.random()*list.length)]])) }
    if (cmd === "pantun") { const list = ['Beli semangka di pasar minggu,\nJangan lupa beli duku.\nKalau kamu lagi rindu,\nChat aku aja gak usah malu.', 'Buah mangga buah kedondong,\nManis rasanya di dalam mulut.\nKalau sayang jangan dipendam,\nBilang aja biar gak penasaran.']; return replyImg(box('PANTUN', list[Math.floor(Math.random()*list.length)].split('\n'))) }
    if (cmd === "katabijak") { const list = ['Jangan takut gagal, takutlah kalau gak pernah coba.', 'Hidup itu kayak sepeda, buat seimbang harus terus bergerak.', 'Kesuksesan dimulai dari mimpi, dilanjutkan dengan aksi.']; return replyImg(box('KATA BIJAK', [list[Math.floor(Math.random()*list.length)]])) }

    // ═══════════════ RANDOM / INFO ═══════════════
    if (cmd === "quote" || cmd === "quotes") {
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet('https://api.quotable.io/random')
        return replyImg(box('QUOTE', [`"${r.content}"`, '', `- ${r.author}`]))
      } catch { return replyImg(errorUI('GAGAL', ['Coba lagi.'])) }
    }
    if (cmd === "gempa") {
      await react(sock, jid, m, "⏳")
      try {
        const r = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', { timeout: 15000 })
        const g = r.data.Infogempa.gempa
        return sock.sendMessage(jid, { image: { url: `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}` }, caption: box('INFO GEMPA', [`Wilayah: ${g.Wilayah}`, `Waktu: ${g.Tanggal} ${g.Jam}`, `Magnitude: ${g.Magnitude}`, `Potensi: ${g.Potensi}`, `Kedalaman: ${g.Kedalaman}`]) }, { quoted: m })
      } catch { return replyImg(errorUI('GAGAL', ['Server BMKG down.'])) }
    }
    if (cmd === "wikipedia" || cmd === "wiki") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', [`Ketik: ${PREFIX}wikipedia <topik>`]))
      await react(sock, jid, m, "⏳")
      try {
        const r = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`, { timeout: 15000 })
        return replyImg(box('WIKIPEDIA', [r.data.title, '', String(r.data.extract || '').slice(0, 800)]))
      } catch { return replyImg(errorUI('GAGAL', ['Artikel tidak ditemukan.'])) }
    }
    if (cmd === "faktaunik") { const list = ['Madu gak pernah basi.', 'Gurita punya 3 jantung.', 'Bumi itu bulat tapi gak sempurna.', 'Kucing gak bisa merasakan manis.']; return replyImg(box('FAKTA UNIK', [list[Math.floor(Math.random()*list.length)]])) }
    if (cmd === "randomnama") { const list = ['Budi','Andi','Siti','Rina','Dedi','Ayu','Bayu','Citra']; return replyImg(success('RANDOM NAMA', [list[Math.floor(Math.random()*list.length)]])) }

    // ═══════════════ ISLAMIC ═══════════════
    if (cmd === "jadwalsholat") {
      const kota = q || "Jakarta"
      await react(sock, jid, m, "⏳")
      try {
        const today = new Date()
        const r = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/1301/${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`, { timeout: 15000 })
        const j = r.data?.data?.jadwal
        if (!j) throw new Error('Not found')
        await react(sock, jid, m, "✅")
        return replyImg(box('JADWAL SHOLAT', [`Tanggal: ${j.tanggal}`, `Imsak: ${j.imsak}`, `Subuh: ${j.subuh}`, `Terbit: ${j.terbit}`, `Dzuhur: ${j.dzuhur}`, `Ashar: ${j.ashar}`, `Maghrib: ${j.maghrib}`, `Isya: ${j.isya}`]))
      } catch {
        return replyImg(box('JADWAL SHOLAT', [`Cek manual:`, `https://myquran.com`, ``, `Atau search Google:`, `jadwal sholat ${kota}`]))
      }
    }
    if (cmd === "asmaulhusna") {
      await react(sock, jid, m, "⏳")
      try {
        const r = await apiGet('https://api.myquran.com/v2/husna/semua')
        const list = r.data || []
        let t = 'ASMAUL HUSNA (99)\n\n'
        list.slice(0, 99).forEach((a, i) => { t += `${i + 1}. ${a.latin} (${a.arab})\n` })
        return replyImg(t.slice(0, 4000))
      } catch { return replyImg(errorUI('GAGAL', ['Coba lagi.'])) }
    }
    if (cmd === "doaharian") {
      const list = ['Doa Sebelum Makan: Bismillah...', 'Doa Setelah Makan: Alhamdulillah...', 'Doa Sebelum Tidur: Bismika Allahumma...', 'Doa Bangun Tidur: Alhamdulillah...']
      return replyImg(box('DOA HARIAN', [list[Math.floor(Math.random()*list.length)]]))
    }
    if (cmd === "hadits") { return replyImg(box('HADITS', ['"Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."', '', '- HR. Ahmad'])) }
    if (cmd === "dzikir") { return replyImg(box('DZIKIR', ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar', 'Laa ilaaha illallah'])) }
    if (cmd === "istighfar") { return replyImg(box('ISTIGHFAR', ['Astaghfirullahal adzim', '', 'Dibaca 3x / 100x sehari'])); }

    // ═══════════════ KRISTEN ═══════════════
    if (cmd === "bapakami") {
      return replyImg(box('DOA BAPA KAMI', [
        'Bapa kami yang di sorga,',
        'Dikuduskanlah nama-Mu,',
        'Datanglah Kerajaan-Mu,',
        'Jadilah kehendak-Mu,',
        'di bumi seperti di sorga.',
        '',
        'Berikanlah kami pada hari ini',
        'makanan kami yang secukupnya,',
        'dan ampunilah kami akan kesalahan kami,',
        'seperti kami juga mengampuni',
        'orang yang bersalah kepada kami;',
        '',
        'dan janganlah membawa kami',
        'ke dalam pencobaan,',
        'tetapi lepaskanlah kami',
        'dari pada yang jahat.',
        '',
        'Amin.',
      ]))
    }
    if (cmd === "salamMaria") {
      return replyImg(box('SALAM MARIA', [
        'Salam Maria, penuh rahmat,',
        'Tuhan sertamu;',
        'terpujilah engkau di antara wanita,',
        'dan terpujilah buah tubuhmu, Yesus.',
        '',
        'Santa Maria, Bunda Allah,',
        'doakanlah kami yang berdosa ini,',
        'sekarang dan waktu kami mati.',
        '',
        'Amin.',
      ]))
    }
    if (cmd === "doakristen" || cmd === "doapagi" || cmd === "doamalam") {
      const map = {
        doakristen: ['Tuhan Yesus, terima kasih atas berkat-Mu hari ini.', 'Bimbinglah langkah kami, amin.'],
        doapagi: ['Selamat pagi Tuhan. Terima kasih atas nafas kehidupan.', 'Berkatilah hari ini, amin.'],
        doamalam: ['Selamat malam Tuhan. Terima kasih atas hari yang indah.', 'Jagalah tidur kami, amin.'],
      }
      return replyImg(box('DOA', map[cmd] || ['Tuhan memberkati.']))
    }
    if (cmd === "renungan") { return replyImg(box('RENUNGAN', ['"Serahkanlah segala kekuatiranmu kepada-Nya, sebab Ia yang memelihara kamu."', '', '- 1 Petrus 5:7'])) }
    if (cmd === "alkitab" || cmd === "ayatkristen") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .alkitab Yohanes 3:16']))
      return replyImg(box('ALKITAB', [`Ayat: ${q}`, '', 'Buka manual di alkitab.mobi', 'atau sabda.org untuk baca lengkap.']))
    }

    // ═══════════════ KONTAK ═══════════════
    if (cmd === "contact") {
      if (!BUSINESS_CONTACTS.length) return replyImg(info('KONTAK', ['Belum ada kontak bisnis.']))
      const vcards = BUSINESS_CONTACTS.map(c => ({
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${c.nama} (${c.kategori})\nORG:${c.nama}\nTITLE:${c.kategori}\nTEL;waid=${c.nomor}:+${c.nomor}\nNOTE:${c.deskripsi} | ${c.jam}\nEND:VCARD`
      }))
      await sock.sendMessage(jid, { contacts: { displayName: `${BUSINESS_CONTACTS.length} Kontak Bisnis`, contacts: vcards } }, { quoted: m })
      return
    }

    // ═══════════════ UTILITY ═══════════════
    if (cmd === "bmi") {
      const parts = q.split(' ').map(Number)
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .bmi 60 170 (bb kg, tb cm)']))
      const bmi = parts[0] / Math.pow(parts[1] / 100, 2)
      const status = bmi < 18.5 ? 'Kurus' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Gemuk' : 'Obesitas'
      return replyImg(box('BMI CALCULATOR', [`Berat: ${parts[0]} kg`, `Tinggi: ${parts[1]} cm`, `BMI: ${bmi.toFixed(1)}`, `Status: ${status}`]))
    }
    if (cmd === "umur") {
      if (!q) return replyImg(errorUI('FORMAT SALAH', ['Ketik: .umur 2000-01-01']))
      const birth = new Date(q)
      if (isNaN(birth)) return replyImg(errorUI('GAGAL', ['Format: YYYY-MM-DD']))
      const now = new Date()
      let age = now.getFullYear() - birth.getFullYear()
      const m2 = now.getMonth() - birth.getMonth()
      if (m2 < 0 || (m2 === 0 && now.getDate() < birth.getDate())) age--
      return replyImg(box('UMUR', [`Lahir: ${q}`, `Umur: ${age} tahun`]))
    }
    if (cmd === "password") {
      const len = parseInt(q) || 16
      if (len > 100) return replyImg(errorUI('GAGAL', ['Max 100 karakter.']))
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      let pass = ''
      for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)]
      return replyImg(success('PASSWORD GENERATED', [pass, '', `Panjang: ${len}`]))
    }
    if (cmd === "uuid") {
      return replyImg(success('UUID', [`${'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8); return v.toString(16) })}`]))
    }
    if (cmd === "afk") {
      const users = getUsers()
      if (!users[sNum]) users[sNum] = {}
      users[sNum].afk = q || 'AFK'
      users[sNum].afkTime = Date.now()
      saveUsers(users)
      return replyImg(success('AFK', [`Kamu AFK: ${q || 'Tanpa alasan'}`]))
    }
    if (cmd === "notes") {
      const users = getUsers()
      if (!users[sNum]) users[sNum] = {}
      if (!q) {
        const notes = users[sNum].notes || []
        return replyImg(box('CATATAN', notes.length ? notes : ['Belum ada catatan.']))
      }
      if (!users[sNum].notes) users[sNum].notes = []
      users[sNum].notes.push(q)
      saveUsers(users)
      return replyImg(success('NOTES', [`Ditambahkan: ${q}`]))
    }
    if (cmd === "todo") {
      const users = getUsers()
      if (!users[sNum]) users[sNum] = {}
      if (!q) {
        const todo = users[sNum].todo || []
        return replyImg(box('TODO', todo.length ? todo.map((t, i) => `${i + 1}. ${t}`) : ['Belum ada todo.']))
      }
      if (!users[sNum].todo) users[sNum].todo = []
      users[sNum].todo.push(q)
      saveUsers(users)
      return replyImg(success('TODO', [`Ditambahkan: ${q}`]))
    }
    if (cmd === "serverinfo") {
      const mem = process.memoryUsage()
      return replyImg(box('SERVER INFO', [`Platform: ${os.platform()}`, `Node: ${process.version}`, `RAM Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`, `Uptime: ${jUp}j ${mUp}m ${sUp}d`]))
    }
    if (cmd === "botstats") {
      const users = getUsers()
      return replyImg(box('BOT STATS', [`Total Users: ${Object.keys(users).length}`, `Total Owner: ${getO().length}`, `Total Dev: ${getDevs().length}`, `Total Premium: ${getPremium().length}`, `Total Plugin: ${Object.keys(getPlugins()).length}`, `Uptime: ${jUp}j ${mUp}m ${sUp}d`]))
    }

    // ═══════════════ FALLBACK ═══════════════
    const errMsg = `Haduhh sayang... 😮‍💨${readmore}\n\nMungkin kamu *typo* atau emang commandnya belum ada. Coba cek menu lagi ya!\n\n> ▸ Ketik *.menu* untuk lihat list\n> ▸ Atau *.allmenu* buat semua fitur`
    try {
      await sock.sendMessage(jid, { image: { url: THUMB_FALLBACK }, caption: errMsg }, { quoted: m })
    } catch {
      await reply(errMsg)
    }
    return

    } catch (globalErr) {
      console.error('Handler Error:', globalErr.message)
      try { await sock.sendMessage(m.key.remoteJid, { text: `Error: ${globalErr.message}` }, { quoted: m }) } catch {}
    }
  })
}

start()
