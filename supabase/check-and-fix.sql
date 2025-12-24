-- =====================================================
-- STEP 1: Verificar estrutura atual das tabelas
-- =====================================================

SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('clients', 'profiles', 'appointments')
ORDER BY table_name, ordinal_position;
