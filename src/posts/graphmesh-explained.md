---
layout: post.njk
title: "Was passiert eigentlich, wenn eine KI deinen Text liest? Ein Blick in GraphMesh."
description: "Fünf Sätze über arktische Forschung — und 98 Verbindungen, die daraus entstehen."
date: 2026-05-21
author: arek
tags:
  - Knowledge Graph
  - AI
  - RAG
  - NLP
  - Search
---

*Fünf Sätze über arktische Forschung — und 98 Verbindungen, die daraus
entstehen. Ein Blick hinter die Kulissen einer Knowledge-Graph-Plattform.*

---

Stell dir vor, du gibst einer KI fünf Sätze. Nicht mehr.

```
Dr. Elena Vasquez leads the Arctic climate research team at the Oslo Institute.
Permafrost is ground that remains frozen for at least two consecutive years.
A methane release zone refers to an area where trapped methane escapes from thawing soil.
The team uses satellite imagery from NASA to monitor the Svalbard archipelago.
GraphMesh is a knowledge graph platform that turns field reports into a searchable graph.
```
Ein knapper Glossartext. Eine Person, ein paar Begriffe, ein bisschen Geographie.
Du klickst auf "Hochladen" — und ein paar Minuten später ist daraus ein
**Wissensgraph mit 98 Verbindungen, 6 Definitionen, 5 Themen** geworden, den du
in natürlicher Sprache befragen kannst.

Wie kommt das zustande? Und was sagen diese Zahlen überhaupt aus?

Genau darum geht es in diesem Artikel. Wir schauen uns an, was ein modernes
Retrieval-System wie **GraphMesh** mit deinem Text macht — ohne in den Code
abzutauchen. Am Ende verstehst du jede Zahl auf dem Dashboard und weißt,
welche davon zu sorgen geben sollte, wenn sie auf Null kippt.

---

## Zwei Welten unter einer Oberfläche

Bevor wir die Zahlen interpretieren, müssen wir kurz darüber reden, **was
eigentlich gebaut wird**, wenn ein Text durch das System läuft.

GraphMesh baut zwei völlig unterschiedliche Strukturen auf — und die Magie
entsteht, wenn beide zusammenarbeiten.

### Welt 1: Der Wissensgraph

Stell dir eine riesige Mind-Map vor. Jeder Begriff ist ein Knoten:
*Vasquez*, *Permafrost*, *NASA*, *Svalbard*. Zwischen den Knoten verlaufen
Linien, die Beziehungen beschreiben: *Vasquez **leitet** Team*, *Team
**nutzt** NASA-Satelliten*, *Permafrost **liegt in** Svalbard*.

Jede dieser Linien wird im Fachjargon **Triple** genannt — drei Bestandteile:

> **Wer (Subject) — Was tut/ist (Predicate) — Wem/Was (Object)**

Triples sind die Atome des Wissensgraphen. Jeder Klick im Frontend, jede
"Wer-was-warum"-Frage, jede graphische Darstellung — alles hängt an diesen
Atomen.

### Welt 2: Die semantische Suche

Parallel zum Graphen wird der Text in Stücke geschnitten ("Chunks") und
jedes Stück bekommt einen **Bedeutungs-Fingerabdruck** (auf Englisch:
*Embedding*). Das ist ein Vektor aus Hunderten Zahlen, der die "Bedeutung"
des Textes komprimiert beschreibt.

Wenn du später eine Frage stellst, wird die Frage genauso codiert und mit
den gespeicherten Fingerabdrücken verglichen. So findet das System auch
dann passende Stellen, wenn du andere Worte verwendest als der Originaltext
("polare Eisschmelze" findet auch "Arctic ice melting").

### Warum beides?

Der Graph antwortet auf **strukturierte Fragen**: "Wer leitet was?", "Was
hat X mit Y zu tun?", "Welche Begriffe hängen zusammen?"

Die Vektorsuche antwortet auf **inhaltliche Fragen**: "Gibt es irgendwo
etwas zu Methan-Ausgasung?", "Finde Stellen ähnlich zu diesem Absatz."

Allein ist jedes der beiden begrenzt. Zusammen sind sie mächtig — das
nennt man **GraphRAG** (Graph-augmented Retrieval): die Suche springt
zwischen "Bedeutungs-Ähnlichkeit" und "expliziten Beziehungen" hin und
her und sammelt so den richtigen Kontext für eine LLM-Antwort.

Das ist der Hintergrund. Jetzt zu den Zahlen.

