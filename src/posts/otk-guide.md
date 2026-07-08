---
layout: post.njk
title: "Open Knowledge Format: Warum Agenten portable Memory brauchen"
description: "OKF macht Teamwissen als Markdown-Graph versionierbar, portabel und für AI-Agenten lesbar."
date: 2026-07-08T09:00:00+02:00
author: arek
tags:
  - AI Agents
  - Context Engineering
  - Agent Memory
  - Developer Tools
  - Knowledge Graph
---

*OKF macht Teamwissen als Markdown-Graph versionierbar, portabel und für
AI-Agenten lesbar.*

---

Jeder Entwickler, der mit Coding-Agenten arbeitet, kennt denselben Bruch:
Die Session endet. Am nächsten Morgen beginnt alles wieder von vorn.

Der Agent liest erneut den Auth-Flow. Er errät wieder, warum eine drei Jahre
alte Architekturentscheidung so getroffen wurde. Er öffnet dieselben fünf
Dateien, rekonstruiert denselben Kontext und verliert Zeit mit Wissen, das du
ihm gestern schon erklärt hast.

Die übliche Antwort darauf heißt `CLAUDE.md`, `AGENTS.md` oder irgendeine
andere Projektdatei, die beim Start einer Session geladen wird. Das hilft,
aber es ist ein grobes Werkzeug.

Diese Dateien laden oft zu viel, zu früh und für zu viele Aufgaben. Sie
vermischen Verhaltensregeln mit Faktenwissen:

- "Schreibe immer Tests"
- "Die Orders-Tabelle hängt über `customer_id` an Customers"
- "Nutze nie direkt den Legacy-Endpoint"
- "Vor Analytics-Aufgaben erst diese Query lesen"

Das ist alles wichtig. Aber es ist nicht dieselbe Art von Information.

Am 12. Juni 2026 hat Google Cloud eine Spezifikation veröffentlicht, die genau
diese Lücke adressiert: **Open Knowledge Format**, kurz **OKF**.

OKF ist keine neue Agentenplattform. Es ist ein Format. Und gerade deshalb ist
es interessant.

---

## Welches Problem OKF löst

Wenn ein Agent wissen soll, wie ein Team "Weekly Active Users" berechnet,
liegt die Antwort selten an einer Stelle.

Sie verteilt sich über verschiedene Systeme:

| Ort | Was dort liegt |
| --- | --- |
| Metadata Catalogs | Tabellenschemas, oft hinter Hersteller-APIs |
| Wiki oder Notion | Runbooks, Metrikdefinitionen, Prozesswissen |
| Codekommentare | Docstrings, Inline-Notizen, Randfälle |
| Köpfe im Team | Join-Pfade, Warnungen, historische Entscheidungen |

Nichts davon reist sauber mit dem Code. Nichts davon überlebt automatisch eine
neue Agenten-Session. Und fast jedes Team löst Kontextaufbau wieder selbst:
mit Prompts, Projektdateien, Wikis, Exporten, Scripts oder Tooling um
Tooling herum.

OKF setzt an einer einfachen These an:

> Das fehlende Stück ist nicht noch eine Plattform. Es ist ein gemeinsames
> Format für Wissen.

Ein Format kann versioniert werden. Es kann in Git liegen. Es kann von
Menschen gelesen und von Agenten traversiert werden. Es muss nicht wissen,
welcher Editor, welche Cloud oder welcher Agent es später nutzt.

---

## Was OKF eigentlich ist

Open Knowledge Format v0.1 ist eine offene, herstellerneutrale Spezifikation
unter Apache 2.0.

Ein OKF-Bundle ist einfach ein Verzeichnis aus Markdown-Dateien mit
YAML-Frontmatter.

Kein Schema-Registry-Zwang. Kein Runtime-Server. Kein SDK. Wenn ein Tool eine
Datei lesen kann, kann es OKF lesen. Wenn ein Agent Markdown-Links folgen kann,
kann er sich durch das Wissen bewegen.

