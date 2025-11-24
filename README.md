# Solana Wallet Checker

A beautiful, modern React application for looking up Solana wallet addresses on the blockchain with real-time validation.

## Features

### Core Functionality
- ✅ **Solana Mainnet Integration** - Connects to Solana's mainnet via RPC endpoint
- ✅ **Wallet Address Validation** - Real-time validation with Base58 format checking
- ✅ **SNS Domain Support** - Supports .sol domain names (toly.sol, shaq.sol, mccann.sol)
- ✅ **Wallet Information Display** - Shows balance, transactions, and account status
- ✅ **Transaction History** - Displays recent transactions with links to Solscan explorer

### Design Features
- 🎨 **Vibrant Gradient Background** - Purple/blue/pink Solana-themed colors
- ✨ **Floating Animated Logos** - Smooth, hovering Solana logo animations
- 🔍 **Interactive Input Field** - Glow effects, smooth animations on focus/blur
- 💎 **Glassmorphism UI** - Modern glass effect cards with backdrop blur
- 📱 **Fully Responsive** - Works beautifully on all screen sizes
- ⚡ **Smooth Transitions** - Framer Motion animations throughout
- 🎭 **Loading States** - Elegant skeleton screens during data fetching
- ✅ **Success/Error States** - Clear visual feedback for all actions

### Error Handling
- ❌ Base58 format validation
- ❌ Address length validation (32-44 characters)
- ❌ Specific error messages for different failure types
- ❌ Network error handling with user-friendly messages
- ❌ Real-time validation feedback

## Tech Stack

- **React 18** - Modern functional components with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **Solana Web3.js** - Official Solana JavaScript SDK
- **bs58** - Base58 encoding/decoding for address validation

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## Usage

1. **Enter a wallet address** or click one of the example buttons
2. **Real-time validation** shows if the address format is valid
3. **Click Search** to fetch wallet information from the blockchain
4. **View wallet details** including balance and recent transactions
5. **Click on transactions** to view them on Solscan explorer

### Example Wallets

Try these pre-configured examples:
- `toly.sol` - Anatoly Yakovenko (Solana co-founder)
- `shaq.sol` - Shaquille O'Neal
- `mccann.sol` - McCann

## Project Structure

```
solana-wallet-checker/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx  # Floating Solana logos & gradient
│   │   └── WalletCard.jsx          # Wallet information display
│   ├── utils/
│   │   └── solanaUtils.js          # Solana blockchain utilities
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles & Tailwind
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
└── postcss.config.js               # PostCSS configuration
```

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Features in Detail

### Address Validation
- Checks for empty addresses
- Validates Base58 encoding
- Verifies 32-byte decoded length
- Supports .sol domain names
- Real-time feedback as you type

### Wallet Information
- **Balance** - Displayed in SOL with 4 decimal precision
- **Account Status** - Shows if account is active or inactive
- **Transaction Count** - Total number of transactions
- **Recent Transactions** - Last 5 transactions with:
  - Success/failure status
  - Transaction signature
  - Block slot number
  - Timestamp
  - Direct link to Solscan


## API & RPC

This app uses multiple Solana Mainnet RPC endpoints with automatic fallback:
1. `https://solana-mainnet.g.alchemy.com/v2/demo` (Primary)
2. `https://api.mainnet-beta.solana.com` (Fallback)
3. `https://solana-api.projectserum.com` (Fallback)

The app automatically switches between endpoints if one returns a 403 error or rate limit.

### Using Your Own RPC Endpoint

To use your own RPC endpoint, edit `src/utils/solanaUtils.js`:

```javascript
const RPC_ENDPOINTS = [
  'YOUR_RPC_ENDPOINT_HERE',
  // Add more fallback endpoints
];
```

**Recommended RPC Providers:**
- [Alchemy](https://www.alchemy.com/solana) - Free tier available
- [QuickNode](https://www.quicknode.com/chains/sol) - High performance
- [Helius](https://www.helius.dev/) - Developer-friendly
- [GenesysGo](https://www.genesysgo.com/) - Reliable infrastructure

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)


## Acknowledgments

- Built with ❤️ for the Solana ecosystem
- Solana logo and branding © Solana Foundation
