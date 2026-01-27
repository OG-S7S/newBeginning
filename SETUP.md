# Setup Instructions

## Prerequisites: Install Node.js

You need Node.js installed to run this project. Here are the installation options for macOS:

### Option 1: Install Node.js directly (Easiest)

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer and follow the instructions
4. Verify installation by opening a new terminal and running:
   ```bash
   node --version
   npm --version
   ```

### Option 2: Install via Homebrew (If you have Homebrew)

If you have Homebrew installed, run:
```bash
brew install node
```

If you don't have Homebrew, install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Option 3: Install via nvm (Node Version Manager)

1. Install nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. Restart your terminal or run:
   ```bash
   source ~/.zshrc
   ```

3. Install Node.js:
   ```bash
   nvm install --lts
   nvm use --lts
   ```

## Install pnpm (Recommended Package Manager)

After installing Node.js, install pnpm globally:

```bash
npm install -g pnpm
```

Or if you prefer npm (comes with Node.js):
```bash
# npm is already available with Node.js
```

## Project Setup Steps

Once Node.js is installed, run these commands in your terminal:

1. **Install dependencies:**
   ```bash
   pnpm install
   # OR
   npm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   # OR
   npm run dev
   ```

3. **Build for production:**
   ```bash
   pnpm build
   # OR
   npm run build
   ```

4. **Start production server:**
   ```bash
   pnpm start
   # OR
   npm start
   ```

## Verify Installation

After installing Node.js, verify it's working:

```bash
node --version   # Should show v18.x or higher
npm --version    # Should show 9.x or higher
```

## Troubleshooting

- If commands are not found after installation, restart your terminal
- Make sure you're in the project directory: `cd /Users/husseinattia/Downloads/new-beginning-academy-website`
- If you get permission errors, you may need to use `sudo` (not recommended) or fix npm permissions
