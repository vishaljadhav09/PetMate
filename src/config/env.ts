import Constants from 'expo-constants';

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
  googleWebClientId: string;
  easProjectId: string;
  sentryDsn: string;
  appEnv: 'development' | 'staging' | 'production';
  isDev: boolean;
  isProd: boolean;
}

function getEnvVar(key: string, fallback = ''): string {
  return process.env[key] ?? (Constants.expoConfig?.extra?.[key] as string | undefined) ?? fallback;
}

export const env: EnvConfig = {
  supabaseUrl: getEnvVar('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY'),
  apiBaseUrl: getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'https://api.example.com'),
  googleWebClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'),
  easProjectId: getEnvVar('EXPO_PUBLIC_EAS_PROJECT_ID'),
  sentryDsn: getEnvVar('EXPO_PUBLIC_SENTRY_DSN'),
  appEnv: getEnvVar('EXPO_PUBLIC_APP_ENV', 'development') as EnvConfig['appEnv'],
  get isDev() {
    return this.appEnv === 'development';
  },
  get isProd() {
    return this.appEnv === 'production';
  },
};

export function validateEnv(): string[] {
  const warnings: string[] = [];
  if (!env.supabaseUrl) warnings.push('EXPO_PUBLIC_SUPABASE_URL is not set');
  if (!env.supabaseAnonKey) warnings.push('EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY is not set');
  return warnings;
}
