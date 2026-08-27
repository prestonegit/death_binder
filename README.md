# DeathBinder

A quiet, offline-first personal estate and emergency continuity binder designed for families and executors.

## Overview

DeathBinder consolidates critical emergency directions, vital personal records, legal documents, financial accounts, and personal wishes. All data is saved exclusively to local device storage (`localStorage`) with no cloud sync, accounts, or telemetry.

## Key Features

- **Offline-First & Sovereign Privacy**: Stored 100% locally in your browser. Encrypted export and import via JSON backups.
- **Physical Binder Print Engine**: Formatted specifically for standard 8.5" × 11" 3-ring binders, including printable spine inserts (1.0", 1.5", 2.0") and tab divider cutouts.
- **Executor Action Checklist**: Chronological administrative guide from the first 24 hours through formal probate settlement.
- **Privacy Shield (`Alt + P`)**: Rapid on-screen masking of sensitive identifiers and account numbers.
- **Keyboard Navigation**:
  - `Alt + 1` / `Alt + 2`: Switch active profiles (Primary / Spouse)
  - `Alt + P`: Toggle Privacy Shield
  - `Alt + Left` / `Alt + Right`: Cycle section tabs
  - `Cmd / Ctrl + S`: Save confirmation

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript build
npm run build

# Run linter
npm run lint
```

