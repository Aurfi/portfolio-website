<template>
  <div v-if="showMonitor && isDevelopment" class="performance-monitor">
    <div class="monitor-header">
      <h4>Performance Monitor</h4>
      <button @click="toggleMonitor" class="toggle-btn">
        {{ isExpanded ? '−' : '+' }}
      </button>
    </div>

    <div v-if="isExpanded" class="monitor-content">
      <!-- Web Vitals -->
      <div class="metrics-section">
        <h5>Core Web Vitals</h5>
        <div class="metrics-grid">
          <div
            v-for="metric in webVitals"
            :key="metric.name"
            class="metric-item"
            :class="metric.rating"
          >
            <div class="metric-name">{{ metric.name }}</div>
            <div class="metric-value">{{ formatMetricValue(metric) }}</div>
            <div class="metric-rating">{{ metric.rating }}</div>
          </div>
        </div>
      </div>

      <!-- Performance Info -->
      <div class="metrics-section">
        <h5>Performance Info</h5>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Connection:</span>
            <span class="info-value">{{ connectionType }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Memory:</span>
            <span class="info-value">{{ memoryUsage }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Viewport:</span>
            <span class="info-value">{{ viewportSize }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="monitor-actions">
        <button @click="refreshMetrics" class="action-btn">Refresh Metrics</button>
        <button @click="exportMetrics" class="action-btn">Export Data</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

const showMonitor = ref(false)
const isExpanded = ref(false)
const webVitals = ref<WebVitalMetric[]>([])
const connectionType = ref('unknown')
const memoryUsage = ref('unknown')
const viewportSize = ref('unknown')

const isDevelopment = computed(() => {
  return import.meta.env.DEV
})

const toggleMonitor = () => {
  isExpanded.value = !isExpanded.value
}

const formatMetricValue = (metric: WebVitalMetric) => {
  if (metric.name === 'CLS') {
    return metric.value.toFixed(3)
  }
  return `${Math.round(metric.value)}ms`
}

const updateConnectionInfo = () => {
  // @ts-ignore - navigator.connection is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (connection) {
    connectionType.value = `${connection.effectiveType || 'unknown'} (${connection.downlink || '?'}Mbps)`
  }
}

const updateMemoryInfo = () => {
  // @ts-ignore - performance.memory is non-standard
  if (performance.memory) {
    const used = Math.round(performance.memory.usedJSHeapSize / 1048576)
    const total = Math.round(performance.memory.totalJSHeapSize / 1048576)
    memoryUsage.value = `${used}MB / ${total}MB`
  }
}

const updateViewportInfo = () => {
  viewportSize.value = `${window.innerWidth}x${window.innerHeight}`
}

const refreshMetrics = () => {
  updateConnectionInfo()
  updateMemoryInfo()
  updateViewportInfo()
  initWebVitals()
}

const exportMetrics = () => {
  const data = {
    webVitals: webVitals.value,
    connection: connectionType.value,
    memory: memoryUsage.value,
    viewport: viewportSize.value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-metrics-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const initWebVitals = async () => {
  try {
    const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals')

    interface Metric {
      name: string
      value: number
      delta: number
      id: string
    }
    
    const handleMetric = (metric: Metric) => {
      const webVital: WebVitalMetric = {
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
      }

      // Update existing metric or add new one
      const existingIndex = webVitals.value.findIndex((m) => m.name === metric.name)
      if (existingIndex >= 0) {
        webVitals.value[existingIndex] = webVital
      } else {
        webVitals.value.push(webVital)
      }
    }

    onCLS(handleMetric)
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  } catch (error) {
    console.warn('Web Vitals not available:', error)
  }
}

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
    default:
      return 'good'
  }
}

// Keyboard shortcut to toggle monitor
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'P') {
    event.preventDefault()
    showMonitor.value = !showMonitor.value
    if (showMonitor.value) {
      refreshMetrics()
    }
  }
}

onMounted(() => {
  if (isDevelopment.value) {
    document.addEventListener('keydown', handleKeyPress)
    refreshMetrics()

    // Auto-show in development after a delay
    setTimeout(() => {
      showMonitor.value = true
    }, 2000)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style lang="scss" scoped>
.performance-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  z-index: 9999;
  min-width: 280px;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.monitor-content {
  padding: 16px;
}

.metrics-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  h5 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: #ffd700;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

.metric-item {
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &.good {
    background: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.3);
  }

  &.needs-improvement {
    background: rgba(251, 191, 36, 0.2);
    border-color: rgba(251, 191, 36, 0.3);
  }

  &.poor {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.metric-name {
  font-weight: 600;
  font-size: 11px;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 2px;
}

.metric-rating {
  font-size: 10px;
  opacity: 0.8;
  text-transform: uppercase;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.info-label {
  font-weight: 600;
  opacity: 0.8;
}

.info-value {
  font-family: inherit;
  color: #ffd700;
}

.monitor-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

// Mobile adjustments
@media (max-width: 768px) {
  .performance-monitor {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
