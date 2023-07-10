

import os from 'node:os'

export function getNetworkInterfaces() {
  return Object.values(os.networkInterfaces()).flat().filter(item => item.family === 'IPv4').map(item => item.address)
}
