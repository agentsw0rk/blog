---
layout: post.njk
title: "Warum AI-Agenten Quellcode brauchen: Context Engineering mit repobridge"
description: "Ein Agent soll eine React/Vite-App erweitern - aber kennt er den Code hinter den Abhängigkeiten?"
date: 2026-05-23
author: arek
tags:
  - AI Agents
  - Context Engineering
  - Developer Tools
  - Source Code
  - Agentic Coding
featured: true
---

*Ein Agent kennt die Namen deiner Frameworks. Aber kennt er auch den Code,
auf dem dein Projekt wirklich läuft? Genau hier beginnt Context Engineering.*

---

Viele Fehler von Coding-Agenten entstehen nicht beim Tippen von Code. Sie
entstehen früher: Der Agent muss entscheiden, welchem Wissen er vertraut.

Ein typischer Auftrag in einer Frontend-Codebase klingt harmlos:

> "Füge ein neues Feature hinzu und nutze die bestehenden Framework-Patterns."

Das Projekt verwendet bekannte Bausteine aus demselben Stack:

```text
react
react-dom
vite
typescript
@vitejs/plugin-react
@tanstack/react-query
zod
```

Ein erfahrener Entwickler würde jetzt nicht aus dem Gedächtnis loslegen.
Er würde Projektmuster suchen, Versionen prüfen und bei Bedarf in den
Source Code der Libraries springen.

Ein AI-Agent arbeitet dagegen oft aus Trainingswissen, kurzen Docs-Snippets
oder zufällig vorhandenem Prompt-Kontext. Das funktioniert manchmal. Bis es
zu Versionsfehlern, falschen Imports oder erfundenen Framework-Patterns führt.

**repobridge** setzt genau dort an: Es macht die echten Source Trees der
verwendeten Frameworks und Libraries lokal auffindbar und baut daraus einen
lokalen AST-Graph. Agenten können dadurch Projektcode, Dependency-Code und
Repository-Snapshots mit denselben Befehlen durchsuchen.

Das Beispiel in diesem Artikel bleibt bewusst bei einer React/Vite-App. Der
Ansatz ist aber nicht auf Frontend beschränkt: repobridge unterstützt auch
npm, PyPI, crates.io, Maven, NuGet und direkte Repository-Quellen wie GitHub,
GitLab oder Bitbucket.

---

## Zwei Codebasen, ein Problem

In AI-Coding-Demos sieht es oft so aus, als gäbe es nur eine Codebasis: dein
Projekt. In realen Projekten gibt es aber immer zwei Ebenen.

### 1. Dein Projektcode

Das sind Components, Services, CLI-Commands, Tests, Konfiguration und
Domain-Logik. Hier ist ein Agent meistens stark: Er kann Dateien lesen,
Symbole suchen, Änderungen schreiben und Tests ausführen.

### 2. Der Code unter deinem Projekt

React rendert deine UI. React DOM verbindet sie mit dem Browser. Vite baut
und startet die App. TypeScript prüft Typen. React Query verwaltet Server
State. Zod validiert Daten an den Grenzen.

Dieser Code liegt selten direkt im Repository. Er steckt in Package-Caches,
Registries, Source-Artefakten oder GitHub-Repos. Wenn ein Agent diese Ebene
nicht lesen kann, arbeitet er mit einer unscharfen Vorstellung davon, wie dein
Projekt wirklich funktioniert.

**Context Engineering** heißt deshalb nicht: mehr Text in den Prompt. Es
heißt: dem Agenten die richtigen Quellen und Suchwege geben.

---

## Was repobridge macht

repobridge ist ein kleines Go-CLI-Tool. Die Idee:

> Aus Package- oder Repository-Spezifikationen werden stabile lokale
> Source-Pfade und durchsuchbare Graph-Indizes.

Der wichtigste neue Baustein ist `project:`. Damit wird auch das aktuelle
Repository selbst zu einer Quelle:

```bash
repobridge status project:.
repobridge files project:.
repobridge search project:. "createRoot" --kind function --limit 10
repobridge node project:. App --source-lines 20
```

Das ist nützlich, weil der Agent nicht mehr zwischen "lokales Projekt" und
"Dependency Source" umdenken muss. Er fragt beide über dieselbe Oberfläche ab.

Einzelne Quellen aus diesem Stack lassen sich direkt auflösen:

```bash
repobridge path react
repobridge path react-dom
repobridge path vite
repobridge path typescript
repobridge path @tanstack/react-query
repobridge path zod
```

Für Agentic Coding ist der Projektscan wichtiger:

```bash
repobridge scan --cwd . --json
repobridge scan --cwd . --fetch --limit 10
```

repobridge liest Manifest-/Lockfiles und Imports, zum Beispiel:

- `package.json`
- `package-lock.json`
- JavaScript-/TypeScript-Imports

Daraus entstehen Kandidaten:

```json
{
  "spec": "react@19.0.0",
  "ecosystem": "npm",
  "confidence": 96,
  "reasons": ["package-lock.json direct dependency"],
  "files": ["package-lock.json"]
}
```

Der Agent kann danach gezielt im passenden Source Tree suchen:

```bash
repobridge search react@19.0.0 "useSyncExternalStore" --kind function --limit 10
repobridge node react@19.0.0 useSyncExternalStore --source-lines 30
```

Das ist der Unterschied: Der Agent bekommt nicht nur eine Beschreibung von
React. Er bekommt einen lokalen, versionierten, durchsuchbaren Source Tree mit
Symbolsuche und Quellcodeausschnitten.

---

## Der Agent muss nicht alles wissen

Viele Diskussionen über Coding-Agenten drehen sich um Modellgröße:

- Kennt das Modell die Library?
- Ist sein Wissen aktuell?
- Reicht das Kontextfenster?

Das ist relevant, aber nicht genug.

Ein Agent, der "React kennt", weiß nicht automatisch, welche React-Version
in deinem Projekt installiert ist. Er weiß auch nicht, welches Pattern dein
Projekt nutzt oder ob ein Blog-Beispiel noch zur aktuellen API passt.

Ein guter Agent muss nicht alles im Modellkopf tragen. Er muss richtig
nachschlagen können.

Das ist normale Entwicklerarbeit: Niemand merkt sich jede Library komplett.
Gute Entwickler wissen, wo sie suchen müssen. repobridge macht diesen Schritt
agentenfreundlich.

---

## Der kompakte Workflow

Der Skill lässt sich so installieren:

```bash
npx skills add agentsw0rk/repobridge
```

Danach kann ein Agent diesen Ablauf nutzen:

```bash
repobridge scan --cwd . --json
repobridge scan --cwd . --fetch --limit 10
repobridge status project:.
repobridge search project:. "kind:route path:/login" --limit 10
```

Was passiert dabei?

1. **Projektwurzel finden.** Dependency-Kontext ist immer projektbezogen.
2. **Manifest- und Lockfile-Signale lesen.** Versionen schlagen Allgemeinwissen.
3. **Imports als Zusatzsignal nutzen.** Nicht jede transitive Dependency ist relevant.
4. **Source Code holen.** repobridge cached Source Snapshots lokal.
5. **Lesen und suchen.** Der Agent nutzt `search`, `node`, `callers`, `callees`,
   `context` und `explore`.

Beispiel:

```bash
repobridge search react@19.0.0 "useEffect" --kind function --limit 10
repobridge search react-dom@19.0.0 "createRoot" --kind function --limit 10
repobridge search @tanstack/react-query@5.0.0 "useQuery" --kind function --limit 10
```

Jetzt kann der Agent die Library wie Projektcode lesen. Er muss nicht raten,
wie das Framework arbeitet, und er muss auch keinen Dateipfad aus einem
Package-Cache zusammenbauen.

---

## Was in der Suche möglich ist

Ein lokaler Source Tree ist schon nützlich. Aber für Agenten wird es noch
interessanter, wenn aus diesem Source Tree ein AST-Graph wird.

Dann sucht der Agent nicht nur nach Text, sondern nach Struktur:

- Welche Funktionen heißen so?
- Welche Funktionen rufen diese Funktion auf?
- Welche Route führt zu welchem Handler?
- Welche Datei enthält welche Klassen, Methoden und Properties?
- Welche Klasse enthält welche Member?

Das sieht in der Praxis so aus.

### 1. Funktionen und Symbole finden

Wenn ein Agent wissen will, wo React DOM eine API bereitstellt, muss er nicht
das gesamte Repository lesen:

```bash
repobridge search react-dom@19.0.0 "createRoot" --kind function --limit 10
repobridge node react-dom@19.0.0 createRoot --source-lines 20
```

Das liefert keine Wand aus Zufallstreffern, sondern konkrete Graph-Nodes mit
Datei, Sprache, Zeile und optionalem Quellcodeausschnitt. Der Agent kann direkt
mit `node` weiterarbeiten, ohne erst einen Pfad im Cache zu öffnen.

### 2. Call-Flows untersuchen

Wenn ein Agent eine Änderung vorbereitet, ist oft wichtiger:

> Wer ruft das auf?

Oder:

> Was ruft diese Funktion selbst auf?

