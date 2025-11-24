import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

// Multiple RPC endpoints for fallback (first one can be configured via .env)
const RPC_ENDPOINTS = [
  // Custom endpoint (recommended) or fall back to official Solana mainnet RPC
  import.meta.env.VITE_SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
  // Additional public/community endpoints as fallbacks
  'https://solana-api.projectserum.com',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
];

let currentEndpointIndex = 0;
let connection = new Connection(RPC_ENDPOINTS[currentEndpointIndex], 'confirmed');

// Function to switch to next RPC endpoint
const switchToNextEndpoint = () => {
  currentEndpointIndex = (currentEndpointIndex + 1) % RPC_ENDPOINTS.length;
  connection = new Connection(RPC_ENDPOINTS[currentEndpointIndex], 'confirmed');
  console.log(`Switched to RPC endpoint: ${RPC_ENDPOINTS[currentEndpointIndex]}`);
  return connection;
};

/**
 * Validates a Solana wallet address
 * @param {string} address - The wallet address to validate
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateSolanaAddress = (address) => {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Address cannot be empty' };
  }

  const trimmedAddress = address.trim();

  // Check if it's a .sol domain (SNS - Solana Name Service)
  if (trimmedAddress.endsWith('.sol')) {
    // For .sol domains, we'll need to resolve them
    return { isValid: true, error: null, isSNS: true };
  }

  // Check length (Solana addresses are typically 32-44 characters in base58)
  if (trimmedAddress.length < 32 || trimmedAddress.length > 44) {
    return { 
      isValid: false, 
      error: `Invalid address length. Expected 32-44 characters, got ${trimmedAddress.length}` 
    };
  }

  // Check if it's valid base58
  try {
    const decoded = bs58.decode(trimmedAddress);
    
    // Solana public keys are 32 bytes
    if (decoded.length !== 32) {
      return { 
        isValid: false, 
        error: `Invalid address format. Decoded length should be 32 bytes, got ${decoded.length}` 
      };
    }

    // Try to create a PublicKey object
    new PublicKey(trimmedAddress);
    
    return { isValid: true, error: null, isSNS: false };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'not a valid sol address⛔' 
    };
  }
};

/**
 * Resolves a Solana Name Service (.sol) domain to a public key
 * @param {string} domain - The .sol domain to resolve
 * @returns {Promise<string>} - The resolved public key
 */
export const resolveSNSDomain = async (domain) => {
  // For this demo, we'll use real Solana addresses for the example domains
  const knownDomains = {
    'toly.sol': '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9', // Solana Foundation Treasury
    'shaq.sol': 'GThUX1Atko4tqhN2NaiTazWSeFWMuiUvfFnyJyUghFMJ', // Solana Labs Wallet
    'mccann.sol': '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', // Example Active Wallet
  };

  const normalizedDomain = domain.toLowerCase().trim();
  
  if (knownDomains[normalizedDomain]) {
    return knownDomains[normalizedDomain];
  }

  // In a production app, you would use the SNS SDK to resolve domains
  // For now, we'll throw an error for unknown domains
  throw new Error('SNS domain resolution not available for this domain. Please use a public key address.');
};

/**
 * Fetches wallet information from Solana blockchain with retry logic
 * @param {string} address - The wallet address
 * @param {number} retryCount - Number of retries attempted
 * @returns {Promise<Object>} - Wallet information
 */
export const fetchWalletInfo = async (address, retryCount = 0) => {
  const maxRetries = RPC_ENDPOINTS.length;
  
  try {
    let publicKey;
    let resolvedAddress = address;

    // Check if it's a .sol domain
    if (address.endsWith('.sol')) {
      try {
        resolvedAddress = await resolveSNSDomain(address);
        publicKey = new PublicKey(resolvedAddress);
      } catch (error) {
        throw new Error(`Failed to resolve ${address}: ${error.message}`);
      }
    } else {
      publicKey = new PublicKey(address);
    }

    // Fetch balance
    const balance = await connection.getBalance(publicKey);
    const balanceInSOL = balance / LAMPORTS_PER_SOL;

    // Fetch recent transactions (limit to fewer for faster load)
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
    
    // Fetch transaction details (only for the first few signatures)
    const transactions = await Promise.all(
      signatures.slice(0, 3).map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            err: sig.err,
            success: !sig.err,
          };
        } catch (error) {
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            err: 'Failed to fetch details',
            success: false,
          };
        }
      })
    );

    // Get account info for additional details
    const accountInfo = await connection.getAccountInfo(publicKey);

    return {
      address: publicKey.toBase58(),
      originalAddress: address,
      balance: balanceInSOL,
      balanceInLamports: balance,
      transactions,
      totalTransactions: signatures.length,
      accountExists: accountInfo !== null,
      isExecutable: accountInfo?.executable || false,
      owner: accountInfo?.owner.toBase58() || null,
    };
  } catch (error) {
    const errorMessage = (error && error.message) ? error.message : String(error);

    // Handle specific error cases
    if (errorMessage.includes('Failed to resolve')) {
      throw error;
    }
    
    if (errorMessage.includes('Invalid public key')) {
      throw new Error('Invalid wallet address format');
    }
    
    // Handle 403 Forbidden errors by switching RPC endpoint
    if (errorMessage.includes('403') || errorMessage.includes('Access forbidden')) {
      if (retryCount < maxRetries - 1) {
        console.warn(`RPC endpoint returned 403, switching to next endpoint (attempt ${retryCount + 1}/${maxRetries})`);
        switchToNextEndpoint();
        return fetchWalletInfo(address, retryCount + 1);
      } else {
        throw new Error('All RPC endpoints are currently unavailable. Please try again later or use your own RPC endpoint.');
      }
    }
    
    // Handle rate limiting
    if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
      if (retryCount < maxRetries - 1) {
        console.warn(`Rate limit hit, switching to next endpoint (attempt ${retryCount + 1}/${maxRetries})`);
        switchToNextEndpoint();
        return fetchWalletInfo(address, retryCount + 1);
      } else {
        throw new Error('Rate limit exceeded on all endpoints. Please try again in a moment.');
      }
    }

    // Handle generic network errors like "TypeError: Failed to fetch"
    if (errorMessage.toLowerCase().includes('failed to fetch') || errorMessage.toLowerCase().includes('network error')) {
      if (retryCount < maxRetries - 1) {
        console.warn(`Network error, switching to next RPC endpoint (attempt ${retryCount + 1}/${maxRetries})`);
        switchToNextEndpoint();
        return fetchWalletInfo(address, retryCount + 1);
      } else {
        throw new Error('Network error on all RPC endpoints. Please check your internet connection or configure a custom RPC endpoint.');
      }
    }
    
    throw new Error(`Failed to fetch wallet information: ${errorMessage}`);
  }
};

/**
 * Formats a transaction signature for display
 * @param {string} signature - The transaction signature
 * @param {number} length - Number of characters to show on each end
 * @returns {string} - Formatted signature
 */
export const formatSignature = (signature, length = 8) => {
  if (!signature || signature.length <= length * 2) return signature;
  return `${signature.slice(0, length)}...${signature.slice(-length)}`;
};

/**
 * Formats a wallet address for display
 * @param {string} address - The wallet address
 * @param {number} length - Number of characters to show on each end
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, length = 6) => {
  if (!address || address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

/**
 * Formats a timestamp to a readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Formatted date
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};
