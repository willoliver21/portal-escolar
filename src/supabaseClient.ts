import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://slkmxbkeaydibcefpmls.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsa214YmtlYXlkaWJjZWZwbWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTEwNjIsImV4cCI6MjA2NjY2NzA2Mn0.AkMNjPI-JdIcmoE3cZlCMh7pifXrSotD-pTBRQzpazc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
