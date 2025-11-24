import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RpcStatus = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-2 glass-effect-strong rounded-lg p-4 max-w-sm"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-solana-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              RPC Endpoints
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-solana-green">●</span>
                <div>
                  <p className="font-medium">Primary: Alchemy Demo</p>
                  <p className="text-gray-400">Free public endpoint</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">●</span>
                <div>
                  <p className="font-medium">Fallback: Solana Mainnet</p>
                  <p className="text-gray-400">Official public RPC</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">●</span>
                <div>
                  <p className="font-medium">Fallback: Project Serum</p>
                  <p className="text-gray-400">Community endpoint</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400">
                App automatically switches between endpoints if one fails.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-solana-blue hover:text-solana-green transition-colors mt-1 inline-block"
              >
                Configure your own RPC →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect-strong rounded-full p-3 hover:bg-white/20 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="RPC Status"
      >
        <svg 
          className={`w-5 h-5 transition-colors ${isOpen ? 'text-solana-green' : 'text-gray-300 group-hover:text-white'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </motion.button>
    </div>
  );
};

export default RpcStatus;
