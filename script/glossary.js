document.addEventListener("DOMContentLoaded", () => {
  const glossaryList = document.getElementById("glossary-list");
  const searchInput = document.getElementById("searchGlossary");

  fetch("data/glossary.json")
    .then(response => response.json())
    .then(data => {
      displayTerms(data);

      searchInput.addEventListener("input", () => {
        const filtered = data.filter(term =>
          term.term.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        displayTerms(filtered);
      });
    });

  function displayTerms(terms) {
    glossaryList.innerHTML = "";

    terms.forEach(item => {
      const card = document.createElement("div");
      card.className = "glossary-card";

      card.innerHTML = `
        <h3>${item.term}</h3>
        <p>${item.definition}</p>
      `;

      glossaryList.appendChild(card);
    });
  }
});
