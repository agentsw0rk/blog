---
layout: post.njk
title: "Warum AI Spec Driven Development braucht"
description: "Specs sind im AI-Zeitalter kein Papierkram. Sie sind die Sprache, in der Menschen ihre Absicht so ausdrücken, dass Agenten verlässlich arbeiten können."
date: 2026-05-28T08:00:00+02:00
author: arek
tags:
  - AI Agents
  - Spec Driven Development
  - Context Engineering
  - Developer Tools
  - Softwareentwicklung
---

*Specs sind im AI-Zeitalter kein Papierkram. Sie sind die Sprache, in der
Menschen ihre Absicht so ausdrücken, dass Agenten verlässlich arbeiten können.*

---

AI kann heute erstaunlich schnell Code schreiben. Genau deshalb wird eine
Frage wichtiger:

> Woher weiß die AI eigentlich, was richtig ist?

Viele Teams beantworten diese Frage noch mit Prompts. Sie schreiben dem
Modell, was ungefähr passieren soll, hoffen auf gutes Verständnis und prüfen
danach den Code.

Das funktioniert bei kleinen Aufgaben. Es wird aber brüchig, sobald mehrere
Menschen, mehrere Systeme, Fachlogik, Randfälle und langfristige Wartung
ins Spiel kommen.

**Spec Driven Development** setzt früher an. Es fragt nicht zuerst:

> Wie bekommen wir möglichst schnell Code?

Sondern:

> Wie beschreiben wir verständlich, präzise und überprüfbar, was gebaut
> werden soll?

Das ist keine Rückkehr zu schweren Lastenheften. Es ist eher das Gegenteil:
Specs werden kleiner, lebendiger und näher an der Arbeit. Sie werden zum
gemeinsamen Arbeitsmaterial für Menschen, Teams und AI-Agenten.

Dieser Artikel übersetzt die Kerngedanken in eine einfache Frage:

> Warum werden gute Specs wichtiger, je mehr Code von AI geschrieben wird?

---

## Software beginnt nicht mit Code

Software ist nicht zuerst eine Sammlung von Dateien. Software ist ein System,
das Informationen verändert, liest und auf Veränderungen reagiert.

Ein Kunde bestellt etwas. Ein System speichert die Bestellung. Ein Lager wird
informiert. Eine Zahlung wird geprüft. Eine Nachricht geht raus. Irgendwo
wird ein Status sichtbar.

Ob das auf Papier, in einer Datenbank oder über eine Cloud-Plattform passiert,
ändert den Kern nicht. Menschen bauen Mechanismen, damit Informationen
geordnet fließen.

Und sobald ein Mechanismus gebaut werden soll, muss jemand erklären:

- welche Information wichtig ist,
- wer sie ändern darf,
- wann sie gelesen wird,
- was als Reaktion passieren soll,
- welche Regeln niemals verletzt werden dürfen.

Diese Erklärung ist die Spec.

Nicht jede Spec muss ein formales Dokument sein. Eine gute User Story, ein
Beispiel, eine Regel, ein Testfall, ein Ablaufdiagramm oder eine kurze
Entscheidungsnotiz können Specs sein. Entscheidend ist nicht die Form.
Entscheidend ist, ob die Spec eine Designentscheidung verständlich macht.

Für AI ist das zentral. Ein Agent kann Code erzeugen, aber er kennt nicht
automatisch die Absicht hinter dem System. Er sieht Dateien, Namen, Patterns
und Prompts. Was er nicht zuverlässig sieht, ist:

> Warum muss dieses Verhalten genau so sein?

Specs machen diese Absicht sichtbar.

---

## AI beschleunigt Output, nicht automatisch Wert

Ein häufiger Denkfehler lautet:

> Wenn AI schneller Code schreibt, liefern wir automatisch schneller Wert.

Das stimmt nur, wenn der Code das richtige Problem zuverlässig löst.

