<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { motion } from 'motion-v'
import { Map as MapIcon, Search, Loader2 } from 'lucide-vue-next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
const markers = ref<L.Marker[]>([])

const selectedAgency = ref('All Agencies')
const agencies = ['All Agencies', 'DSWD', 'PhilHealth', 'Pag-IBIG', 'SSS', 'DOLE', 'DOH', 'OWWA']
const isLoading = ref(false)
const searchError = ref('')

interface Branch {
  id: string
  agency: string
  name: string
  lat: number
  lng: number
  address: string
}

const fetchedBranches = ref<Branch[]>([])
const cachedBboxes = new Set<string>()

// Location Selectors
const regions = ref<any[]>([])
const selectedRegionCode = ref('')
const provinces = ref<any[]>([])
const selectedProvinceCode = ref('')

const initMap = () => {
  if (!mapContainer.value) return

  // Default to Metro Manila center (Zoom 13 for smaller initial bounding box)
  map = L.map(mapContainer.value).setView([14.5995, 121.0366], 13)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  // Render cached markers initially
  renderMarkers()

  // Fetch initial data
  searchArea()
}

const fetchRegions = async () => {
  const cached = localStorage.getItem('psgc_regions')
  if (cached) {
    try {
      regions.value = JSON.parse(cached)
      return
    } catch (e) {
      console.error('Failed to parse cached regions', e)
    }
  }

  try {
    const res = await fetch('https://psgc.gitlab.io/api/regions')
    const data = await res.json()
    // Sort regions alphabetically by name
    const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name))
    regions.value = sorted
    localStorage.setItem('psgc_regions', JSON.stringify(sorted))
  } catch (error) {
    console.error('Failed to fetch regions', error)
  }
}

const onRegionChange = async () => {
  selectedProvinceCode.value = ''
  provinces.value = []

  if (!selectedRegionCode.value) return

  const cacheKey = `psgc_provinces_${selectedRegionCode.value}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      provinces.value = JSON.parse(cached)
      return
    } catch (e) {
      console.error('Failed to parse cached provinces', e)
    }
  }

  isLoading.value = true
  try {
    // Some regions (like NCR) don't have provinces but have cities, so we fetch both and combine.
    const [provRes, cityRes] = await Promise.all([
      fetch(`https://psgc.gitlab.io/api/regions/${selectedRegionCode.value}/provinces`),
      fetch(`https://psgc.gitlab.io/api/regions/${selectedRegionCode.value}/cities`)
    ])

    const provData = provRes.ok ? await provRes.json() : []
    const cityData = cityRes.ok ? await cityRes.json() : []

    // Combine and sort
    const combined = [...provData, ...cityData].sort((a: any, b: any) => a.name.localeCompare(b.name))
    provinces.value = combined
    localStorage.setItem(cacheKey, JSON.stringify(combined))
  } catch (error) {
    console.error('Failed to fetch provinces', error)
  } finally {
    isLoading.value = false
  }
}

