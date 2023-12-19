# Apen race

official edit by:
Dylan, Jelte, Mohammed and Igor
#

Om difficulties toe te voegen maak nieuw json bestand aan (bijvoorbeeld: plus.json)
gebruik de volgende formaat:

[
  {
    "questions" : "vraag hier"
    "answer" : "antwoord hier"
  },
  {
    "questions" : "vraag hier"
    "answer" : "antwoord hier"
  }
]

in home.html
ga naar lijn 161
voeg een option toe ( <option id="plus" value="plus">Plus sommen</option> )
nu heeft u successvol een optie toe gevoegd;

om de taal daarvan ook nog goed te hebben ga naar language.js
voeg een lijn onderaan de const query
const plus = document.getElementById("plus");
onderaan de if query voeg een lijn aan:

        if (plus) {
          plus.textContent = data.plus;
        }

ga daarna naar alle talen toe
(in de folder /server/languages)
daar heeft u meerdere talen in zitten wij pakken voor het voorbeeld nederlands;
u klikt dan op nl.json,
voeg de volgende lijn toe in het volgende formaat:

"plus": "Plus sommen"

het eerste is de data.plus wat u bij vorige stap hebt gezet het tweede is wat de gebruikers gaan zien.
dit doet u bij elke taal zodat iedereen in elke verschillende taal kunt zien dat het plus sommen zijn.