Spec Driven Development trennt hier sauberer:

**Output** ist, was produziert wurde: Code, Dateien, Pull Requests, Features.

**Durchsatz** ist, welcher Wert wirklich bei Nutzern ankommt.

AI erhöht Output sehr leicht. Ein Agent kann in Minuten Dinge bauen, für die
ein Mensch länger gebraucht hätte. Aber wenn die Aufgabe unklar ist, steigt
auch die Menge an falschem oder fast richtigem Code.

Fast richtiger Code ist teuer. Er sieht plausibel aus. Er kompiliert manchmal.
Er passt oberflächlich zum Prompt. Aber er verletzt eine Fachregel, vergisst
einen Randfall oder baut eine Lösung, die nicht zur Produktabsicht passt.

Gute Specs schützen davor. Sie halten drei Dinge zusammen:

1. **Wert:** Welches Problem lösen wir?
2. **Qualität:** Woran erkennen wir, dass es richtig gelöst ist?
3. **Durchsatz:** Wie schnell kommt diese richtige Lösung in Produktion?

Ohne Specs optimiert AI oft auf sichtbare Aktivität. Mit Specs kann sie auf
beabsichtigtes Verhalten optimieren.

---

## Specs sind Feedback-Maschinen

Der wichtigste Satz aus den First Principles ist einfach:

> Je früher Feedback sichtbar wird, desto günstiger ist es.

Ein Missverständnis in einer Spec kostet oft nur ein Gespräch. Dasselbe
Missverständnis in Produktion kostet Debugging, Hotfixes, Abstimmung,
Vertrauensverlust und manchmal echte Schäden.

Das gilt mit AI noch stärker.

Wenn ein Mensch eine unklare Aufgabe bekommt, fragt er vielleicht nach. Ein
Agent fragt manchmal auch. Häufiger macht er aber weiter, weil das System auf
Fortschritt optimiert ist. Er füllt Lücken mit Wahrscheinlichkeiten.

Genau dort entstehen viele AI-Fehler:

- Die Fachregel war nicht explizit.
- Der Ausnahmefall war nur im Kopf einer Person.
- Der bestehende Produktfluss wurde nicht beschrieben.
- Der Prompt nannte das Ziel, aber nicht die Grenzen.
- Die Tests prüfen Code, aber nicht die eigentliche Absicht.

Eine Spec verschiebt Feedback nach links. Sie macht Unklarheit sichtbar,
bevor Code existiert.

Ein guter Spec-Review fragt nicht:

> Ist das schön dokumentiert?

Sondern:

> Würde ein kluger Mensch oder Agent daraus dieselbe Lösung ableiten wie wir?

Wenn die Antwort nein ist, ist das kein Dokumentationsproblem. Es ist ein
Designproblem, das früh entdeckt wurde.

---

## Specs leben

Ein weiteres Missverständnis: Specs seien etwas, das man einmal schreibt und
dann abheftet.

In guten Systemen stimmt das nicht. Specs haben einen Lebenszyklus.

Sie entstehen, wenn eine Designidee kommuniziert werden muss. Sie werden
verfeinert, wenn Fragen auftauchen. Sie ändern sich, wenn Nutzer anders
reagieren als erwartet. Sie werden aufgeteilt, wenn ein Thema zu groß wird.
Und sie sterben, wenn ein Feature entfernt wird.

Das ist wichtig, weil veraltete Specs gefährlich sind. Für Menschen sind sie
irritierend. Für AI-Agenten sind sie noch gefährlicher: Sie werden zu falschem
Kontext.

Ein Agent behandelt vorhandene Specs als Signal. Wenn dieses Signal nicht mehr
zur Realität passt, wirkt der Agent trotzdem folgerichtig. Er folgt nur einer
alten Wahrheit.

Spec Debt ist deshalb eine echte Form von Schulden:

