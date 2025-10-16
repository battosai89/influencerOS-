export interface ConnectorConfig {
  id: string
  name: string
  type: ConnectorType
  description: string
  icon: string
  isConnected: boolean
  lastSync?: Date
  settings?: Record<string, unknown>
}

export interface Connection {
  id: string
  type: ConnectorType
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: Date
  errorMessage?: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  profile?: {
    name: string
    email: string
    picture: string
  }
  connectedAt?: number
}

export type ConnectorType =
  | 'google'
  | 'google-analytics'
  | 'google-ads'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'shopify'
  | 'woocommerce'

export interface ConnectorStore {
  connectors: ConnectorConfig[]
  connections: Connection[]
  isLoading: boolean
  error: string | null
}

const initialState: ConnectorStore = {
  connectors: [
    {
      id: 'google',
      name: 'Google',
      type: 'google',
      description: 'Connect Google account for authentication and API access',
      icon: '🌐',
      isConnected: false,
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      type: 'google-analytics',
      description: 'Track website traffic and user behavior',
      icon: '📊',
      isConnected: false,
    },
    {
      id: 'google-ads',
      name: 'Google Ads',
      type: 'google-ads',
      description: 'Import campaign performance data',
      icon: '🎯',
      isConnected: false,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      type: 'facebook',
      description: 'Connect Facebook Pages and Ads',
      icon: '📘',
      isConnected: false,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      type: 'instagram',
      description: 'Sync Instagram Business accounts',
      icon: '📷',
      isConnected: false,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      type: 'tiktok',
      description: 'Connect TikTok for Business',
      icon: '🎵',
      isConnected: false,
    },
  ],
  connections: [],
  isLoading: false,
  error: null,
}

const store = { ...initialState }

// Store methods for direct access (Zustand-like interface)
const storeMethods = {
  // Add a new connection
  addConnection: (connection: Connection) => {
    addConnection(connection)
  },

  // Get connection by type
  getConnectionByType: (type: ConnectorType) => {
    return getConnectionByType(type)
  },

  // Remove connection by id
  removeConnection: (id: string) => {
    removeConnection(id)
  },

  // Update connection by id
  updateConnection: (id: string, updates: Partial<Connection>) => {
    updateConnection(id, updates)
  },

  // Get the full store state
  getState: () => store
}

export const useConnectorStore = () => {
  return {
    ...storeMethods,
    ...store
  }
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

export const connectConnector = async (type: ConnectorType): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const connection: Connection = {
      id: generateId(),
      type,
      status: 'connected',
      lastSync: new Date(),
    }

    store.connections.push(connection)

    const connector = store.connectors.find(c => c.type === type)
    if (connector) {
      connector.isConnected = true
      connector.lastSync = new Date()
    }

    return true
  } catch (error) {
    console.error('Failed to connect:', error)
    return false
  }
}

export const disconnectConnector = async (type: ConnectorType): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    store.connections = store.connections.filter(c => c.type !== type)

    const connector = store.connectors.find(c => c.type === type)
    if (connector) {
      connector.isConnected = false
      connector.lastSync = undefined
    }

    return true
  } catch (error) {
    console.error('Failed to disconnect:', error)
    return false
  }
}

export const syncConnector = async (type: ConnectorType): Promise<boolean> => {
  try {
    store.isLoading = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const connection = store.connections.find(c => c.type === type)
    if (connection) {
      connection.lastSync = new Date()
      connection.status = 'connected'
    }

    return true
  } catch (error) {
    console.error('Failed to sync:', error)
    const connection = store.connections.find(c => c.type === type)
    if (connection) {
      connection.status = 'error'
      connection.errorMessage = error instanceof Error ? error.message : 'Unknown error'
    }
    return false
  } finally {
    store.isLoading = false
  }
}

export const getConnectorStatus = (type: ConnectorType): 'connected' | 'disconnected' | 'error' => {
  const connection = store.connections.find(c => c.type === type)
  return connection?.status || 'disconnected'
}

export const getAllConnectors = (): ConnectorConfig[] => {
  return store.connectors
}

export const getActiveConnections = (): Connection[] => {
  return store.connections
}

export const addConnection = (connection: Connection): void => {
  store.connections.push(connection)
}

export const getConnectionByType = (type: ConnectorType): Connection | undefined => {
  return store.connections.find(c => c.type === type)
}

export const removeConnection = (id: string): void => {
  store.connections = store.connections.filter(c => c.id !== id)
}

export const updateConnection = (id: string, updates: Partial<Connection>): void => {
  const connectionIndex = store.connections.findIndex(c => c.id === id)
  if (connectionIndex !== -1) {
    store.connections[connectionIndex] = { ...store.connections[connectionIndex], ...updates }
  }
}