const onProvinceChange = async () => {
  if (!selectedProvinceCode.value || !map) return

  isLoading.value = true
  searchError.value = ''

  const province = provinces.value.find(p => p.code === selectedProvinceCode.value)
  const region = regions.value.find(r => r.code === selectedRegionCode.value)

  if (!province || !region) return

  const query = `${province.name}, ${region.name}, Philippines`
  const cacheKey = `geocode_${query.replace(/\s+/g, '_')}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      const coords = JSON.parse(cached)
      map.setView([coords.lat, coords.lng], 13)
      searchArea()
      isLoading.value = false
      return
    } catch (e) {
      console.error('Failed to parse cached geocode', e)
    }
  }

  try {
    // Geocode the selected province/city using OSM Nominatim
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
    const data = await res.json()

    if (data && data.length > 0) {
      const { lat, lon } = data[0]
      const latNum = parseFloat(lat)
      const lngNum = parseFloat(lon)
      // Pan map to new location
      map.setView([latNum, lngNum], 13)
      // Store in cache
      localStorage.setItem(cacheKey, JSON.stringify({ lat: latNum, lng: lngNum }))
      // Automatically search the new area
      searchArea()
    } else {
      searchError.value = 'Could not find coordinates for this location.'
    }
  } catch (error) {
    console.error('Geocoding error', error)
    searchError.value = 'Failed to locate province on map.'
  } finally {
    isLoading.value = false
  }
}

const getAgencyBgColor = (agency: string) => {
  switch (agency) {
    case 'DSWD': return 'bg-red-500'
    case 'PhilHealth': return 'bg-green-500'
    case 'Pag-IBIG': return 'bg-blue-600'
    case 'SSS': return 'bg-indigo-600'
    case 'DOLE': return 'bg-orange-500'
    case 'DOH': return 'bg-pink-600'
    case 'OWWA': return 'bg-cyan-600'
    default: return 'bg-slate-500'
  }
}

const createCustomIcon = (agency: string) => {
  const bgColor = getAgencyBgColor(agency)
  const borderTopColor = bgColor.replace('bg-', 'border-t-')

  const html = `
    <div class="relative flex flex-col items-center group">
      <!-- Shadow cast on the map base -->
      <div class="absolute bottom-[-1.5px] left-1/2 -translate-x-1/2 w-5 h-1.5 bg-black/25 dark:bg-black/45 rounded-full blur-[1.5px] z-0 transition-transform group-hover:scale-75"></div>
      
      <!-- Pin Circle with enhanced shadow -->
      <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} text-white shadow-[0_6px_12px_rgba(0,0,0,0.35)] border-[2.5px] border-white relative z-10 transition-transform group-hover:-translate-y-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
      </div>
      
      <!-- Pin Triangle tip with drop shadow -->
      <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${borderTopColor} -mt-1.5 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] transition-transform group-hover:-translate-y-0.5"></div>
    </div>
  `
  return L.divIcon({
    html,
    className: 'bg-transparent border-0',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36]
  })
}

const renderMarkers = () => {
  if (!map) return

  // Clear existing markers
  markers.value.forEach(m => m.remove())
  markers.value = []

  const filtered = selectedAgency.value === 'All Agencies'
    ? fetchedBranches.value
    : fetchedBranches.value.filter(b => b.agency === selectedAgency.value)

  filtered.forEach(branch => {
    try {
      const marker = L.marker([branch.lat, branch.lng], {
        icon: createCustomIcon(branch.agency)
      }).addTo(map!)

      marker.bindPopup(`
        <div class="font-sans min-w-[200px] p-0.5">
          <h3 class="font-bold text-slate-900 text-[15px] leading-tight">${branch.name}</h3>
          <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed">${branch.address}</p>
          <div class="mt-2.5 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-block text-white shadow-sm ${getAgencyBgColor(branch.agency)}">
            ${branch.agency}
          </div>
        </div>
      `)
      markers.value.push(marker)
    } catch (err) {
      console.error(`Error rendering marker for ${branch.name}:`, err)
    }
  })
}

const searchArea = async (force = false) => {
  if (!map) return

  // Enforce a minimum zoom level to prevent oversized queries
  if (map.getZoom() < 12) {
    searchError.value = 'Please zoom in closer to search for branches.'
    return
  }

  // Self-healing desync check: if cached branches are empty but we have cached bboxes, reset them
  if (fetchedBranches.value.length === 0 && cachedBboxes.size > 0) {
    cachedBboxes.clear()
    localStorage.removeItem('ayuda_cached_bboxes')
  }

  const bounds = map.getBounds()
  // Round coordinates to 2 decimal places (roughly 1km precision) to create a cache key
  const cacheKey = `${bounds.getSouth().toFixed(2)},${bounds.getWest().toFixed(2)},${bounds.getNorth().toFixed(2)},${bounds.getEast().toFixed(2)}`

  if (!force && cachedBboxes.has(cacheKey)) {
    renderMarkers()
    return
  }

  isLoading.value = true
  searchError.value = ''

  const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`

  const query = `
    [out:json][timeout:15];
    (
      node["name"~"DSWD|PhilHealth|Pag-IBIG|Pag IBIG|SSS|Social Security System|DOLE|Department of Labor|DOH|Department of Health|OWWA|Overseas Workers",i](${bbox});
      way["name"~"DSWD|PhilHealth|Pag-IBIG|Pag IBIG|SSS|Social Security System|DOLE|Department of Labor|DOH|Department of Health|OWWA|Overseas Workers",i](${bbox});
    );
    out center;
  `

  const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://z.overpass-api.de/api/interpreter'
  ]

  try {
    let data: any = null
    let lastError: any = null

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), 6000) // 6-second timeout per mirror

        const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
          signal: controller.signal
        })
        clearTimeout(id)

        if (res.ok) {
          data = await res.json()
          break
        } else {
          lastError = new Error(`Server returned ${res.status}: ${res.statusText}`)
        }
      } catch (err) {
        lastError = err
      }
    }

    if (!data) throw lastError || new Error('Failed to fetch from OpenStreetMap')

    const newBranches: Branch[] = data.elements.map((el: any) => {
      const lat = el.lat || el.center?.lat
      const lon = el.lon || el.center?.lon
      const name = el.tags?.name || 'Unknown Branch'
      let agency = 'Other'

      const nameLower = name.toLowerCase()
      if (nameLower.includes('dswd')) agency = 'DSWD'
      else if (nameLower.includes('philhealth')) agency = 'PhilHealth'
      else if (nameLower.includes('pag-ibig') || nameLower.includes('pag ibig')) agency = 'Pag-IBIG'
      else if (nameLower.includes('sss') || nameLower.includes('social security system')) agency = 'SSS'
      else if (nameLower.includes('dole') || nameLower.includes('department of labor')) agency = 'DOLE'
      else if (nameLower.includes('doh') || nameLower.includes('department of health')) agency = 'DOH'
      else if (nameLower.includes('owwa') || nameLower.includes('overseas workers')) agency = 'OWWA'

      const address = [
        el.tags?.['addr:housenumber'],
        el.tags?.['addr:street'],
        el.tags?.['addr:city']
      ].filter(Boolean).join(', ') || 'No address provided'

      return {
        id: el.id.toString(),
        agency,
        name,
        lat,
        lng: lon,
        address
      }
    })

    const existingIds = new Set(fetchedBranches.value.map(b => b.id))
    const uniqueNewBranches = newBranches.filter(b => !existingIds.has(b.id))

    if (uniqueNewBranches.length > 0) {
      fetchedBranches.value = [...fetchedBranches.value, ...uniqueNewBranches]
      localStorage.setItem('ayuda_branches', JSON.stringify(fetchedBranches.value))
    }

    cachedBboxes.add(cacheKey)
    localStorage.setItem('ayuda_cached_bboxes', JSON.stringify(Array.from(cachedBboxes)))
    renderMarkers()

  } catch (error: any) {
    console.error(error)
    searchError.value = 'Failed to load branches. Please try again.'
  } finally {
    isLoading.value = false
  }
}

