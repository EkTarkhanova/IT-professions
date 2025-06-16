document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("profession-categories");

  fetch("data/professions.json")
    .then(response => response.json())
    .then(data => {
      data.forEach(prof => {
        const card = document.createElement("div");
        card.className = "profession-card";
        card.id = prof.id;
        
        // Форматируем списки для детального просмотра
        const formatList = (items) => {
          if (!items || !Array.isArray(items)) return "";
          return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        };

        // Основная информация карточки (всегда видимая)
        card.innerHTML = `
          <div class="card-summary">
            <h3>${prof.title}</h3>
            <p>${prof.preview}</p>
            <div class="tags">${prof.tags.map(tag => `<span>#${tag}</span>`).join('')}</div>
          </div>
          <div class="profession-detail hidden">
            <div class="detail-content">
              <div class="detail-section">
                <h4>Описание</h4>
                <p>${prof.description}</p>
              </div>
              
              <div class="detail-section">
                <h4>Обязанности</h4>
                ${formatList(prof.responsibilities)}
              </div>
              
              <div class="detail-section">
                <h4>Навыки</h4>
                <div class="skills">${prof.skills.map(skill => `<span>${skill}</span>`).join('')}</div>
              </div>
              
              <div class="detail-section">
                <h4>Инструменты</h4>
                <div class="tools">${prof.tools.map(tool => `<span>${tool}</span>`).join('')}</div>
              </div>
              
              <div class="detail-section">
                <h4>Карьерный путь</h4>
                <div class="career-path">${prof.career}</div>
              </div>
              
              <div class="detail-section">
                <h4>Образование</h4>
                <p>${prof.education}</p>
              </div>
              
              <div class="detail-section">
                <h4>Зарплата</h4>
                <div class="salary">${prof.salary}</div>
              </div>
              
              <div class="pros-cons">
                <div class="pros">
                  <h4>Преимущества</h4>
                  ${formatList(prof.pros)}
                </div>
                <div class="cons">
                  <h4>Сложности</h4>
                  ${formatList(prof.cons)}
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Личные качества</h4>
                <p>${prof.personality}</p>
              </div>
            </div>
          </div>
        `;

        // Обработчик клика для раскрытия/закрытия
        card.querySelector(".card-summary").addEventListener("click", () => {
          const detail = card.querySelector(".profession-detail");
          const isOpen = !detail.classList.contains("hidden");
          
          // Закрываем все открытые карточки
          document.querySelectorAll(".profession-detail:not(.hidden)").forEach(d => {
            d.classList.add("hidden");
            d.parentElement.classList.remove("expanded");
          });
          
          // Открываем/закрываем текущую
          if (!isOpen) {
            detail.classList.remove("hidden");
            card.classList.add("expanded");
          }
        });

        container.appendChild(card);
      });
      
      // Обработка hash в URL
      const hash = window.location.hash.slice(1);
      if (hash) {
        const targetCard = document.getElementById(hash);
        if (targetCard) {
          const detail = targetCard.querySelector(".profession-detail");
          detail.classList.remove("hidden");
          targetCard.classList.add("expanded");
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
});