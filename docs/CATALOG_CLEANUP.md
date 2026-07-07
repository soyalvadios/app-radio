# Catalog Cleanup v5

Date: 2026-07-07
Previous commit: 1300353

## Changes

- `CATALOG_VERSION`: 4 -> 5
- All 61 station names normalized (trimmed, slogans removed, frequencies appended)
- All 61 tag sets cleaned (noise removed, categories added)
- `docs/CATALOG_CLEANUP.md` created

## Name mapping

| # | Original | New |
|---|----------|-----|
| 0 | 88.9 NOTICIAS: Información Que Sirve... | 88.9 Noticias |
| 1 | 90S DANCE by Mix: Dance de los 90 | 90s Dance by Mix |
| 2 | ALFA: Donde Todo Nace | Alfa 91.3 |
| 3 | AMOR EN CONCIERTO: Éxitos en vivo en español | Amor en Concierto |
| 4 | AMOR SOLO POP: Pop y baladas en español | Amor Solo Pop |
| 5 | AMOR: Sólo Música Romántica | Amor 95.3 |
| 6 | ARROBA FM: Te Conecta | Arroba FM |
| 7 | AZUL 89: El Color de la Música | Azul 89 |
| 8 | BEAT: Total Music | Beat 100.9 |
| 9 | BUENÍSIIMA: Está Buenísima | Buenísiima 1530 |
| 10 | CHILANGO RADIO: La Radio Que Viene, Viene | Chilango Radio 105.3 |
| 11 | EL FONÓGRAFO: Música las 24 Horas | El Fonógrafo |
| 12 | EL FONÓGRAFO: Música Ligada a tu Recuerdo | El Fonógrafo 690 |
| 13 | EL HERALDO RADIO HD2: Música Continua 🆕 | El Heraldo Radio HD2 |
| 14 | EL HERALDO RADIO: La "H" Que Sí Suena 🆕 | El Heraldo Radio 98.5 |
| 15 | EL ROCKÓDROMO de Radio Felicidad: Rock and Roll... | El Rockódromo |
| 16 | EXA FM: En Todas Partes | Exa FM 104.9 |
| 17 | FRECUENCIA: Radio Comunitaria | Frecuencia 106.9 |
| 18 | GRUPO FÓRMULA (103.3): Abriendo la Conversación | Grupo Fórmula 103.3 |
| 19 | GRUPO FÓRMULA (104.1): Abriendo la Conversación | Grupo Fórmula 104.1 |
| 20 | HERALDO RADIO HD2: Música Continua. 24 horas... | Heraldo Radio HD2 |
| 21 | HERALDO RADIO: La "H" Que Sí Suena | Heraldo Radio 98.5 |
| 22 | IBERO: El Milagro de la Radio | Ibero 90.9 |
| 23 | IBERO.2: Música Para Pensar | Ibero.2 |
| 24 | IHEARTRADIO POP: Éxitos en inglés | iHeartRadio Pop |
| 25 | IMAGEN RADIO: Poniendo a México en la misma Sintonía | Imagen Radio 90.5 |
| 26 | IMAGEN RADIO: Poniendo a México en la misma sintonía | Imagen Radio 90.5 |
| 27 | JOYA: La Radio Inteligente | Joya 93.7 |
| 28 | LA BESTIA GRUPERA: Dejando Huella | La Bestia Grupera 540 |
| 29 | LA COMADRE: Puros Éxitos!!! | La Comadre 1260 |
| 30 | LA KEBUENA: ¡Aquí Suena La KeBuena! | La KeBuena 92.9 |
| 31 | LA MEJOR: ¡Aquí Nomás! | La Mejor 97.7 |
| 32 | LA Q: Pura Música | La Q 940 |
| 33 | LA Z: Salvajemente Grupera | La Z 107.3 |
| 34 | LAS IMPRESCINDIBLES de Radio Felicidad: Baladas... | Las Imprescindibles |
| 35 | LAS LLEGADORAS de Radio Felicidad: Baladas... | Las Llegadoras |
| 36 | LOKURA: Te Reto A Que Me Escuches | Lokura 830 |
| 37 | LOS40: La Radio de los Conciertos | Los 40 101.7 |
| 38 | MATCH: ¡Más Pop, Conéctate! | Match 99.3 |
| 39 | MIX EN VIVO: Rock y pop en vivo | Mix en Vivo |
| 40 | MIX HARD ROCK: El mejor Hard Rock en inglés | Mix Hard Rock |
| 41 | MIX OCHENTAS: New Wave, Glam y Rock de los 80s | Mix Ochentas |
| 42 | MIX: 80's, 90's y Más | Mix 106.5 |
| 43 | MVS NOTICIAS: El Poder de las Palabras | MVS Noticias 102.5 |
| 44 | NEW CENTURY by Match: Pop y rock del nuevo siglo | New Century by Match |
| 45 | OYE: Se Oye | Oye 89.7 |
| 46 | PA BAILAR: Banda y grupera para la fiesta | Pa Bailar |
| 47 | PIANO LANDSCAPES: Música instrumental... | Piano Landscapes |
| 48 | RADIO 620: La Música Que Llegó Para Quedarse | Radio 620 |
| 49 | RADIO CENTRO: Calidad En Tu Vida... | Radio Centro 1030 |
| 50 | W RADIO: La W | W Radio 96.9 |
| 51 | REACTOR 105.7: Generación R | Reactor 105.7 |
| 52 | OPUS 94: Música Clásica | Opus 94.5 |
| 53 | UNIVERSAL STEREO: La Estación de los Clásicos | Universal Stereo 88.1 |
| 54 | RADIO UNAM: Experiencia sonora | Radio UNAM 96.1 |
| 55 | HORIZONTE: Claridad informativa y todo el jazz | Horizonte 107.9 |
| 56 | UAM RADIO: Abierta al tiempo | UAM Radio 94.1 |
| 57 | RADIO EDUCACIÓN: Cultura en señal | Radio Educación 96.5 |
| 58 | RADIO DISNEY: Todos los éxitos | Radio Disney 92.1 |
| 59 | STEREO CIEN: El equilibrio perfecto... | Stereo Cien 100.1 |
| 60 | SABROSITA: La más caliente | Sabrosita 590 |

## Categories applied

Categories added to each station's tags for search:
- noticias, informativa, hablada
- pop, hits, juvenil
- rock, alternativa, indie
- romántica, balada
- clásica, ópera, cultural
- jazz
- electrónica, dance, edm
- regional mexicano, grupera, banda
- salsa, tropical
- universitaria, cultural, educativa
- comunitaria
- instrumental, relax
- clásicos, adult contemporary
- 80s, 90s, 70s, 60s, 50s
- inglés, español

## Noise tags removed

américa, norteamérica, latinoamérica, valle de méxico, moi merino,
cdmx, ciudad de méxico, entretenimiento, estación, music, méxico,
mexico city (and variants)

## Files touched

- `stations_parsed.json` (names + tags)
- `src/services/CatalogStorageService.ts` (CATALOG_VERSION 4 -> 5)
- `docs/CATALOG_CLEANUP.md` (new)

## Verification

- `npm run typecheck` : OK
- JSON válido: OK
- Todos los arrays 61 items: OK
- Frecuencias preservadas en tags para parseFreqBand: OK
- Stream URLs intactas: OK
