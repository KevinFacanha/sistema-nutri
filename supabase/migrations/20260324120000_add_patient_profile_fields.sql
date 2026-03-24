/*
  # Add patient profile fields (sexo, idade, origem_paciente)

  1. Changes
    - Add nullable fields to patient tables:
      - sexo (text)
      - idade (integer)
      - origem_paciente (text)
    - Keep backward compatibility with existing rows
    - Add safe check constraints for valid values
*/

DO $$
BEGIN
  IF to_regclass('public.patients') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'sexo'
    ) THEN
      ALTER TABLE public.patients ADD COLUMN sexo text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'idade'
    ) THEN
      ALTER TABLE public.patients ADD COLUMN idade integer;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'origem_paciente'
    ) THEN
      ALTER TABLE public.patients ADD COLUMN origem_paciente text;
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.pacientes_medico') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pacientes_medico' AND column_name = 'sexo'
    ) THEN
      ALTER TABLE public.pacientes_medico ADD COLUMN sexo text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pacientes_medico' AND column_name = 'idade'
    ) THEN
      ALTER TABLE public.pacientes_medico ADD COLUMN idade integer;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pacientes_medico' AND column_name = 'origem_paciente'
    ) THEN
      ALTER TABLE public.pacientes_medico ADD COLUMN origem_paciente text;
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.pacientes_mariane') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pacientes_mariane' AND column_name = 'sexo'
    ) THEN
      ALTER TABLE public.pacientes_mariane ADD COLUMN sexo text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pacientes_mariane' AND column_name = 'idade'
    ) THEN
      ALTER TABLE public.pacientes_mariane ADD COLUMN idade integer;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pacientes_mariane' AND column_name = 'origem_paciente'
    ) THEN
      ALTER TABLE public.pacientes_mariane ADD COLUMN origem_paciente text;
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.patients') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patients_sexo_check') THEN
      ALTER TABLE public.patients
        ADD CONSTRAINT patients_sexo_check
        CHECK (sexo IS NULL OR sexo IN ('Masculino', 'Feminino', 'Outro', 'Prefiro não informar'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patients_idade_check') THEN
      ALTER TABLE public.patients
        ADD CONSTRAINT patients_idade_check
        CHECK (idade IS NULL OR idade > 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patients_origem_paciente_check') THEN
      ALTER TABLE public.patients
        ADD CONSTRAINT patients_origem_paciente_check
        CHECK (
          origem_paciente IS NULL OR
          origem_paciente IN (
            'Instagram',
            'TikTok',
            'Google Ads',
            'Indicação de amigo',
            'Indicação de outro profissional'
          )
        );
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.pacientes_medico') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_medico_sexo_check') THEN
      ALTER TABLE public.pacientes_medico
        ADD CONSTRAINT pacientes_medico_sexo_check
        CHECK (sexo IS NULL OR sexo IN ('Masculino', 'Feminino', 'Outro', 'Prefiro não informar'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_medico_idade_check') THEN
      ALTER TABLE public.pacientes_medico
        ADD CONSTRAINT pacientes_medico_idade_check
        CHECK (idade IS NULL OR idade > 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_medico_origem_paciente_check') THEN
      ALTER TABLE public.pacientes_medico
        ADD CONSTRAINT pacientes_medico_origem_paciente_check
        CHECK (
          origem_paciente IS NULL OR
          origem_paciente IN (
            'Instagram',
            'TikTok',
            'Google Ads',
            'Indicação de amigo',
            'Indicação de outro profissional'
          )
        );
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.pacientes_mariane') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_mariane_sexo_check') THEN
      ALTER TABLE public.pacientes_mariane
        ADD CONSTRAINT pacientes_mariane_sexo_check
        CHECK (sexo IS NULL OR sexo IN ('Masculino', 'Feminino', 'Outro', 'Prefiro não informar'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_mariane_idade_check') THEN
      ALTER TABLE public.pacientes_mariane
        ADD CONSTRAINT pacientes_mariane_idade_check
        CHECK (idade IS NULL OR idade > 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_mariane_origem_paciente_check') THEN
      ALTER TABLE public.pacientes_mariane
        ADD CONSTRAINT pacientes_mariane_origem_paciente_check
        CHECK (
          origem_paciente IS NULL OR
          origem_paciente IN (
            'Instagram',
            'TikTok',
            'Google Ads',
            'Indicação de amigo',
            'Indicação de outro profissional'
          )
        );
    END IF;
  END IF;
END $$;
