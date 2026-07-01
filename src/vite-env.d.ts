/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string
  readonly VITE_REVIEWER?: 'rule-based' | 'ai'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
