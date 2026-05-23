---
layout: post.njk
title: "Von RDF zu GraphQL in Null Sekunden: Wie GraphMesh aus einer Ontologie eine typisierte API baut."
description: "Zwei Welten, die sich noch nie vertragen haben — und eine Pipeline, die sie versöhnt."
date: 2026-05-22
author: arek
tags:
  - Knowledge Graph
  - GraphQL
  - RDF
  - Ontology
  - API
---

*Zwei Welten, ein Vertrag und eine Pipeline.
Ein Blick hinter die Kulissen von GraphMeshs dynamischer GraphQL-API.*

---

Stell dir vor, du hast eine CMDB. Zehntausende Einträge über Anwendungen,
Server, Teams, Abhängigkeiten. Die Daten liegen schon strukturiert vor — als
RDF-Tripel, sauber nach einer Ontologie modelliert. Klassen, Beziehungen,
Datentypen, alles da.

Und dann kommt die Frage aus dem Nachbar-Team:

> *"Kannst du mir einfach alle hochkritischen Anwendungen mit ihren Servern und
> verantwortlichen Teams geben? Wir brauchen das im Dashboard."*

Was antwortest du?

- *"Klar, ich schreib dir eine SPARQL-Query."* — Keiner im Nachbar-Team kennt
  SPARQL.
- *"Ich bau euch ein REST-Endpoint."* — Drei Tage Arbeit. Pro Abfragevariante
  ein neuer Endpoint. Dashboard-Team wechselt Anforderungen wöchentlich.
- *"Hier ist der Graph-Dump als JSON, viel Spaß."* — Viel Spaß beim Parsen
  von 400.000 Tripeln im Browser.

Oder, wenn du **GraphMesh** benutzt:

> *"Klick hier. Das Schema ist schon fertig."*

Und dann zeigst du auf `/graphql/it-landschaft` — einen GraphQL-Endpoint, den
niemand geschrieben hat, den es aber gibt. Mit Typen, Filtern, Paginierung,
Introspection, vollständig dokumentiert. Einfach so.

Wie funktioniert das?

Genau darum geht es in diesem Artikel. Wir schauen uns an, wie aus einer
Ontologie und ein paar RDF-Dateien **automatisch** eine typisierte GraphQL-API
entsteht — und warum das mehr ist als ein Bequemlichkeits-Trick.

---

## Zwei Welten, die nie richtig zusammenpassen wollten

Bevor wir in die Pipeline reinschauen, müssen wir kurz darüber reden, **warum
das überhaupt ein Problem ist**.

RDF und GraphQL sind beides "typisierte Daten". Aber sie denken sehr
unterschiedlich.

### Die RDF-Welt: Triples, Flexibilität, Semantik

RDF speichert alles als **Tripel**:

```
<https://example.org/anwendung/sap-erp>  rdf:type         ex:Anwendung .
<https://example.org/anwendung/sap-erp>  ex:kritikalitaet "hoch" .
<https://example.org/anwendung/sap-erp>  ex:laeuftAuf     <https://example.org/server/srv-042> .
```

Wer-was-wem. Drei Teile. Fertig.

Das ist unglaublich flexibel: jedes Datum, jede Beziehung, jeder Fakt folgt
derselben Struktur. Du kannst Ontologien mischen, Schemata erweitern, Daten
aus drei Quellen zusammenführen — alles im selben Graphen.

Aber: für eine App, die *"zeig mir die drei wichtigsten Anwendungen"* braucht,
ist RDF direkt **unangenehm**. Du brauchst SPARQL, du musst die Struktur
selbst kennen, du bekommst Rohtripel statt Objekte.

### Die GraphQL-Welt: Typen, Objekte, Entwicklerfreude

GraphQL denkt in **Objekten mit Feldern**:

```graphql
type Anwendung {
  id: ID!
  name: String
  kritikalitaet: String
  laeuftAuf: [Server]
}
```

Tools wie Apollo, GraphQL Playground, oder Insomnia verstehen das Schema
automatisch. Entwickler schreiben in ihrer IDE Queries mit Autovervollständigung.
Frontend-Code ist typisiert. Dashboards bauen sich fast von selbst.

