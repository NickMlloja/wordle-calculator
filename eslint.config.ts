import tseslint from "typescript-eslint";
import eslintJs from "@eslint/js";

export default [
    eslintJs.configs.recommended,

    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    {
        files: ["**/*.{ts,mts,cts}"],

        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: 2024,
                sourceType: "module"
            }
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/strict-boolean-expressions": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-unsafe-assignment": "error",
            "@typescript-eslint/no-unsafe-member-access": "error",
            "@typescript-eslint/no-unsafe-call": "error",
            "@typescript-eslint/no-unsafe-return": "error",
            "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
            "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
            "@typescript-eslint/member-ordering": "error",
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/unbound-method": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/restrict-plus-operands": "error",
            "@typescript-eslint/restrict-template-expressions": "error",

            "no-debugger": "error",
            "eqeqeq": ["error", "always"],
            "curly": "error",
            "no-var": "error",
            "prefer-const": "error",
            "consistent-return": "error",
            "no-implicit-globals": "error",
            "no-param-reassign": "error",
            "prefer-arrow-callback": "error",
            "default-case": "error",
            "no-empty-function": "error",
            "no-duplicate-imports": "error",
            "no-shadow": "error"
        }
    }
];