watch(selectedAgency, () => {
  renderMarkers()
})

onMounted(() => {
  // Load cached branches from localStorage
  const cachedBranches = localStorage.getItem('ayuda_branches')
  if (cachedBranches) {
    try {
      fetchedBranches.value = JSON.parse(cachedBranches)
    } catch (e) {
      console.error('Failed to parse cached branches', e)
    }
  }

  // Load cached bboxes from localStorage
  const cachedBboxesJson = localStorage.getItem('ayuda_cached_bboxes')
  if (cachedBboxesJson) {
    try {
      const arr = JSON.parse(cachedBboxesJson)
      arr.forEach((key: string) => cachedBboxes.add(key))
    } catch (e) {
      console.error('Failed to parse cached bboxes', e)
    }
  }

  initMap()
  fetchRegions()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-8">
    <motion.div class="mb-8" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
          <MapIcon class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-200 tracking-tight flex items-center gap-2">
          {{ $t('locator.title') }}
        </h2>
      </div>
      <p class="text-slate-600 dark:text-slate-400 max-w-2xl">
        {{ $t('locator.desc') }}
      </p>
    </motion.div>

    <motion.div
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 shadow-sm mb-8"
      :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.1 }">

      <!-- Top Filters & Manual Location Picker -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <!-- Agency Filter -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{
            $t('locator.filterBy') }}</label>
          <select v-model="selectedAgency"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="agency in agencies" :key="agency" :value="agency">
              {{ agency === 'All Agencies' ? $t('locator.allAgencies') : agency }}
            </option>
          </select>
        </div>

        <!-- Region Dropdown -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{
            $t('locator.selectRegion') }}</label>
          <select v-model="selectedRegionCode" @change="onRegionChange"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>-- {{ $t('locator.selectRegion') }} --</option>
            <option v-for="region in regions" :key="region.code" :value="region.code">
              {{ region.name }}
            </option>
          </select>
        </div>

        <!-- Province Dropdown -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{
            $t('locator.selectProvince') }}</label>
          <select v-model="selectedProvinceCode" @change="onProvinceChange"
            :disabled="!selectedRegionCode || provinces.length === 0"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="" disabled>-- {{ $t('locator.selectProvince') }} --</option>
            <option v-for="province in provinces" :key="province.code" :value="province.code">
              {{ province.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
        <button @click="searchArea(true)" :disabled="isLoading"
          class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50">
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Search v-else class="w-4 h-4" />
          Search Map Area
        </button>

        <!-- Agency Color Legend -->
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Legend</span>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
            <span>DSWD</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span>
            <span>PhilHealth</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></span>
            <span>Pag-IBIG</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm"></span>
            <span>SSS</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm"></span>
            <span>DOLE</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-pink-600 shadow-sm"></span>
            <span>DOH</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-600 shadow-sm"></span>
            <span>OWWA</span>
          </div>
        </div>
      </div>

      <div v-if="searchError"
        class="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium rounded-lg">
        {{ searchError }}
      </div>

      <div
        class="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
        <div ref="mapContainer" class="w-full h-full"></div>
      </div>

      <div
        class="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <p>Location data via Philippine Standard Geographic Code (PSGC). Map by OpenStreetMap.</p>
        <p v-if="fetchedBranches.length > 0"
          class="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md whitespace-nowrap">Found {{ fetchedBranches.length
          }} branches cached.</p>
      </div>
    </motion.div>
  </main>
</template>

<style scoped>
:deep(.leaflet-tile) {
  filter: grayscale(100%) brightness(105%) contrast(92%);
}

.dark :deep(.leaflet-tile) {
  filter: grayscale(100%) brightness(75%) contrast(100%) invert(100%);
}
</style>
