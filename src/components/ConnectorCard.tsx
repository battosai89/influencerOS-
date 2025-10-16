import Image from 'next/image';

// Define connector types
interface ConnectorConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'google' | 'facebook' | 'instagram' | 'twitter';
}

interface Connection {
  id: string;
  type: string;
  profile?: {
    name: string;
    email: string;
    picture?: string;
  };
}

interface ConnectorCardProps {
  connector: ConnectorConfig;
  connection?: Connection;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
  connector,
  connection,
  onConnect,
  onDisconnect,
}) => {
  const isConnected = !!connection;
  
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
            {/* Replace with actual icon component based on your icon library */}
            <span className="text-xl">{connector.icon}</span>
          </div>
          <div>
            <h3 className="font-medium text-lg">{connector.name}</h3>
            <p className="text-sm text-gray-500">{connector.description}</p>
          </div>
        </div>
        <div>
          {isConnected ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Connected
            </span>
          ) : null}
        </div>
      </div>
      
      {isConnected && connection.profile ? (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-3">
            {connection.profile.picture && (
              <Image 
                src={connection.profile.picture} 
                alt={connection.profile.name || 'Profile'} 
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{connection.profile.name}</p>
              <p className="text-sm text-gray-500">{connection.profile.email}</p>
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="flex justify-end">
        {isConnected ? (
          <button
            onClick={onDisconnect}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};