// Database service to fetch data for the sidebar and application

// Types for sidebar metrics
export interface SidebarMetrics {
  employees: {
    count: number;
    active: number;
  };
  tasks: {
    count: number;
    pending: number;
    inProgress: number;
    completed: number;
    highPriority: number;
  };
  allocation: {
    engineStatus: 'running' | 'paused';
    lastOptimization: string;
    optimizationScore: number;
  };
  monitoring: {
    status: 'active' | 'inactive';
    alerts: number;
  };
  analytics: {
    lastUpdated: string;
    insights: number;
  };
  settings: {
    pendingChanges: boolean;
  };
}

// Cache to improve performance
let metricsCache: SidebarMetrics | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5000; // 5 seconds cache time

/**
 * Fetch sidebar metrics with caching
 */
export async function fetchSidebarMetrics(): Promise<SidebarMetrics> {
  const now = Date.now();
  
  // Return cached data if it's fresh enough
  if (metricsCache && (now - lastFetchTime < CACHE_TTL)) {
    return metricsCache;
  }
  
  // Simulated network delay (in a real app, this would be a database or API call)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate slightly random data to simulate real-time changes
  const randomChange = () => Math.floor(Math.random() * 5) - 2;
  
  // Create new metrics or update existing ones with small variations
  const newMetrics: SidebarMetrics = {
    employees: {
      count: 245,
      active: Math.min(245, Math.max(175, (metricsCache?.employees.active || 187) + randomChange())),
    },
    tasks: {
      count: 342,
      pending: Math.min(150, Math.max(100, (metricsCache?.tasks.pending || 128) + randomChange())),
      inProgress: Math.min(110, Math.max(70, (metricsCache?.tasks.inProgress || 89) + randomChange())),
      completed: Math.min(150, Math.max(100, (metricsCache?.tasks.completed || 125) + randomChange())),
      highPriority: Math.min(60, Math.max(0, (metricsCache?.tasks.highPriority || 47) + (Math.random() > 0.7 ? randomChange() : 0))),
    },
    allocation: {
      engineStatus: Math.random() > 0.9 ? 'paused' : 'running',
      lastOptimization: new Date(Date.now() - Math.floor(Math.random() * 600000)).toISOString(), // 0-10 minutes ago
      optimizationScore: Math.min(100, Math.max(80, (metricsCache?.allocation.optimizationScore || 94.2) + (Math.random() > 0.7 ? (Math.random() * 0.6) - 0.3 : 0))),
    },
    monitoring: {
      status: Math.random() > 0.95 ? 'inactive' : 'active',
      alerts: Math.min(10, Math.max(0, (metricsCache?.monitoring.alerts || 2) + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
    },
    analytics: {
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7200000)).toISOString(), // 0-2 hours ago
      insights: Math.min(10, Math.max(0, (metricsCache?.analytics.insights || 5) + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
    },
    settings: {
      pendingChanges: Math.random() > 0.8 ? true : false,
    },
  };
  
  // Update cache
  metricsCache = newMetrics;
  lastFetchTime = now;
  
  return newMetrics;
}

// Active refresh callbacks
const refreshCallbacks: Set<(metrics: SidebarMetrics) => void> = new Set();
let globalIntervalId: NodeJS.Timeout | null = null;

/**
 * Setup metrics refresh with global interval optimization
 * This allows multiple components to receive updates from a single interval
 */
export function setupMetricsRefresh(callback: (metrics: SidebarMetrics) => void, interval = 30000) {
  // Add callback to our set
  refreshCallbacks.add(callback);
  
  // Initial fetch
  fetchSidebarMetrics().then(callback);
  
  // Set up global interval if not already running
  if (!globalIntervalId) {
    globalIntervalId = setInterval(async () => {
      try {
        const metrics = await fetchSidebarMetrics();
        // Call all registered callbacks with new metrics
        refreshCallbacks.forEach(cb => cb(metrics));
      } catch (error) {
        console.error("Error refreshing metrics:", error);
      }
    }, interval);
  }
  
  // Return cleanup function
  return () => {
    refreshCallbacks.delete(callback);
    
    // If no more callbacks, clear the interval
    if (refreshCallbacks.size === 0 && globalIntervalId) {
      clearInterval(globalIntervalId);
      globalIntervalId = null;
    }
  };
} 