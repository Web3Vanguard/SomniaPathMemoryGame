/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_SOMNIA_ENABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

