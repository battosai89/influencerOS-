import { useState } from 'react';
import { Connection } from '../types';
import { ConnectorCard } from './ConnectorCard';
import { signInWithGoogle, signOutFromGoogle } from '../services/googleConnector';

// Define connectors data
const connectors = {
  google: {
    id: 'google',
    name: 'Google',
    description: 'Connect your Google account to access Drive, Calendar, and more.',
    icon: '🔍',
    type: 'google' as const,
  },
} as const;

type Connector = typeof connectors.google;

// Simple connector store fallback
const useConnectorStore = () => ({
  connections: [],
  addConnection: (connection: Connection) => console.log('Adding connection:', connection),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getConnectionByType: (_type: string) => undefined,
  removeConnection: (id: string) => console.log('Removing connection:', id),
  updateConnection: (id: string, updates: Connection) => console.log('Updating connection:', id, updates),
});

export const ConnectorsPage: React.FC = () => {
  const { connections } = useConnectorStore();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleConnect = async (type: string) => {
    setIsLoading({ ...isLoading, [type]: true });
    try {
      if (type === 'google') {
        await signInWithGoogle();
      }
      // Add other connector types here as they are implemented
    } catch (error) {
      console.error(`Error connecting to ${type}:`, error);
    } finally {
      setIsLoading({ ...isLoading, [type]: false });
    }
  };

  const handleDisconnect = async (type: string) => {
    setIsLoading({ ...isLoading, [type]: true });
    try {
      if (type === 'google') {
        await signOutFromGoogle();
      }
      // Add other connector types here as they are implemented
    } catch (error) {
      console.error(`Error disconnecting from ${type}:`, error);
    } finally {
      setIsLoading({ ...isLoading, [type]: false });
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">External Connections</h1>
        <p className="text-gray-600 mt-2">
          Connect your InfluencerOS to external services to enhance your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.values(connectors) as Connector[]).map((connector) => {
          const connection = connections.find((c: Connection) => c.type === connector.type);
          return (
            <ConnectorCard
              key={connector.type}
              connector={connector}
              connection={connection}
              onConnect={() => handleConnect(connector.type)}
              onDisconnect={() => handleDisconnect(connector.type)}
            />
          );
        })}
      </div>
    </div>
  );
};