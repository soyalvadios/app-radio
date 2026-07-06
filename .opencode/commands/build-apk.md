\---

description: Generar APK preview con EAS para Nopales Radio

agent: build

\---



Genera APK preview de Nopales Radio.



Reglas:

\- No cambiar código.

\- No cambiar dependencias.

\- No migrar Expo SDK.

\- No ejecutar npm audit fix --force.

\- No hacer commit automático.



Ejecuta:

1\. git status

2\. npm run typecheck

3\. npx eas-cli@latest build -p android --profile preview



Al final dame:

\- Resultado de git status

\- Resultado de typecheck

\- Link del APK

\- Commit incluido en el build

