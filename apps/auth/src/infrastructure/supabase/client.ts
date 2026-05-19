import { createClient } from '@supabase/supabase-js'
import { config } from '../config'
import { Database } from './database.types'

export const supabaseClient = createClient<Database>(config.supabase.url, config.supabase.key)
