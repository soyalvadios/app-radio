# Security Policy

## Scope

Nopales Radio is a client-side mobile app with no backend. It does not handle user accounts, authentication, payment data, or personal identifiable information (PII).

## Data Storage

All data (catalog, favorites, preferences) is stored locally on-device via React Native AsyncStorage. No data is transmitted to any server beyond the streaming URLs themselves, which are public radio station streams.

## Reporting a Vulnerability

This project has minimal attack surface. If you discover a security issue:

1. Open an issue on GitHub (do not include sensitive details).
2. For private disclosure, reach out to the repository maintainer via GitHub.
3. Do not disclose the issue publicly until it has been addressed.

## Dependencies

Known vulnerabilities in build tooling (js-yaml, postcss, uuid via Expo toolchain) are acknowledged but cannot be resolved without breaking the Expo SDK version. These affect the development/build environment, not the runtime app.
