import '@testing-library/jest-dom'
import { loadEnvConfig } from '@next/env'

// Load environment variables from .env.test
loadEnvConfig(process.cwd(), true)
