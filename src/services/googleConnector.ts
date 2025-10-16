import { gapi } from 'gapi-script';
import {
  generateId,
  ConnectorType,
  addConnection,
  getConnectionByType,
  removeConnection
} from './connectorService';

// Google API configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
];

// Initialize Google API client
export const initGoogleApi = () => {
  return new Promise<void>((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          clientId: GOOGLE_CLIENT_ID,
          scope: SCOPES.join(' '),
        })
        .then(() => {
          resolve();
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  });
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    await initGoogleApi();
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    
    const authResponse = googleUser.getAuthResponse(true);
    const profile = googleUser.getBasicProfile();
    
    // Create a connection object
    const connection = {
      id: generateId(),
      type: 'google' as ConnectorType,
      status: 'connected' as const,
      accessToken: authResponse.access_token,
      refreshToken: authResponse.refresh_token,
      expiresAt: Date.now() + authResponse.expires_in * 1000,
      profile: {
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
      },
      connectedAt: Date.now(),
    };
    
    // Store the connection
    addConnection(connection);
    
    return connection;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await initGoogleApi();
    const googleAuth = gapi.auth2.getAuthInstance();
    await googleAuth.signOut();
    
    // Find and remove Google connection
    const connection = getConnectionByType('google');
    if (connection) {
      removeConnection(connection.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error signing out from Google:', error);
    throw error;
  }
};

// Check if token is expired and refresh if needed
export const ensureValidToken = async () => {
  const connection = getConnectionByType('google');

  if (!connection) {
    throw new Error('No Google connection found');
  }

  // Check if token is expired (with 5-minute buffer)
  const fiveMinutes = 5 * 60 * 1000;
  if (connection.expiresAt && connection.expiresAt - fiveMinutes < Date.now()) {
    // Token is expired or will expire soon
    throw new Error('Google token expired or will expire soon. User needs to re-authenticate.');
  }

  return connection.accessToken;
};

// Example function to get Google Drive files
export const getGoogleDriveFiles = async () => {
  try {
    await ensureValidToken();
    
    await gapi.client.load('drive', 'v3');
    const response = await gapi.client.drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType, webViewLink)',
    });
    
    return response.result.files;
  } catch (error) {
    console.error('Error getting Google Drive files:', error);
    throw error;
  }
};