import { motion } from 'framer-motion';
import { formatAddress, formatSignature, formatDate } from '../utils/solanaUtils';

const WalletCard = ({ walletInfo }) => {
  if (!walletInfo) return null;

  const { 
    address, 
    originalAddress,
    balance, 
    transactions, 
    totalTransactions,
    accountExists 
  } = walletInfo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      {/* Main wallet info card */}
      <div className="glass-effect-strong rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Information</h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-300 text-sm">
              {originalAddress !== address ? (
                <>
                  <span className="text-solana-green">{originalAddress}</span>
                  <span className="mx-2">→</span>
                </>
              ) : null}
              <span className="font-mono">{formatAddress(address, 8)}</span>
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="text-solana-blue hover:text-solana-green transition-colors"
              title="Copy address"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Balance section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-solana-purple/20 to-solana-blue/20 rounded-xl p-6 border border-solana-purple/30">
            <p className="text-gray-400 text-sm mb-2">Balance</p>
            <p className="text-4xl font-bold text-white">
              {balance.toFixed(4)} <span className="text-2xl text-solana-green">SOL</span>
            </p>
            {!accountExists && (
              <p className="text-yellow-400 text-sm mt-2">⚠️ Account not yet activated</p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-effect rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-white">{totalTransactions}</p>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Account Status</p>
            <p className="text-2xl font-bold text-solana-green">
              {accountExists ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.signature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-effect rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {tx.success ? (
                        <span className="text-solana-green text-xl">✓</span>
                      ) : (
                        <span className="text-red-400 text-xl">✗</span>
                      )}
                      <span className="font-mono text-sm text-gray-300">
                        {formatSignature(tx.signature)}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Slot: {tx.slot?.toLocaleString()}</span>
                    <span>{formatDate(tx.blockTime)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-effect rounded-lg p-8 text-center">
              <p className="text-gray-400">No recent transactions found</p>
            </div>
          )}
        </div>

        {/* Explorer link */}
        <div className="mt-6 text-center">
          <a
            href={`https://solscan.io/account/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-solana-blue hover:text-solana-green transition-colors"
          >
            <span>View on Solscan</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;
