\---

description: Preparar release v1.0.0 de Nopales Radio

agent: build

\---



Prepara release v1.0.0 de Nopales Radio.



No cambies código salvo que encuentres un error crítico.



Tareas:

1\. git status

2\. git log -1 --oneline

3\. npm run typecheck

4\. Confirmar que README tiene:

&#x20;  - logo

&#x20;  - features

&#x20;  - instalación

&#x20;  - build APK

&#x20;  - disclaimer

&#x20;  - PayPal

5\. Confirmar que SECURITY.md existe.

6\. Confirmar que app.json está como Nopales Radio.

7\. Confirmar que eas.json genera APK preview.

8\. Confirmar que no hay secretos.



Si todo está OK, dame los comandos para crear release:



git tag -a v1.0.0 -m "Nopales Radio v1.0.0"

git push origin v1.0.0



También dame texto listo para GitHub Release con:

\- resumen

\- features

\- notas

\- link para APK

