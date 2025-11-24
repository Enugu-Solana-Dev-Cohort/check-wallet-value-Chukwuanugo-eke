import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import WalletCard from './components/WalletCard';
import RpcStatus from './components/RpcStatus';
import { validateSolanaAddress, fetchWalletInfo } from './utils/solanaUtils';

// Example wallet addresses
const EXAMPLE_WALLETS = [
  { label: 'toly.sol', value: 'toly.sol' },
  { label: 'shaq.sol', value: 'shaq.sol' },
  { label: 'mccann.sol', value: 'mccann.sol' },
];

function App() {
  const [address, setAddress] = useState('');
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [validationPopup, setValidationPopup] = useState(null);

  // Auto-hide validation popup
  useEffect(() => {
    if (!validationPopup) return;
    const timer = setTimeout(() => setValidationPopup(null), 2500);
    return () => clearTimeout(timer);
  }, [validationPopup]);

  // Real-time validation
  useEffect(() => {
    if (address.trim() === '') {
      setValidationError(null);
      return;
    }

    const validation = validateSolanaAddress(address);
    if (!validation.isValid) {
      setValidationError(validation.error);
    } else {
      setValidationError(null);
    }
  }, [address]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter a wallet address');
      setValidationPopup({
        type: 'error',
        message: 'Not a valid Solana address or .sol domain',
      });
      return;
    }

    const validation = validateSolanaAddress(address);
    if (!validation.isValid) {
      setError(validation.error);
      setValidationPopup({
        type: 'error',
        message: 'Not a valid Solana address or .sol domain',
      });
      return;
    }

    setValidationPopup({
      type: 'success',
      message: 'Valid Solana address',
    });

    setLoading(true);
    setError(null);
    setWalletInfo(null);

    try {
      const info = await fetchWalletInfo(address.trim());
      setWalletInfo(info);
    } catch (err) {
      setError(err.message || 'Failed to fetch wallet information');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleAddress) => {
    setAddress(exampleAddress);
    setError(null);
    setValidationError(null);
    setValidationPopup(null);
  };

  const handleClear = () => {
    setAddress('');
    setWalletInfo(null);
    setError(null);
    setValidationError(null);
  };

  return (
    <div className="min-h-screen relative text-white">
      <AnimatedBackground />

      {/* Validation popup */}
      <AnimatePresence>
        {validationPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-4 z-30 px-4 py-3 rounded-xl shadow-lg glass-effect-strong border-l-4 ${
              validationPopup.type === 'success' ? 'border-emerald-400' : 'border-red-400'
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className={validationPopup.type === 'success' ? 'text-emerald-300' : 'text-red-300'}>
                {validationPopup.type === 'success' ? '✓' : '✗'}
              </span>
              <span>{validationPopup.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Solana Wallet Checker
          </h1>
          <p className="text-xl text-gray-300">
            Look up any Solana wallet address on the blockchain
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <motion.input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter Solana wallet address or .sol domain..."
                className={`w-full px-6 py-4 pr-32 text-white placeholder-gray-400 glass-effect-strong rounded-2xl 
                  focus:outline-none focus:ring-2 transition-all duration-300
                  ${isFocused ? 'ring-solana-purple shadow-lg shadow-solana-purple/50' : 'ring-transparent'}
                  ${validationError && !isFocused ? 'ring-2 ring-red-400' : ''}
                  ${!validationError && address && !isFocused ? 'ring-2 ring-solana-green' : ''}`}
                animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                {address && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    title="Clear"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
                
                <motion.button
                  type="submit"
                  disabled={loading || !!validationError}
                  className="px-6 py-2 bg-gradient-to-r from-solana-purple to-solana-blue text-white rounded-xl
                    font-semibold hover:shadow-lg hover:shadow-solana-purple/50 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    'Search'
                  )}
                </motion.button>
              </div>
            </div>

            {/* Validation feedback */}
            <AnimatePresence>
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 text-red-400 text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationError}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Example wallets */}
          <div className="text-center mb-8">
            <p className="text-gray-300 text-sm mb-3">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {EXAMPLE_WALLETS.map((example) => (
                <motion.button
                  key={example.value}
                  onClick={() => handleExampleClick(example.value)}
                  className="px-4 py-2 glass-effect rounded-lg text-solana-green hover:bg-white/20 
                    transition-all duration-300 text-sm font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {example.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-3xl mb-6"
            >
              <div className="glass-effect-strong rounded-2xl p-6 border-2 border-red-400/50">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                    <p className="text-gray-300 text-sm mb-2">{error}</p>
                    {error.includes('RPC') || error.includes('unavailable') ? (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                        <p className="text-blue-300 text-xs">
                          💡 <strong>Tip:</strong> Public RPC endpoints have rate limits. For better reliability, consider using your own RPC endpoint from providers like Alchemy, QuickNode, or Helius.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <div className="glass-effect-strong rounded-2xl p-8">
                <div className="space-y-4">
                  {/* Skeleton loader */}
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-white/10 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    <div className="h-32 bg-white/10 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-white/10 rounded"></div>
                      <div className="h-24 bg-white/10 rounded"></div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-white/10 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet information */}
        <AnimatePresence>
          {walletInfo && !loading && (
            <WalletCard walletInfo={walletInfo} />
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-400 text-sm"
        >
          <p>Powered by Solana Mainnet • Built with React & Tailwind CSS</p>
        </motion.div>
      </div>

      {/* RPC Status Component */}
      <RpcStatus />
    </div>
  );
}

export default App;