Die Spezifikation ist bewusst klein. Genau ein Feld ist verpflichtend:

```yaml
type: Service
```

Alles andere ist optional oder wird vom Producer definiert.

Das klingt fast zu schlicht. Aber darin liegt der Punkt. OKF will nicht
festlegen, wie jedes Unternehmen seine Welt modelliert. Es definiert den
kleinsten gemeinsamen Nenner, damit Wissen zwischen Tools reisen kann.

---

## Ein Verzeichnis wird zum Wissensgraphen

Ein OKF-Bundle sieht zum Beispiel so aus:

```text
.okf/
  index.md
  log.md
  services/
    index.md
    auth-api.md
    payments-service.md
  datasets/
    index.md
    orders-db.md
  metrics/
    index.md
    weekly-active-users.md
  decisions/
    index.md
    why-we-use-postgres.md
```

Die wichtigste Designentscheidung:

> Der Dateipfad ist die Identität des Konzepts.

`services/auth-api.md` ist nicht nur eine Datei. Es ist das Konzept
"Auth API". `metrics/weekly-active-users.md` ist die Metrik. Links zwischen
Dateien sind Beziehungen zwischen Konzepten.

Zwei Dateinamen sind reserviert:

- `index.md` ist der Einstiegspunkt für progressive Disclosure
- `log.md` ist die chronologische Änderungshistorie, neueste Einträge zuerst

Alles andere sind Konzeptdokumente.

Das passt sehr gut zu Agenten. Ein Agent muss nicht das komplette Wissen in
den Kontext laden. Er liest zuerst `index.md`, entscheidet, welcher Bereich
relevant ist, und steigt dann gezielt tiefer ein.

Genau so sollte Kontext funktionieren: nicht alles auf einmal, sondern das
Richtige zur richtigen Zeit.

---

## Anatomie einer OKF-Datei

Ein Konzeptdokument braucht mindestens ein `type`-Feld. Typische weitere
Felder sind `title`, `description`, `resource`, `tags` oder `timestamp`.

```markdown
---
type: Service
title: "Auth API"
description: "Issues and verifies short-lived access tokens."
resource: https://github.com/acme/auth
tags: [auth, platform]
timestamp: 2026-06-14T10:00:00Z
---

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /token | Exchange credentials for a JWT. |
| GET | /verify | Validate a token. |

## Why This Exists

See [why-we-separated-auth](../decisions/why-we-separated-auth.md).
User scoping depends on [orders-db](../datasets/orders-db.md).
```

Der Body bleibt normales Markdown. Das ist wichtig, weil die Datei gleichzeitig
für Menschen und Maschinen funktioniert.

Ein Mensch kann sie in einem Pull Request prüfen. Ein Agent kann das
Frontmatter parsen, Markdown-Links folgen und daraus einen kleinen Graphen
aufbauen:

```text
auth-api.md
  -> decisions/why-we-separated-auth.md
  -> datasets/orders-db.md
       -> datasets/customers-db.md
```

Das ist kein Graph-Datenbank-Projekt. Es ist ein Graph, der aus normalen
Dateien entsteht.

---

## Die drei Prinzipien

OKF ist klein, aber nicht beliebig. Drei Prinzipien tragen das Format.

### 1. Minimal opinionated

OKF schreibt nur sehr wenig vor.

`type` ist verpflichtend. Welche Typen ein Team nutzt, ist offen:

- `Service`
- `Dataset`
- `Metric`
- `Decision`
- `Runbook`
- `DomainConcept`

Auch die Struktur des Markdown-Bodys ist nicht hart standardisiert. Das
Format definiert Interoperabilität, nicht dein internes Wissensmodell.

Das ist sinnvoll. Ein Data-Team beschreibt andere Dinge als ein
Backend-Team. Eine Plattformorganisation braucht andere Typen als ein
Produktteam. Trotzdem können alle dieselbe Datei- und Linkmechanik nutzen.