Aber: GraphQL-Schemata schreibt jemand **von Hand**. Und pflegt sie von Hand.
Und updated sie, wenn sich das Datenmodell ändert. Und schreibt Resolver.

### Das klassische Dilemma

Du hast also zwei Optionen:

- **RDF pur:** Maximale Flexibilität, aber jede App-Anfrage ist eine kleine
  Forschungsarbeit.
- **REST/GraphQL drüber:** Entwicklerfreundlich, aber ein riesiger Übersetzer
  sitzt zwischen Graph und API — und veraltet jedes Mal, wenn sich die
  Ontologie ändert.

Der Clou: **Die Ontologie ist schon ein Schema.** Klassen, Eigenschaften,
Datentypen, Domain, Range — alles steht drin. Warum nicht direkt eine
GraphQL-API daraus erzeugen?

Genau das tut GraphMesh.

---

## Die Kern-Idee: Ontologie = Schema

Eine OWL-Ontologie (Web Ontology Language) hat drei Bausteine, die sich
wunderbar auf GraphQL abbilden lassen:

| OWL/RDF            | GraphQL                      | Beispiel                        |
|--------------------|------------------------------|---------------------------------|
| `OntologyClass`    | `type` (Objekt-Typ)          | `type Anwendung { ... }`        |
| `DatatypeProperty` | Feld mit Skalar-Typ          | `name: String`                  |
| `ObjectProperty`   | Feld mit Objekt-Typ (Liste)  | `laeuftAuf: [Server]`           |
| Domain/Range       | Feld-Typ-Annotation          | `domain: Anwendung, range: Server` |
| `xsd:string`       | `String`                     | `"SAP ERP"`                     |
| `xsd:dateTime`     | `DateTime` (Custom Scalar)   | `"2026-04-24T10:30:00Z"`        |

Das ist keine Analogie. Das ist eine **1:1-Abbildung**. Eine Ontologie *ist*
im Kern schon ein Schema — sie nutzt nur eine andere Syntax.

GraphMesh nimmt diese Abbildung und macht sie real. Bei jedem RDF-Import
wird das Schema neu generiert, unter `/graphql/{sammlungsname}` gehostet
und ist sofort nutzbar.

Schauen wir uns das an einem konkreten Beispiel an.

---

## Vom Turtle zum Schema: Ein konkreter Durchlauf

### Schritt 1: Die Ontologie

Wir starten mit einer minimalen IT-Architektur-Ontologie, definiert in
Turtle:

```turtle
@prefix ex:   <https://example.org/ontology#> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl:  <http://www.w3.org/2002/07/owl#> .
@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .

ex:Anwendung      a owl:Class .
ex:Server         a owl:Class .
ex:Team           a owl:Class .

ex:name           a owl:DatatypeProperty ;
                  rdfs:range xsd:string .

ex:kritikalitaet  a owl:DatatypeProperty ;
                  rdfs:domain ex:Anwendung ;
                  rdfs:range xsd:string .

ex:laeuftAuf      a owl:ObjectProperty ;
                  rdfs:domain ex:Anwendung ;
                  rdfs:range ex:Server .

ex:verantwortetDurch a owl:ObjectProperty ;
                  rdfs:domain ex:Anwendung ;
                  rdfs:range ex:Team .
```

Drei Klassen. Vier Properties. Klarer Datentyp, klarer Definitions- und
Wertebereich.

### Schritt 2: Zuweisen und Importieren

In GraphMesh passiert dann Folgendes:

1. Du weist die Ontologie einer **Wissenssammlung** zu (z.B. `it-landschaft`).
2. Du importierst deine RDF-Daten (die CMDB-Exporte) in die Sammlung.
3. GraphMesh erkennt: *"Ah, diese Sammlung hat eine Ontologie, und Daten liegen
   auch schon drin — ich baue jetzt das Schema."*

### Schritt 3: Das generierte Schema

Was kommt raus?

