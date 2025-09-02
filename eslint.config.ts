import eslint from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  eslint.configs.recommended,
  stylistic.configs.customize({
    quotes: "double",
  }),
  tseslint.configs.strict,
  tseslint.configs.stylistic,
)