### 2. Producer und Consumer sind unabhängig

OKF trennt sauber zwischen dem, was Wissen erzeugt, und dem, was Wissen
nutzt.

Producer können sein:

- Menschen
- Agenten
- BigQuery- oder Catalog-Pipelines
- Wiki-Exporte
- LLM-basierte Enrichment-Jobs

Consumer können sein:

- Coding-Agenten
- Search-Indizes
- HTML-Visualizer
- Dokumentationsseiten
- andere interne Tools

Solange beide Seiten Markdown mit Frontmatter verstehen, müssen sie nicht
voneinander wissen.

### 3. Format, nicht Plattform

Das ist der wichtigste Unterschied zu vielen Agent-Memory-Produkten.

OKF braucht kein Konto, keine zentrale Registry, keinen laufenden Service und
keine proprietäre API. Der Wert entsteht nicht durch Lock-in, sondern durch
Breite der Nutzung.

Das ist dieselbe Kategorie wie Git, Markdown oder JSON: langweilig genug, um
überall zu funktionieren.

---

## OKF ersetzt nicht CLAUDE.md, AGENTS.md oder MCP

Hier entsteht leicht Verwirrung. OKF ist nicht das neue Universalformat für
alles, was ein Agent wissen oder tun soll.

Die sauberste Unterscheidung ist:

| Werkzeug | Frage |
| --- | --- |
| `CLAUDE.md` / `AGENTS.md` | Wie soll sich der Agent in diesem Projekt verhalten? |
| OKF | Was wissen wir über dieses System? |
| MCP | Welche Live-Tools kann der Agent jetzt aufrufen? |

Diese Ebenen konkurrieren nicht. Sie stapeln sich.

Eine `AGENTS.md` kann zum Beispiel sagen:

> Vor Änderungen an Analytics-Code zuerst `.okf/metrics/` lesen.

Die OKF-Dateien enthalten dann das eigentliche fachliche Wissen: Metriken,
Join-Pfade, Warnungen, Datenquellen, historische Entscheidungen.

MCP liefert ergänzend Live-Zugriff: Query ausführen, Ticket lesen, Build
starten, Deployment prüfen.

So entsteht eine klarere Arbeitsteilung:

```text
AGENTS.md / CLAUDE.md
  -> Verhaltensregeln

.okf/
  -> kuratiertes Teamwissen

MCP
  -> Live-Werkzeuge und aktuelle Daten

Skills / Workflows
  -> wiederholbare Arbeitsabläufe
```

Jede Ebene beantwortet eine andere Frage.

---

## Die Verbindung zu Karpathys LLM-Wiki

Andrej Karpathy hat in seiner LLM-Wiki-Idee einen wichtigen Punkt formuliert:
Menschen pflegen Wikis ungern. Agenten können das besser, weil sie nicht
gelangweilt werden, keine Querverweise vergessen und in einem Durchlauf viele
Dateien aktualisieren können.

Dieses Muster taucht inzwischen überall auf:

- Obsidian-Vaults mit Agentenpflege
- `AGENTS.md`-Konventionen
- projektweite `index.md`-Hierarchien
- automatisch aktualisierte Memory-Dateien
- changelogartige `log.md`-Artefakte

OKF macht daraus keine neue Produktkategorie. Es standardisiert die
Dateiform.

Der Unterschied ist klein, aber wichtig:

> Ein Wiki ist nützlich. Ein portables Wiki kann Infrastruktur werden.

Wenn dein Team sein Wissen als OKF-Bundle pflegt, kann dasselbe Wissen in
mehreren Agenten, Editoren, Suchsystemen und Visualisierungen auftauchen,
ohne jedes Mal neu übersetzt zu werden.

---

## Was Google mitgeliefert hat

Google hat nicht nur eine Spezifikation veröffentlicht, sondern auch konkrete
Bausteine gezeigt.

### BigQuery-Enrichment