```graphql
scalar Date
scalar DateTime
scalar Long

type Query {
  Anwendung(filter: AnwendungFilter, limit: Int = 20, offset: Int = 0): [Anwendung!]!
  AnwendungById(id: ID!): Anwendung
  Server(filter: ServerFilter, limit: Int = 20, offset: Int = 0): [Server!]!
  ServerById(id: ID!): Server
  Team(filter: TeamFilter, limit: Int = 20, offset: Int = 0): [Team!]!
  TeamById(id: ID!): Team
}

type Anwendung {
  id: ID!
  name: String
  kritikalitaet: String
  laeuftAuf(limit: Int = 10, offset: Int = 0): [Server]
  verantwortetDurch(limit: Int = 10, offset: Int = 0): [Team]
}

type Server {
  id: ID!
  name: String
}

type Team {
  id: ID!
  name: String
}

input AnwendungFilter {
  name: String
  kritikalitaet: String
}

input ServerFilter {
  name: String
}

input TeamFilter {
  name: String
}
```

**Beachte, was hier automatisch passiert:**

- Jede Klasse bekommt einen Listen-Query (`Anwendung(...)`) und einen
  Single-Query (`AnwendungById(id)`).
- Jede DatatypeProperty wird ein typisiertes Feld.
- Jede ObjectProperty wird eine navigierbare Beziehung — mit eigener
  Paginierung (`limit`, `offset`) direkt am Feld.
- Für jede Klasse entsteht ein `Filter`-Input-Typ mit allen Skalar-Feldern
  der Klasse.
- Custom-Scalars wie `Date`, `DateTime` und `Long` werden registriert, falls
  die Ontologie sie braucht.

Alles, ohne dass ein Entwickler auch nur eine Zeile GraphQL-Schema getippt
hat.

---

## Das Dashboard, Feld für Feld

Das Schema ist nur die halbe Miete. Jetzt schauen wir uns an, **was du damit
machen kannst** — und was hinter jedem dieser Features technisch passiert.

### Listenabfrage mit Paginierung

```graphql
query {
  Anwendung(limit: 5, offset: 0) {
    id
    name
    kritikalitaet
  }
}
```

Hinter den Kulissen wird das zu einer Graph-Abfrage: *"Finde alle Subjekte
vom Typ `ex:Anwendung`, hol die ersten 5."* Die `limit`/`offset`-Parameter
werden direkt in die Cassandra-Query eingebaut, nicht im Speicher gefiltert.

**Warum das im Alltag zählt:** Dashboards fragen selten alle 50.000
Anwendungen ab. Mit echter Datenbank-Paginierung bleibt die Antwortzeit
konstant, egal wie groß der Graph wird.

### Punktabfrage per ID

```graphql
query {
  AnwendungById(id: "https://example.org/anwendung/sap-erp") {
    name
    kritikalitaet
    laeuftAuf {
      name
    }
  }
}
```

Eine URI rein, eine strukturierte Antwort raus. Die ID ist der volle URI —
genau so, wie der Knoten im Graph heißt. Keine Zwischen-Mapping-Tabelle,
kein *"wie heißt die App mit der internen ID 42?"*.

### Filter auf Eigenschaften

```graphql
query {
  Anwendung(filter: { kritikalitaet: "hoch" }) {
    name
    laeuftAuf {
      name
    }
  }
}
```

Jedes Skalar-Feld kann als Filter benutzt werden. Mehrere Filter werden
UND-verknüpft. Der Filter wird serverseitig ausgewertet — also nicht *"alles
laden und dann filtern"*, sondern *"nur das richtige laden"*.

### Graph-Traversal mit verschachtelter Paginierung

Hier wird es spannend:

```graphql
query {
  Anwendung(filter: { kritikalitaet: "hoch" }, limit: 10) {
    name
    laeuftAuf(limit: 3) {
      name
    }
    verantwortetDurch(limit: 1) {
      name
    }
  }
}
```

**Was das tut:** Hol die 10 wichtigsten Anwendungen. Für jede davon: zeig
maximal 3 Server, auf denen sie läuft, und maximal 1 verantwortliches Team.