Beispiel:

```bash
repobridge callers react-dom@19.0.0 createRoot --depth 2
repobridge callees react-dom@19.0.0 createRoot --include-unresolved
repobridge impact react-dom@19.0.0 createRoot --depth 2
```

Damit kann der Agent einen Implementierungsfluss verfolgen, ohne die komplette
Library ins Kontextfenster zu kopieren. Ambigue oder nicht auflösbare Calls
bleiben sichtbar, statt still falsch geraten zu werden. `impact` erweitert
diese Perspektive: Welche Imports, Routen, Implementierungen oder Aufrufer
hängen an einer Änderung?

### 3. Framework-Routen suchen

In Backend- oder Fullstack-Projekten ist oft nicht der Funktionsname bekannt,
sondern die URL.

Ein Agent kann dann nach Routen suchen:

```bash
repobridge search project:. "kind:route path:/login"
repobridge callers project:. AuthController.login --depth 1
```

Das ist für Agentic Coding praktisch: Die Aufgabe lautet häufig "ändere
das Verhalten von POST /login", nicht "öffne Datei X und Funktion Y".

repobridge indexiert solche Hinweise für mehrere Framework-Familien, unter
anderem Spring Java/Kotlin, Express, React Router, FastAPI, Flask, Django,
Gin, chi, gorilla/mux, ASP.NET, Axum, actix und Rocket.

### 4. Dateistruktur und Member-Navigation

Die neuere AST-Graph-Engine speichert auch Strukturbeziehungen als
`contains`-Kanten. Das bedeutet:

```text
file -> module -> class -> method
file -> module -> class -> property
file -> function
```

Ein reales Beispiel mit Maven:

```bash
repobridge status maven:org.jetbrains.kotlin:kotlin-stdlib@2.0.20
repobridge search maven:org.jetbrains.kotlin:kotlin-stdlib@2.0.20 Arrays.kt --kind file --limit 10
repobridge callees maven:org.jetbrains.kotlin:kotlin-stdlib@2.0.20 commonMain/kotlin/collections/ArrayList.kt --edge contains
```

Das kann zum Beispiel zeigen:

```text
file commonMain/kotlin/collections/ArrayList.kt
  contains class kotlin.collections.ArrayList
```

Und von der Klasse aus weiter:

```bash
repobridge callees maven:org.jetbrains.kotlin:kotlin-stdlib@2.0.20 <array-list-node-id> --edge contains --limit 20
```

Dann sieht der Agent Methoden wie `trimToSize`, `ensureCapacity`, `isEmpty`,
`contains`, `get`, `add` oder `removeAt` als Kinder der Klasse. Er muss diese
Ownership nicht aus Pfaden, Einrückung oder Zeilennummern rekonstruieren.

Das ist besonders nützlich für Aufgaben wie:

- "Zeig mir die öffentliche Oberfläche dieser Klasse."
- "Welche Methoden gehören wirklich zu diesem Typ?"
- "Welche Top-Level-Funktionen liegen in dieser Datei?"
- "Welche Datei enthält den Handler, die Klasse und ihre lokalen Helfer?"

Der gleiche Mechanismus funktioniert auch kombiniert mit Call-Edges. Wenn ein
Agent von einer Klasse ausgeht, kann er erst in die enthaltenen Methoden
laufen und danach deren Callees verfolgen:

```bash
repobridge callees project:. Service --edge contains --edge calls --include-unresolved
```

Das ist besonders bei Kotlin und Java hilfreich: Ein Call wie `port.save(id)`
in einer Klasse kann über ein injiziertes Interface auf die Interface-Methode
zeigen, während `helper(id)` und ein Konstruktoraufruf im selben Durchlauf
sichtbar bleiben.

### 5. Kontext für eine konkrete Aufgabe bauen

Suche ist der erste Schritt. Für eine echte Änderung braucht ein Agent aber
oft ein kleines Paket aus Einstiegspunkten, Beziehungen, Snippets und Dateien.

Dafür gibt es `context` und `explore`:

```bash
repobridge context react-dom@19.0.0 "createRoot render flow" --budget small
repobridge explore github.com/vercel/next.js "AppRouter cache invalidation" --budget large --depth 2
repobridge context project:. "login validation flow" --budget small
```

`context` ist enger und auf eine Aufgabe zugeschnitten. `explore` ist breiter
und hilft, eine unbekannte Architektur zu verstehen. Beide sind für Agenten
wertvoll, weil sie den Output begrenzen: nicht alles lesen, sondern die
relevanten Stellen mit Beziehungen lesen.

