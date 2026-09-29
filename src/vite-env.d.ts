/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ENV?: string;
  readonly VITE_API?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