- wichtige Regeln sind nicht beschrieben,
- alte Regeln sind noch beschrieben,
- Entscheidungen stehen nur im Code,
- Tests prüfen historische Zufälle,
- AI bekommt Kontext, der nicht mehr stimmt.

Spec Driven Development bedeutet nicht, alles sofort perfekt zu spezifizieren.
Es bedeutet, die wichtigsten Bereiche bewusst zu pflegen: fachkritische
Abläufe, teure Fehlerfälle, schwer verständliche Entscheidungen und alles,
was Agenten regelmäßig ändern sollen.

---

## Spec Driven ist nicht Wasserfall

Manche hören "Spec" und denken sofort an Wasserfall:

> Erst monatelang planen, dann bauen, dann feststellen, dass es falsch war.

Das ist nicht gemeint.

Die First Principles beschreiben Design als etwas Fraktales. Das klingt
abstrakt, ist aber leicht verständlich:

Auf jeder Ebene passiert dasselbe.

Du verstehst ein Problem, wählst eine Lösung und beschreibst diese Lösung so,
dass sie umgesetzt und geprüft werden kann.

Das passiert auf Produktebene:

> Für wen ist das Produkt und welches Problem löst es?

Es passiert auf Feature-Ebene:

> Was soll im Login passieren, wenn ein Konto gesperrt ist?

Es passiert auf Komponenten-Ebene:

> Welche Zustände kann dieser Button haben?

Es passiert auf Test-Ebene:

> Was soll diese Funktion für diese Eingabe zurückgeben?

Spec Driven Development heißt nicht, alles upfront zu wissen. Es heißt, auf
jeder Ebene genug Klarheit zu schaffen, um verantwortungsvoll tiefer zu gehen.

Für AI-Agenten ist dieses fraktale Denken besonders hilfreich. Ein Agent kann
mit einer großen Produktidee starten, braucht aber schnell kleinere,
bearbeitbare Einheiten:

- Welche Fähigkeit wird gebaut?
- Welche Regeln gelten?
- Welche Beispiele sind wichtig?
- Welche Dateien sind wahrscheinlich betroffen?
- Woran erkennen wir, dass das Ergebnis richtig ist?

Je kleiner und klarer diese Einheiten sind, desto besser kann ein Agent
arbeiten.

---

## Der Mensch behält die Designentscheidung

Der wichtigste Punkt für AI ist vielleicht dieser:

> Die Lösung ist nicht dasselbe wie die Spec.

Eine Lösung ist eine Designentscheidung. Zum Beispiel:

- Wir lehnen negative Beträge ab.
- Wir speichern eine Bestellung erst nach bestätigter Zahlung.
- Wir zeigen gelöschte Einträge im Audit-Log weiterhin an.
- Wir bauen eine einfache Suche statt einer semantischen Suche.

Die Spec drückt diese Entscheidung so aus, dass andere damit arbeiten können.

Das schützt eine wichtige Grenze.

Wenn AI aus einem vagen Prompt sowohl die Lösung als auch den Code ableitet,
delegieren wir Designentscheidungen an ein System, das unseren Kontext nur
ausschnittsweise kennt.

Wenn Menschen die Lösung bewusst entscheiden und als Spec ausdrücken, kann AI
sehr wertvoll werden:

- Sie kann Varianten prüfen.
- Sie kann Beispiele ergänzen.
- Sie kann Inkonsistenzen finden.
- Sie kann Code aus der Spec ableiten.
- Sie kann Tests gegen die Spec erzeugen.
- Sie kann bestehende Implementierung mit der Spec vergleichen.

Die Verantwortung verschiebt sich also nicht weg vom Menschen. Sie wird klarer.

Der Mensch entscheidet, was richtig ist. Die Spec hält diese Entscheidung fest.
Die AI hilft, sie umzusetzen.

---

## Was eine gute AI-Spec leisten sollte

Eine gute Spec für AI muss nicht lang sein. Sie muss brauchbar sein.

Sie sollte diese Fragen beantworten:

1. **Ziel:** Welches Problem soll gelöst werden?
2. **Kontext:** Wo im Produkt oder System passiert das?
3. **Regeln:** Was muss immer gelten?
4. **Beispiele:** Welche konkreten Fälle zeigen das Verhalten?
5. **Grenzen:** Was gehört ausdrücklich nicht dazu?
6. **Feedback:** Wie prüfen wir, ob es richtig ist?

Das reicht oft schon, um einen Agenten deutlich zuverlässiger zu machen.

Ein schwacher Prompt lautet:

```text
Baue eine bessere Suche.
```

Eine bessere Spec lautet:

```text
Nutzer sollen Artikel finden, auch wenn sie nur Teilbegriffe eingeben.
Die Suche soll Titel und Beschreibung berücksichtigen.
Entwürfe dürfen nicht sichtbar sein.
Bei leerer Eingabe werden keine Treffer angezeigt.
Die erste Version braucht keine semantische Suche.
Akzeptanz: Suche nach "agent" findet veröffentlichte Artikel mit "AI Agents"
im Titel oder in der Beschreibung.
```

Das ist noch kein Roman. Aber es enthält Absicht, Regeln, Grenzen und ein
prüfbares Beispiel.

Für AI ist das ein großer Unterschied.

---

## Spec Driven Development ist Context Engineering

Context Engineering fragt:

> Welche Informationen braucht ein Agent, um eine Aufgabe wirklich gut zu
> lösen?

Specs sind eine der wichtigsten Antworten darauf.

Sie sind kein zusätzlicher Bürokratie-Layer. Sie sind kuratierter Kontext.
Sie sagen dem Agenten nicht nur, welche Dateien existieren, sondern welche
Absicht hinter dem System steht.

Ein Agent mit Codezugriff kann herausfinden, wie etwas heute funktioniert.
Ein Agent mit Specs kann zusätzlich verstehen, warum es so funktionieren soll.

Das ist der Unterschied zwischen:

> Mach eine Änderung, die irgendwie in den Code passt.

Und:

> Ändere das System so, dass es weiterhin die beschriebene Absicht erfüllt.

Je mehr AI in der Softwareentwicklung arbeitet, desto wertvoller wird diese
zweite Form.

---

## Was du mitnehmen kannst

1. **AI macht Specs wichtiger, nicht überflüssig.** Wenn Code schneller
   entsteht, muss Absicht früher und klarer sichtbar sein.

2. **Specs sind Kommunikation von Design.** Sie beschreiben nicht nur Aufgaben,
   sondern Entscheidungen.

3. **Frühes Feedback spart die teuersten Fehler.** Eine unklare Spec ist
   günstiger zu korrigieren als falscher Produktcode.

4. **Specs leben.** Sie ändern sich mit Erkenntnissen, Nutzerverhalten und
   Produktentscheidungen.

5. **Der Mensch bleibt verantwortlich für die Lösung.** AI kann sehr viel
   umsetzen, aber sie sollte nicht heimlich die wichtigsten Designentscheidungen
   treffen.

---

## Schluss: Erst die Absicht, dann der Code

Spec Driven Development ist kein nostalgischer Wunsch nach mehr Dokumentation.
Es ist eine Antwort auf eine sehr moderne Frage:

> Wie behalten wir Kontrolle, wenn Umsetzung immer schneller wird?

Die Antwort ist nicht, AI weniger zu nutzen. Die Antwort ist, ihr bessere
Arbeitsgrundlagen zu geben.

Ein guter Agent braucht Tools, Codezugriff, Tests und Feedback. Aber vor allem
braucht er eine verständliche Beschreibung dessen, was richtig bedeutet.

Diese Beschreibung ist die Spec.

Und je stärker AI an Software mitschreibt, desto mehr wird gute
Softwareentwicklung heißen:

> erst die Absicht klären, dann die Maschine arbeiten lassen.