Der wichtige Punkt: Der Agent bekommt nicht nur Treffer. Er bekommt eine
Arbeitskarte durch fremden Code.

---

## Warum Context Engineering wichtiger ist als Prompt Engineering

Prompt Engineering fragt:

> Wie formuliere ich die Aufgabe, damit das Modell gut antwortet?

Context Engineering fragt:

> Welche Quellen, Werkzeuge und Zugriffswege braucht der Agent, damit er die
> Aufgabe wirklich lösen kann?

In Softwareentwicklung ist die zweite Frage oft wichtiger.

Ein guter Prompt hilft wenig, wenn der Agent die falsche Version einer Library
annimmt. Ein kurzer Prompt reicht eher, wenn der Agent den echten Source Code
lesen kann.

Schlechter Kontext:

```text
Nutze React und implementiere es sauber.
```

Besserer Kontext:

```bash
repobridge search react@19.0.0 "useSyncExternalStore" --kind function --limit 10
repobridge node react@19.0.0 useSyncExternalStore --source-lines 30
```

Kontext ist dann nicht nur Text. Kontext ist eine navigierbare Ressource.

---

## Welche Signale zählen

repobridge ist kein Observability-Dashboard, aber der Workflow liefert
wichtige Hinweise:

| Signal | Warum es wichtig ist |
| --- | --- |
| Candidates | Welche Dependencies wurden erkannt? |
| Confidence | Wie stark ist das Signal? |
| Files | Woher stammt die Erkennung? |
| Fetch limit | Wie viel Kontext wird wirklich geholt? |
| Path resolution | Kann der Agent den Source Tree stabil wiederfinden? |
| Search results | Findet der Agent die relevante Stelle im Graph? |
| AST graph status | Ist der Index bereit, stale oder fehlgeschlagen? |
| Node and edge counts | Wie groß ist der durchsuchbare Graph? |
| Edge filters | Geht es um Calls, Imports, Routes oder Struktur? |

Diese Signale helfen, Kontext bewusst zu steuern. Ein Agent braucht nicht den
kompletten Dependency-Baum. Er braucht die richtigen Quellen für die aktuelle
Aufgabe.

---

## Warum nicht einfach Dokumentation?

Dokumentation bleibt wichtig. Aber Dokumentation ist nicht Source Code.

Docs zeigen Absicht, Beispiele und Happy Paths. Source Code zeigt Verhalten,
Default-Werte, Tests, Edge Cases und echte Implementierungsdetails.

Gerade für Agenten macht das einen Unterschied:

- Docs passen nicht immer zur installierten Version.
- Beispiele zeigen selten Grenzfälle.
- Interne Defaults stehen oft nur im Code.
- Tests erklären Verhalten, das in Guides nicht auftaucht.

Das Ziel ist nicht, Dokumentation zu ersetzen. Das Ziel ist, die Lücke
zwischen Dokumentation, Projektcode und tatsächlicher Implementierung zu
schließen.

---

## Was du mitnehmen kannst

1. **Kontext ist ein Designproblem.** Gute Agenten brauchen Dateien, Befehle,
   Suchwerkzeuge, Versionswissen und klare Grenzen.

2. **Versionen schlagen Allgemeinwissen.** "React" ist zu ungenau. "React in
   der Version dieses Projekts" ist handlungsfähiger Kontext.

3. **Nicht alles ist Kontext.** Ein fokussierter Source Tree ist besser als
   ein riesiger Dump transitive Dependencies.

4. **Suchbarkeit zählt.** Ein Graph-Query plus Quellcodeausschnitt ist oft
   wertvoller als tausend Tokens Beschreibung.

5. **Read-only schützt.** Dependency Source sollte Referenz sein, nicht
   Patch-Ziel.

---

## Schluss: Weniger Raten, mehr Quellen

Agentic Coding wird nicht verlässlicher, weil Prompts länger werden. Es wird
verlässlicher, wenn Agenten in einer Entwicklungsumgebung arbeiten, die ihnen
die richtigen Quellen zur richtigen Zeit gibt.

repobridge ist ein kleiner Baustein dafür: Es scannt ein Projekt, erkennt
verwendete Frameworks und Libraries, holt deren Source Code lokal und macht
ihn durchsuchbar.

Gute Softwareentwicklung ist selten ein Ratespiel. Sie ist Recherche,
Verstehen, Ändern und Testen.

Ein AI-Agent sollte genauso arbeiten.

---

*Wenn dir der Artikel gefallen hat, lass ein Klatschen da. Mich würde
interessieren: Welche Quellen gibst du deinen Coding-Agenten heute schon -
und wo raten sie noch zu oft?*
