\---

description: Checklist final para probar APK Android de Nopales Radio

agent: build

\---



Haz QA final del APK de Nopales Radio.



No cambies código todavía.



Revisa:

1\. git status

2\. npm run typecheck

3\. app.json

4\. eas.json

5\. README.md

6\. SECURITY.md

7\. src/hooks/useRadioPlayer.ts

8\. app/(tabs)/tuner.tsx

9\. src/services/CatalogStorageService.ts



Valida que:

\- No haya secretos.

\- RECORD\_AUDIO no esté permitido.

\- Background playback esté configurado.

\- Tuner use streaming, no FM hardware real.

\- CatalogProvider siga compartido.

\- useRadioPlayer no esté duplicado.

\- README tenga instrucciones APK.

\- SECURITY.md documente riesgos.

\- No haya cambios sin commit.



Luego dame:

\- Estado actual

\- Checklist para probar en teléfono Android real

\- Si está listo para release v1.0.0

\- Si falta algo crítico

