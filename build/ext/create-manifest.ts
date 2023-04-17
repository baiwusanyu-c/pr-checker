import fs from 'fs-extra'
import pkg from '../../package.json'

const outputDir = '../../dist/extension/manifest.json'
function getManifest() {
  return {
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: {
        19: './favicon_16.png',
        38: './favicon_32.png',
      },
      default_popup: './chrome-popup/popup.html',
    },
    options_ui: {
      page: './chrome-option/option.html',
      open_in_tab: true,
    },
    background: {
      service_worker: './chrome-background/index.js',
    },
    content_scripts: [],
    commands: {
      _execute_action: {
        suggested_key: {
          default: 'Ctrl+Shift+F',
          mac: 'MacCtrl+Shift+F',
        },
        description: 'Opens hello.html',
      },
    },
    host_permissions: [
      '*://*/*',
    ],
    permissions: [
      'storage',
      'activeTab',
    ],
    homepage_url: pkg.homepage,
    icons: {
      16: './favicon_16.png',
      32: './favicon_32.png',
      64: './favicon_64.png',
      128: './favicon_128.png',
    },
  }
}

export async function writeManifest() {
  await fs.writeJSON(outputDir, await getManifest(), { spaces: 2 })
}
