# LinkedIn Teaser: Open Knowledge Format

Jede neue Agenten-Session beginnt oft mit demselben Problem:

Der Agent hat vergessen, was das Team gestern schon wusste.

Er liest wieder dieselben Dateien. Er rekonstruiert wieder dieselben
Entscheidungen. Er bekommt Kontext ueber `CLAUDE.md`, `AGENTS.md`, Wikis,
Prompts oder Tool-Ausgaben.

Das hilft. Aber es skaliert schlecht.

Open Knowledge Format setzt an einer anderen Stelle an:

Teamwissen wird als versionierbarer Markdown-Graph neben dem Code abgelegt.

- `index.md` fuer progressive Disclosure
- `log.md` fuer Aenderungshistorie
- ein Konzept pro Datei
- YAML-Frontmatter fuer Typen und Metadaten
- normale Markdown-Links als Beziehungen

Das ist keine neue Agentenplattform.

Es ist ein portables Format fuer Wissen, das Menschen lesen, Agenten
traversieren und Tools weiterverarbeiten koennen.

Ich habe dazu einen Artikel geschrieben: Was OKF ist, wie es sich von
`CLAUDE.md`, `AGENTS.md` und MCP unterscheidet, und warum portable Memory fuer
AI-Agenten wichtiger wird.

Artikel:
https://blog.agentswork.de/posts/otk-guide/

#OpenKnowledgeFormat #AIAgents #ContextEngineering #AgentMemory #DeveloperTools