---

## Das Dashboard, Zahl für Zahl

Nach dem Test zeigt das System sieben Werte an:

```
Triples gesamt:            98
Topic-Triples:             5
Definition-Triples:        6
Vector-Treffer:            1
Entitäten gefunden:       6/7
Definitionen gefunden:     2/3
Graph-RAG Edges:           51
```

Auf den ersten Blick: nichtssagend. Auf den zweiten: ein vollständiges
Röntgenbild der KI-Verarbeitung. Lass uns jeden Wert auspacken.

---

### Triples gesamt: 98 — *Wie dicht ist das Wissensnetz?*

Das ist die einfachste Zahl: alle Verbindungen im Graphen, summiert.

Aus fünf Sätzen sind 98 Verbindungen entstanden — wie?

Hinter den Kulissen arbeiten **mehrere KI-Agenten gleichzeitig** an deinem
Text. Einer sucht Personen und ihre Beziehungen, einer erkennt Themen,
einer findet Definitionen, einer hängt Etiketten an, und einer notiert
**Herkunftsangaben** ("Diesen Eintrag hat das KI-Modell GPT-4o am
15. April 2026 produziert"). Jeder dieser Agenten schreibt seine
Erkenntnisse als Triples in den Graphen.

**Was die Zahl dir sagt:**

- **50–150** für einen 5-Satz-Text: gesund, dichtes Netz
- **Unter 10:** verdächtig — wahrscheinlich ist einer der KI-Agenten
  ausgefallen oder hat keine sinnvolle Antwort produziert
- **Mehrere Hundert:** der Text war komplexer als gedacht oder das
  LLM hat Halluzinationen produziert

Warum es für die Suche zählt? Wenn du fragst *"Wer leitet das Team?"*,
wandert die Suche von Knoten zu Knoten entlang der Linien. Sind kaum
Linien da, gibt es nichts, dem die Suche folgen kann. Mehr Triples =
dichteres Netz = bessere Antworten.

---

### Topic-Triples: 5 — *Wie wird das Dokument einsortiert?*

Diese Zahl beschreibt, wie viele **Themen-Etiketten** der Text bekommen
hat — vergleichbar mit Schlagworten in einer Bibliothek.

Der **TopicExtractor** (so heißt der KI-Agent) liest den Text und
vergibt Tags wie *"Klimaforschung"*, *"Polarregion"*, *"Satellitendaten"*.
Pro Thema werden zwei Einträge gespeichert: das Thema selbst und ein
Konfidenzwert (wie sicher die KI ist).

Fünf Triples bedeuten also etwa **2–3 erkannte Themen** im Text.

**Warum das im Alltag wichtig ist:**

- **Themenfilter:** "Zeig mir alles zu Klimaforschung."
- **Cluster-Ansichten:** "Welche Themen tauchen in dieser Sammlung auf?"
- **Ranking:** Bei mehreren Treffern bevorzugt die Suche thematisch passende

Ohne Topic-Triples geht das Dokument in jeder thematischen Suche unter.
Es ist da — aber niemand findet es.

---

### Definition-Triples: 6 — *Was hat die KI als wichtig erklärt?*

Hier wird es interessant. Ein eigener KI-Agent — der **DefinitionExtractor**
— sucht gezielt nach **erklärenden Sätzen**: *"Permafrost ist Boden,
der dauerhaft gefroren bleibt."*

Wenn er solche Sätze findet, speichert er sie im Graphen mit einem
Standard-Prädikat (`rdfs:comment`) am jeweiligen Begriff — wie ein
Glossareintrag.

In unserem Beispieltext stehen drei klare Definitionen drin (Permafrost,
methane release zone, GraphMesh). Sechs Triples bedeuten also: einige
Definitionen erzeugen mehrere Einträge (Synonyme, Etiketten).

**Warum dieser Wert Gold wert ist:**

- **Antwortqualität:** Wenn jemand fragt *"Was ist Permafrost?"*, kann
  das System die Definition direkt liefern — keine vagen Textfragmente
- **Tooltips:** Im Frontend kann ein Hover über den Begriff die Erklärung
  einblenden
- **Disambiguierung:** Bei mehrdeutigen Begriffen (*"Java"* = Insel oder
  Programmiersprache?) hilft die Definition beim Auseinanderhalten

Bei rein narrativen Texten ohne *"X ist Y"*-Sätze ist 0 normal und kein
Bug — die KI ist konservativ und erfindet keine Definitionen.

---

### Vector-Treffer: 1 — *Findet die Suche das Dokument überhaupt?*

Der Test stellt eine Beispielanfrage (*"satellite methane polar"*) an die
Vektorsuche und schaut, wieviele Chunks zurückkommen.

In unserem Fall wurde der Text in **genau einen Chunk** geschnitten
(5 Sätze passen in eines), also ist 1 das Maximum. Bei längeren
Dokumenten wären hier 3, 5, oder mehr Treffer denkbar.

**Wenn diese Zahl 0 wäre:**

- Der Embedding-Agent hat noch nicht geschrieben (zu langsam, überlastet)
- die Vektor-Datenbank-Konfiguration passt nicht zum Embedding-Modell, oder
- der Ähnlichkeits-Schwellenwert ist zu streng eingestellt

Eine Null hier bedeutet: **die semantische Suche für dieses Dokument
ist tot**. Synonym-Suche, "finde ähnliches", Volltext-Fallback — alles
nicht verfügbar.

---

### Entitäten gefunden: 6/7 — *Wie gut hat die KI die wichtigen Begriffe getroffen?*

Hier wird stichprobenartig geprüft, ob die KI die wichtigen Begriffe
überhaupt erkannt hat.

Wir haben uns sieben Begriffe überlegt, die im Text auftauchen
(*Vasquez, Oslo, Svalbard, NASA, GraphMesh, methane, Permafrost*) und
schauen, ob jeder davon irgendwo im Graphen zu finden ist.

**6/7 heißt:** sechs Begriffe sind im Graph, einer fehlt.

Wenn ein Begriff fehlt, hat ihn keiner der KI-Agenten als wichtig
eingestuft. Das passiert oft mit:

- kleinen oder schwachen LLM-Modellen (gerade lokal laufende Modelle
  überspringen Details)
- Begriffen, die nur beiläufig erwähnt werden
- Eigennamen, die das Modell nicht kennt (selten, aber möglich)

**Warum kritisch:** Was nicht im Graph steht, **kann die Suche nicht
finden** — auch wenn es im Originaltext steht. Eine Frage nach *"Hat NASA
mit dem Team zusammengearbeitet?"* scheitert, wenn "NASA" nie als Knoten
existiert hat.

6/7 ist gut, ein bis zwei Aussetzer sind normal. Unter 4/7 ist Alarm:
LLM-Modell oder Prompt anschauen.

---

### Definitionen gefunden: 2/3 — *Wurden die wichtigsten Begriffe wirklich erklärt?*

Ähnlich wie oben, aber strenger: Wir schauen, ob die drei Begriffe
*Permafrost, methane, GraphMesh* nicht nur als Knoten existieren, sondern
auch eine **Definition** im Graphen haben.

**2/3 heißt:** zwei dieser drei haben eine Erklärung, einer wurde nur
als gewöhnliche Entität behandelt.

Das ist der Unterschied, der den Nutzererlebnis-Test ausmacht: Eine
*erkannte* Entität ist gut. Eine *erklärte* Entität ist Gold:

- Bei *"Was ist X?"*-Fragen bekommt der Nutzer eine echte Antwort
- Im Frontend kann ein Hover-Tooltip die Bedeutung zeigen
- Bei mehrdeutigen Begriffen hilft die Definition beim Auseinanderhalten

Bei 0/3 hat der Definition-Agent ein echtes Problem: das Modell ist
möglicherweise zu schwach, der Prompt liefert ungültiges Format, oder
der Service hängt im Kafka-Lag fest.

---

### Graph-RAG Edges: 51 — *Wieviel Kontext bekommt die Antwort-KI?*

Der spannendste Wert kommt zum Schluss.

Der Test stellt eine echte Frage an das System: *"Who leads the Arctic
climate research team?"* Das System geht so vor:

1. **Findet Anker:** Welche Knoten im Graph passen zur Frage? (z. B.
   *Vasquez*, *Arctic team*)
2. **Sammelt Nachbarschaft:** Welche Linien gehen von diesen Knoten ab?
   Und von deren Nachbarn? (sog. *Hops*)
3. **Reicht weiter:** Alle gesammelten Linien werden als Kontext an das
   Antwort-LLM übergeben

**51 Linien** heißt: der Retriever hat den Vasquez-Subgraphen plus das
unmittelbare Umfeld plus Provenance-Daten gezogen.

Diese Zahl ist ein direkter Indikator für die **Antwortqualität**:

| Edges  | Konsequenz                                                       |
|--------|------------------------------------------------------------------|
| 0–3    | KI bekommt kaum Kontext — Antworten werden vage oder *"weiß nicht"*. |
| 5–80   | Sweet-Spot — fokussierte, korrekte Antworten.                     |
| > 200  | KI bekommt Rauschen — Antworten schweifen ab oder verwechseln Dinge. |

51 für fünf Sätze ist gesund. Wenn dieser Wert auf Null sinkt, trifft
deine Frage keinen Anker im Graph: entweder die Frage ist zu vage, oder
der Graph ist zu dünn aufgebaut.

---

## Was sagen die Zahlen *zusammen*?

Einzeln sind die Werte interessant. **Zusammen** erzählen sie eine
Geschichte über die Qualität der gesamten Pipeline:

| Erlebnis im Frontend                          | Welche Zahl muss stimmen?              |
|-----------------------------------------------|----------------------------------------|
| *"Wer leitet das Team?"*                      | Triples + Graph-RAG Edges              |
| *"Was bedeutet Permafrost?"*                  | Definition-Triples                     |
| *"Zeig alles zu Klimaforschung."*             | Topic-Triples                          |
| *"Such was zu Methan in der Arktis."*         | Vector-Treffer                         |
| Auf einen Knoten im Graph klicken             | Triples gesamt (Nachbarschaft)         |
| Hover über Begriff zeigt Erklärung          | Definition-Triples                     |
| Filtern nach Themen-Sidebar                   | Topic-Triples                          |

Jeder Wert ist ein Baustein einer Funktion, die der Nutzer sieht.
Sinkt einer auf Null, fällt die zugehörige Funktion aus — selbst
wenn der Rest perfekt aussieht.

Deshalb ist der Mini-Test so wertvoll: er prüft nicht, ob *irgendwas*
funktioniert, sondern ob **alle Bausteine** der Suche da sind.

---

## Was du daraus für eigene Projekte mitnehmen kannst

Auch wenn du kein GraphMesh baust: das Prinzip gilt für **jedes**
moderne Retrieval-System mit LLMs.

1. **Eine einzelne Metrik lügt.** "Mein RAG-System hat hohe Recall-Werte"
   sagt nichts über Antwortqualität aus. Schau dir mehrere Werte
   gleichzeitig an — Dichte, Themenabdeckung, Definitionsabdeckung,
   Vektor-Treffer, Retrieval-Kontext

2. **Erwartungen vorher festlegen.** Bevor du den ersten Test laufen
   lässt: Welche Begriffe **müssen** im Graphen sein? Welche Definitionen?
   Wenn du das nicht vorher weißt, kannst du Erfolg nicht messen

3. **Mini-Tests schlagen Mega-Tests.** Ein 5-Satz-Dokument, das du in
   30 Sekunden lesen kannst, ist diagnostischer als ein 50-Seiten-PDF
   Du siehst sofort, ob die Pipeline grundlegend funktioniert

4. **Frag, was der Endnutzer merkt.** Jede Metrik sollte eine konkrete
   Funktion im Frontend stützen. Wenn du eine Zahl nicht in eine
   Nutzeraktion übersetzen kannst, brauchst du sie wahrscheinlich nicht

5. **Halluzinationen sind das Gegengift zum Idealismus.** Mehr Triples
   ist nicht automatisch besser. Wenn dein LLM aus 5 Sätzen 500 Triples
   erfindet, hast du ein anderes Problem

---

## Schluss: Aus Text wird Struktur — und aus Struktur wird Antwort

Was vor der KI-Ära Wochen Glossararbeit gewesen wäre — Begriffe
identifizieren, Beziehungen kartieren, Definitionen ablegen, Themen
zuordnen — passiert hier in einer Pipeline, **automatisch**, in wenigen
Minuten.

Aber Automation ohne Messung ist Aberglaube. Die Zahlen, die wir uns
angeschaut haben, sind die Linse, durch die du erkennst, ob die KI
wirklich verstanden hat, was du ihr gegeben hast — oder ob sie nur
Rauschen produziert.

Das nächste Mal, wenn du irgendwo *"powered by AI"* liest und die
Antwort komisch wirkt, denk an diese sieben Werte. Irgendeiner davon
steht wahrscheinlich auf Null.

---

*Wenn dir der Artikel gefallen hat, lass ein Klatschen da. Fragen oder
Erfahrungen mit eigenen RAG-/Graph-Pipelines? Schreib es in die
Kommentare.*