Hinter den Kulissen wird das als Graph-Walk ausgeführt — von Anwendungs-Knoten
zu Server-Knoten zu Team-Knoten, alles in einem Schwung. Dank
**DataLoader-Batching** werden nicht 10 einzelne "finde Server zu dieser
Anwendung"-Abfragen ausgeführt, sondern eine einzige "finde Server zu
diesen 10 Anwendungen"-Abfrage. Das ist der Unterschied zwischen "OK" und
"N+1-Apokalypse".

### Introspection

```graphql
{
  __schema {
    types {
      name
      fields {
        name
        type { name }
      }
    }
  }
}
```

Standard-GraphQL-Introspection funktioniert. Heißt: Apollo Studio, GraphQL
Playground, Insomnia, Postman — alle erkennen dein Schema automatisch, zeigen
Autovervollständigung und generieren Beispiele.

---

## Was heißt "automatisch"? Ein Blick auf die Mechanik

Fünf technische Entscheidungen machen das Ganze erst möglich:

### 1. Das Schema ist **nicht statisch**

Bei jedem RDF-Import wird das Schema neu gebaut. Kommt eine neue Klasse in
der Ontologie dazu, erscheint sie sofort im Endpoint. Wird eine Property
entfernt, ist sie weg.

Das ist ein harter Unterschied zu klassischen GraphQL-APIs, wo Schema-Änderungen
**Code-Deployments** bedeuten. Hier ist das Schema **Daten**.

### 2. Das Schema wird pro Sammlung gebaut, nicht global

Du hast drei Sammlungen mit drei verschiedenen Ontologien? Du bekommst drei
GraphQL-Endpoints:

- `/graphql/it-landschaft`
- `/graphql/produkt-katalog`
- `/graphql/mitarbeiter-verzeichnis`

Jede mit ihrem eigenen, passgenauen Schema. Kein *"ein Mega-Schema für
alles"*, kein Typ-Konflikte-Chaos, keine generischen `entity`-Typen mit
`properties: JSON`.

### 3. XSD wird ernsthaft gemappt

Die Ontologie sagt `xsd:dateTime`? Dann kommt im GraphQL-Schema `DateTime`
(ein echter Custom Scalar, der ISO-8601-Strings versteht). Nicht `String`.
Nicht `Int-Timestamp`. Ein richtiger Typ.

Das gleiche für `xsd:date`, `xsd:long`, `xsd:boolean`, `xsd:float`,
`xsd:anyURI`. Unbekanntes fällt auf `String` zurück, damit nichts kaputt
geht.

**Warum das zählt:** Typisierte Clients (TypeScript, Kotlin, Swift) bekommen
korrekte Datentypen, inklusive Date-Parsing. Das eliminiert eine ganze Klasse
von *"komisches Datum im Dashboard"*-Bugs.

### 4. Die ObjectProperties werden zu navigierbaren Feldern

Das ist der eigentliche GraphQL-Moment. In einer REST-API müsstest du zwei
Endpoints aufrufen — einmal die Anwendung, dann ihre Server. In SPARQL
müsstest du die Beziehung manuell in deine Query einbauen. In diesem
generierten Schema ist `laeuftAuf` einfach ein **Feld**, das du mitabfragst.

### 5. Löschen räumt auf

Wird eine Sammlung gelöscht, verschwindet auch der zugehörige
GraphQL-Endpoint. Kein *"zombie endpoint"*, keine 404 mit halbem Schema,
kein veralteter Schema-Cache. Sauber.

---

## Was geht schief, wenn was schief geht?

Jede Magie hat ihre Grenzen. Hier die häufigsten Stolpersteine:

### Keine Ontologie → kein Schema

Du importierst RDF in eine Sammlung ohne zugewiesene Ontologie? Dann gibt
es keinen dynamischen Endpoint. GraphMesh braucht die Klassen- und
Property-Definitionen, sonst weiß es nicht, welche Typen zu erzeugen sind.

**Erkennbar an:** 404 beim Aufruf von `/graphql/{sammlungsname}`.

**Lösung:** Ontologie anlegen, zuweisen, RDF neu importieren.

### Unbekannte XSD-Typen werden `String`

