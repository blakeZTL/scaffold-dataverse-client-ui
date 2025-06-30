# Scaffold Dataverse Client UI

A scaffolding tool for creating Dataverse client-side web resource projects with TypeScript, ESLint, Prettier, and Rollup.

## Installation

```bash
npm install -g scaffold-davaverse-client-ui
```

## Usage

```bash
npx scaffold-davaverse-client-ui
```

The tool will prompt you for:

- Project name (must be lowercase with hyphens only)
- Package manager preference (npm, yarn, or pnpm) - if multiple are detected

## What's Included

The generated project includes:

### Dependencies

- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Rollup** - Module bundler optimized for libraries
- **@types/xrm** - TypeScript definitions for Dynamics 365/Dataverse

### Project Structure

```
your-project/
├── src/
│   ├── index.ts                 # Main entry point
│   └── EntityName/              # Entity-specific handlers
│       ├── index.ts
│       ├── OnLoad/              # Form OnLoad handlers
│       │   ├── index.ts
│       │   └── HandleSomethingOnLoad.ts
│       ├── OnChange/            # Field OnChange handlers
│       │   ├── index.ts
│       │   └── HandleFieldChange.ts
│       └── OnSave/              # Form OnSave handlers
│           ├── index.ts
│           └── HandleFormSave.ts
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── eslint.config.mjs
└── README.md                    # Comprehensive development guide
```

### Template Features

Each generated project includes:

- **Example handlers** for OnLoad, OnChange, and OnSave events
- **Best practices guide** with multiple export patterns
- **TypeScript examples** with proper type safety
- **Error handling patterns** and validation examples
- **Dataverse Web API usage** examples
- **Debugging and deployment** instructions

### Available Scripts

- `<package-manager> run build` - Build the project
- `<package-manager> run lint` - Run ESLint
- `<package-manager> run lint:fix` - Fix ESLint issues
- `<package-manager> run format` - Format code with Prettier
- `<package-manager> run format:check` - Check formatting

_Note: `<package-manager>` will be replaced with your chosen package manager (npm, yarn, or pnpm)_

## Development Workflow

1. Create your project:

   ```bash
   npx scaffold-davaverse-client-ui
   cd your-project-name
   ```

2. Develop your web resource handlers in the `src/` directory

3. Build your project:

   ```bash
   <package-manager> run build
   ```

4. The built files will be in the `dist/` directory, ready to upload to Dataverse

_Note: Replace `<package-manager>` with npm, yarn, or pnpm based on your selection_

## Example Usage

The template includes example handlers that you can customize:

```typescript
// src/EntityName/OnLoad/HandleSomethingOnLoad.ts
export function handleSomethingOnLoad(context: Xrm.Events.EventContext): void {
  const formContext = context.getFormContext();
  const entityName = formContext.data.entity.getEntityName();
  console.debug("handleSomethingOnLoad", `Entity Name: ${entityName}`);
}
```

## License

MIT
