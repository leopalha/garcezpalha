#!/bin/bash
# MCP Servers Setup Script
# Installs and builds all implemented MCP servers

set -e

echo "🚀 Garcez Palha MCP Servers Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Function to setup a server
setup_server() {
    local SERVER_NAME=$1
    local SERVER_PATH=$2

    echo "${YELLOW}Setting up $SERVER_NAME...${NC}"

    if [ ! -d "$SERVER_PATH" ]; then
        echo "⚠️  $SERVER_PATH not found, skipping..."
        return
    fi

    cd "$SERVER_PATH"

    # Install dependencies
    echo "  📦 Installing dependencies..."
    npm install --silent

    # Build
    echo "  🔨 Building TypeScript..."
    npm run build --silent

    echo "${GREEN}  ✅ $SERVER_NAME ready${NC}"
    cd - > /dev/null
    echo ""
}

# Setup each implemented server
setup_server "Google Analytics 4" "ga4"
setup_server "Sentry Auto-Debug" "sentry"
setup_server "WhatsApp Business" "whatsapp"

# Check for config file
echo "📋 Configuration Check"
echo "====================="
echo ""

CONFIG_DIR="$HOME/Library/Application Support/Claude"
if [ "$OS" = "Windows_NT" ]; then
    CONFIG_DIR="$APPDATA/Claude"
fi

CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

if [ -f "$CONFIG_FILE" ]; then
    echo "✅ Claude config found at: $CONFIG_FILE"
else
    echo "⚠️  Claude config not found"
    echo "   Expected location: $CONFIG_FILE"
    echo ""
    echo "   Use the example config to create yours:"
    echo "   cp claude_desktop_config.example.json \"$CONFIG_FILE\""
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next Steps:"
echo "1. Configure API credentials in claude_desktop_config.json"
echo "2. Restart Claude Code"
echo "3. Verify servers loaded in Claude startup logs"
echo ""
echo "For detailed setup instructions, see:"
echo "  - mcp-servers/ga4/README.md"
echo "  - mcp-servers/sentry/README.md"
echo "  - mcp-servers/whatsapp/README.md"
echo ""