Wenn deine Ontologie exotische Datentypen nutzt (`xsd:duration`, eigene
Custom-Types), fällt das Mapping auf `String` zurück. Die Daten gehen nicht
verloren, aber der Client bekommt keinen spezifischen Typ.

**Lösung:** Entweder mit dem Fallback leben oder auf Standard-XSD umstellen.

### Schema-Änderungen sind Breaking Changes

Wenn du eine DatatypeProperty umbenennst, ist sie im neuen Schema weg.
Clients, die noch das alte Feld abfragen, bekommen einen GraphQL-Error.

Das ist keine GraphMesh-Eigenheit — das gilt für jede GraphQL-API. Aber weil
das Schema hier an die Ontologie gekoppelt ist, **passieren solche
Änderungen schneller** als bei handgebauten APIs.

**Lösung:** Ontologie-Änderungen genauso ernst nehmen wie
API-Versionsänderungen.

### Große Ergebnismengen

Wenn du `Anwendung(limit: 10000)` aufrufst und tatsächlich 10.000 Knoten
zurückbekommst, wird die Antwort groß. Paginierung ist kein Vorschlag —
sie ist die Überlebensstrategie der API.

---

## Was du daraus für eigene Projekte mitnehmen kannst

Auch wenn du kein GraphMesh baust: die Prinzipien sind nützlich.

1. **Das Schema ist schon da, du musst es nur sehen.** Wenn deine Daten
   irgendeine Form von Struktur haben — Ontologie, JSON-Schema, relationale
   Datenbank, Avro, Protobuf — kannst du daraus eine API generieren. Das
   manuelle Übersetzen per REST-Controller ist oft reine Fleißarbeit.

2. **Generierte APIs altern mit den Daten.** Statt *"die API ist veraltet,
   weil das Schema sich geändert hat"* hast du *"die API reflektiert, was
   gerade im Graph ist"*. Das ist ein kompletter Perspektivwechsel.

3. **Typen sind nicht egal.** `Date` statt `String` klingt wie Detail —
   bis ein Frontend-Bug zwei Zeitzonen verwechselt, weil *"ist ja nur ein
   String"*. Wenn deine Datenquelle Typen kennt, gib sie weiter.

4. **GraphQLs ObjectProperty-Feldsyntax ist Graph-freundlich.** REST mag
   flache Ressourcen. SPARQL mag Pattern-Matching. GraphQL mag **Objekte mit
   verschachtelten Objekten** — und das ist genau, was ein Wissensgraph
   natürlich ausdrückt. Wenn du Graph-Daten abfragst, ist GraphQL oft
   näher dran als REST.

5. **Ein Endpoint pro Sammlung schlägt ein Mega-Endpoint.** Die Versuchung
   ist groß, *eine GraphQL-API für alles* zu bauen. Mit namensraumspezifischen
   Endpoints pro Sammlung bleiben die Typen sauber, die Fehler lokal und
   die Clients entkoppelt.

---

## Schluss: Ontologie + Laufzeit = API

Was früher ein API-Design-Projekt war — *"welche Resources? welche Felder?
welche Beziehungen?"* — ist hier zur **Ableitung** geworden. Die Ontologie
beantwortet die Fragen schon. Die Laufzeit macht daraus eine API.

Das heißt nicht, dass Ontologie-Design trivial wird. Im Gegenteil: jetzt
zahlt sich gutes Ontologie-Design **doppelt** aus — einmal für die
semantische Korrektheit, einmal für die API-Ergonomie. Eine schlecht
benannte ObjectProperty macht sich sofort im GraphQL-Schema bemerkbar.

Aber der Multiplikatoreffekt ist enorm. Eine Ontologie, ein Import, ein
Endpoint. Die nächste Abteilung muss keinen neuen Service bauen — sie
macht GraphQL-Queries.

Und das nächste Mal, wenn dich jemand fragt, ob er einen Dump deiner CMDB
bekommen kann, sagst du:

> *"Nimm einfach den Endpoint. Hier ist das Schema."*

---

*Wenn dir der Artikel gefallen hat, lass ein Klatschen da. Wie löst ihr
den Sprung zwischen Semantic Web und moderner App-Entwicklung? Schreib es
in die Kommentare.*
