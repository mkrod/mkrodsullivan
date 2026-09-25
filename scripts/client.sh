#!/bin/bash
set -x
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/root/.nvm/versions/node/v22.16.0/bin
PNPM_BIN="/root/.nvm/versions/node/v22.16.0/bin/pnpm"

cd /var/www/nodejs/mkrodsullivan/client || exit 1
# Ensure the build actually finishes successfully
$PNPM_BIN install && $PNPM_BIN run build || { echo "Client Build Failed"; exit 1; }

# Restart and point directly to the binary to stop the loop
pm2 restart MK_CLIENT || pm2 start $PNPM_BIN --name "MK_CLIENT" -- start