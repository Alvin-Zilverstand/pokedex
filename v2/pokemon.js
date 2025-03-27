(() => {
  const MAX_POKEMON = 1050;
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const listWrapper = document.querySelector(".list-wrapper");
  const searchInput = document.querySelector("#search-input");
  const notFoundMessage = document.querySelector("#not-found-message");

  let allPokemons = [];
  let filteredPokemons = [];

  document.addEventListener("DOMContentLoaded", () => {
    fetchPokemons();
  });

  function fetchPokemons() {
    console.log("Fetching Pokémon data from server...");
    fetch(`./get-pokemon.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          console.error("Error from server:", data.error);
          return;
        }

        if (Array.isArray(data)) {
          allPokemons = data;
          console.log("Fetched Pokémon data:", allPokemons);
          filteredPokemons = allPokemons;
          displayPokemons(filteredPokemons);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }

  function displayPokemons(pokemons) {
    console.log("Displaying Pokémon data:", pokemons);
    listWrapper.innerHTML = "";

    pokemons.forEach((pokemon) => {
      const listItem = document.createElement("div");
      listItem.className = "list-item";
      listItem.innerHTML = `
          <div class="number-wrap">
              <p class="caption-fonts">#${pokemon.id}</p>
          </div>
          <div class="img-wrap">
              <img src="${pokemon.image_url}" alt="${pokemon.name}" />
          </div>
          <div class="name-wrap">
              <p class="body3-fonts">${pokemon.name}</p>
          </div>
      `;

      listWrapper.appendChild(listItem);
    });

    if (pokemons.length === 0) {
      notFoundMessage.style.display = "block";
    } else {
      notFoundMessage.style.display = "none";
    }
  }
})();