Ein Agent kann ein BigQuery-Dataset durchlaufen und daraus OKF-Dokumente für
Tabellen und Views erzeugen.

In einem zweiten Schritt werden die Dokumente angereichert: mit Zitaten,
Schemas, Join-Pfaden und Hinweisen aus vorhandener Dokumentation.

Das ist ein guter Startpunkt für Data-Teams. Statt Metrik- und Tabellenwissen
nur in Catalogs oder Köpfen zu halten, landet es als versionierbares
Markdown-Bundle im Repository.

### Statischer Visualizer

Ein HTML-Visualizer kann ein OKF-Bundle als interaktiven Graphen darstellen:

- Konzepte werden Knoten
- Markdown-Links werden Kanten
- ein Klick öffnet das Konzeptdokument
- Backlinks zeigen, welche Konzepte auf ein Dokument verweisen

Das ist bewusst leichtgewichtig. Kein Backend, kein Upload, keine zentrale
Infrastruktur.

### Beispiel-Bundles

Die Beispiel-Bundles zeigen öffentliche BigQuery-Datasets, etwa GA4
E-Commerce, Stack Overflow und Bitcoin.

Sie sind gleichzeitig Demo, Vorlage und Testfall: Funktioniert das Format
nur für einen engen Spezialfall, oder trägt es über verschiedene Domänen?

Genau diese Frage ist bei einem Format entscheidend.

---

## Wann OKF sinnvoll ist

OKF lohnt sich, wenn dein Wissen regelmäßig wiederverwendet werden muss.

Ein paar klare Signale:

- Du erklärst neuen Agenten-Sessions immer wieder dieselben Dinge.
- Wissen verteilt sich über mehrere Repos, Teams oder Tools.
- Architektur- und Fachentscheidungen sollen in Pull Requests reviewbar sein.
- Daten-, Service- oder Metrikwissen muss für Agenten auffindbar werden.
- Du willst eine Wissensstruktur, die nicht an einen bestimmten Anbieter hängt.

Besonders stark ist OKF dort, wo Wissen bereits modular ist:

- Services
- Datenbanken
- Metriken
- Runbooks
- Architekturentscheidungen
- Fachbegriffe
- Integrationen

Für sehr kleine Projekte ist OKF wahrscheinlich zu viel. Wenn ein einzelnes
`AGENTS.md` reicht und das Projekt selten von Agenten bearbeitet wird, brauchst
du kein eigenes Wissensbundle.

OKF ist auch nicht die richtige Antwort auf Echtzeitdaten. Wenn ein Agent den
aktuellen Build-Status, ein Ticket oder eine Datenbankabfrage braucht, ist MCP
oder ein anderes Tooling zuständig. OKF beschreibt, was diese Dinge bedeuten.
Es ersetzt nicht den Live-Zugriff.

---

## Ein einfacher Einstieg

Du musst nicht mit einem kompletten Wissensgraphen anfangen.

Ein realistischer Start sieht so aus:

```text
.okf/
  index.md
  log.md
  decisions/
    index.md
    why-we-use-postgres.md
  services/
    index.md
    billing-api.md
```

In `index.md` steht nur, welche Bereiche existieren und wann ein Agent sie
lesen sollte.

Eine Decision-Datei könnte so aussehen:

```markdown
---
type: Decision
title: "Warum wir Postgres statt MySQL nutzen"
description: "JSONB und Row-Level Security waren ausschlaggebend."
timestamp: 2026-03-01T00:00:00Z
tags: [infrastructure, database]
---

## Kontext

Im ersten Quartal 2026 haben wir Postgres und MySQL für die neue
Metadatenplattform verglichen.

## Entscheidung

Wir nutzen Postgres 16. JSONB, Row-Level Security und vorhandene
Betriebserfahrung waren entscheidend.

## Folgen

Neue Metadaten-Services sollen ihre Primärdaten in Postgres modellieren.
Schema-Details stehen in [primary-db](../datasets/primary-db.md).
```

Das ist sofort nützlich:

- reviewbar im Pull Request
- lesbar für Menschen
- auffindbar für Agenten
- verlinkbar aus anderen Konzepten
- versionierbar in Git

Wichtig ist nicht, dass die Struktur perfekt ist. Wichtig ist, dass relevantes
Wissen aus Chatverläufen und Köpfen in ein haltbares Format wandert.

---

## Was noch offen ist

OKF v0.1 ist bewusst ein Startpunkt. Einige schwierige Fragen bleiben offen.

### Widersprüche

Was passiert, wenn zwei OKF-Dateien unterschiedliche Aussagen über dieselbe
Metrik machen?

Das Format beschreibt noch keine Merge- oder Konfliktsemantik. Teams brauchen
Prozesse, Reviews und gegebenenfalls zusätzliche Konventionen.

### Veraltetes Wissen

Dateien können veralten. Wenn ein Service geändert wird, aber die OKF-Datei
nicht, bekommt der Agent falschen Kontext.

Das ist kein Formatproblem, sondern ein Pflegeproblem. Trotzdem wird es in der
Praxis entscheidend sein. Gute Agenten-Workflows müssen Wissen nach Änderungen
mitpflegen.

### Typisierte Beziehungen

Aktuell sind Beziehungen normale Markdown-Links. Das ist einfach und robust,
aber semantisch begrenzt.

Ein Link kann vieles bedeuten:

- hängt ab von
- ersetzt
- widerspricht
- erklärt
- erweitert
- nutzt

Solche reicheren Beziehungstypen könnten in späteren Konventionen oder
Versionen entstehen.

### Suche und Facetten

Tags reichen für viele Fälle. Größere Organisationen werden aber feinere
Filter brauchen: Domänen, Ownership, Kritikalität, Lifecycle, Datenklasse,
Compliance-Status.

Auch hier ist offen, wie viel davon ins Kernformat gehört und wie viel besser
als Organisationskonvention lebt.

---

## Warum das größer ist, als es aussieht

Die Formate, die dauerhaft wichtig werden, wirken am Anfang oft langweilig.

JSON hat nicht gewonnen, weil es besonders elegant war. Markdown hat nicht
gewonnen, weil es alles konnte. Beide haben gewonnen, weil sie einfach genug
waren, um überall aufzutauchen.

OKF hat ein ähnliches Profil:

- Es ist einfach zu lesen.
- Es ist einfach zu schreiben.
- Es funktioniert mit Git.
- Es passt zu Pull Requests.
- Es ist für Menschen und Agenten verständlich.
- Es braucht keine zentrale Plattform.

Der stärkste Hinweis ist aber ein anderer: OKF formalisiert ein Muster, das
ohnehin schon entsteht.

Teams bauen bereits Agenten-Wikis. Sie schreiben bereits `index.md`-Dateien.
Sie pflegen bereits Memory-Artefakte. Sie merken bereits, dass `CLAUDE.md`
und `AGENTS.md` zu grob werden, wenn fachliches Wissen wächst.

OKF gibt diesem Muster eine gemeinsame Form.

Karpathys Gedanke war: Agenten können bessere Wiki-Pfleger sein als Menschen.
OKFs Ergänzung ist: Dieses Wiki muss portabel sein, sonst bleibt es ein
lokaler Trick.

Zusammen ergibt das eine ziemlich praktische Zukunftsvision:

> Teamwissen liegt als versionierter Markdown-Graph neben dem Code. Agenten
> laden nur die relevanten Teile, aktualisieren Wissen nach Änderungen und
> nutzen dieselbe Struktur über Tools hinweg.

Das ist keine Science-Fiction. Das ist ein Ordner mit Markdown-Dateien.

Und genau deshalb könnte es funktionieren.

---

*Basierend auf der OKF-v0.1-Spezifikation von Google Cloud vom 12. Juni 2026,
der okf-skills-Implementierung von Marco Boffo und Andrej Karpathys
LLM-Wiki-Idee.*
