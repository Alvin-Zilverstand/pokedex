(() => {
  const MAX_POKEMON = 1050;
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const listWrapper = document.querySelector(".list-wrapper");
  const searchInput = document.querySelector("#search-input");
  const numberAscFilter = document.querySelector("#number-asc");
  const numberDescFilter = document.querySelector("#number-desc");
  const nameAscFilter = document.querySelector("#name-asc");
  const nameDescFilter = document.querySelector("#name-desc");
  const notFoundMessage = document.querySelector("#not-found-message");
  const competitorsWrapper = document.querySelector("#competitors-wrapper");

  let allPokemons = [];
  let filteredPokemons = [];

  document.addEventListener("DOMContentLoaded", () => {
    const cachedData = localStorage.getItem("pokemons");
    const cacheTimestamp = localStorage.getItem("pokemons_timestamp");

    if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      allPokemons = JSON.parse(cachedData);
      console.log("Loaded Pokémon data from cache:", allPokemons);
      filteredPokemons = allPokemons.filter(pokemon => !pokemon.deleted);
      displayPokemons(filteredPokemons);
      fetchCompetitors();
    } else {
      fetchPokemons();
    }
  });

  function fetchPokemons() {
    console.log("Fetching Pokémon data from server...");
    fetch(`./get-pokemon.php`)
      .then((response) => response.text())
      .then((text) => {
        console.log("Server response:", text);
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            allPokemons = data;
            localStorage.setItem("pokemons", JSON.stringify(allPokemons));
            localStorage.setItem("pokemons_timestamp", Date.now().toString());
            console.log("Fetched and cached Pokémon data:", allPokemons);
            filteredPokemons = allPokemons.filter(pokemon => !pokemon.deleted);
            displayPokemons(filteredPokemons);
            fetchCompetitors();
          } else {
            console.error("Unexpected response format:", data);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }

  async function fetchPokemonDataBeforeRedirect(id) {
    try {
      console.log(`Fetching data for Pokémon ID ${id} before redirect...`);
      const response = await fetch(`./get-pokemon.php?id=${id}`);
      const text = await response.text();
      console.log(`Response for Pokémon ID ${id}:`, text);
      if (!text) {
        throw new Error("Empty response from server");
      }
      const pokemon = JSON.parse(text);

      if (pokemon.error) {
        throw new Error(pokemon.error);
      }

      return true;
    } catch (error) {
      console.error(`Failed to fetch Pokémon data before redirect for ID ${id}:`, error);
      return false;
    }
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
              <img data-src-low="${pokemon.image_url_low}" data-src="${pokemon.image_url}" alt="${pokemon.name}" />
          </div>
          <div class="name-wrap">
              <p class="body3-fonts">${pokemon.name}</p>
          </div>
      `;

      listItem.addEventListener("click", async () => {
        const success = await fetchPokemonDataBeforeRedirect(pokemon.id);
        if (success) {
          window.location.href = `./detail.html?id=${pokemon.id}`;
        } else {
          console.error(`Failed to fetch data for Pokémon ID: ${pokemon.id}`);
        }
      });

      listWrapper.appendChild(listItem);
    });

    lazyLoadImages();
  }

  function lazyLoadImages() {
    console.log("Initializing lazy loading for images...");
    const images = document.querySelectorAll('.img-wrap img[data-src]');
    const config = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    let observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          preloadLowResImage(entry.target);
          self.unobserve(entry.target);
        }
      });
    }, config);

    images.forEach(image => {
      observer.observe(image);
    });
  }

  function preloadLowResImage(img) {
    const srcLow = img.getAttribute('data-src-low');
    if (!srcLow) {
      return;
    }
    console.log("Preloading low-resolution image:", srcLow);
    img.src = srcLow;
    preloadHighResImage(img);
  }

  function preloadHighResImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) {
      return;
    }
    const highResImg = new Image();
    highResImg.src = src;
    highResImg.onload = () => {
      console.log("Preloading high-resolution image:", src);
      setTimeout(() => {
        img.src = src;
      }, 2000); // Wait for 2 seconds before switching to high-resolution image
    };
  }

  searchInput.addEventListener("keyup", handleSearch);
  numberAscFilter.addEventListener("change", handleSort);
  numberDescFilter.addEventListener("change", handleSort);
  nameAscFilter.addEventListener("change", handleSort);
  nameDescFilter.addEventListener("change", handleSort);

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    console.log("Handling search with term:", searchTerm);

    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.id.toString();
      const pokemonName = pokemon.name.toLowerCase();
      return (pokemonID.startsWith(searchTerm) || pokemonName.startsWith(searchTerm)) && !pokemon.deleted;
    });

    displayPokemons(filteredPokemons);

    if (filteredPokemons.length === 0) {
      notFoundMessage.style.display = "block";
    } else {
      notFoundMessage.style.display = "none";
    }
  }

  function handleSort() {
    if (numberAscFilter.checked) {
      filteredPokemons.sort((a, b) => a.id - b.id);
    } else if (numberDescFilter.checked) {
      filteredPokemons.sort((a, b) => b.id - a.id);
    } else if (nameAscFilter.checked) {
      filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameDescFilter.checked) {
      filteredPokemons.sort((a, b) => b.name.localeCompare(a.name));
    }

    displayPokemons(filteredPokemons);
  }

  const closeButton = document.querySelector(".search-close-icon");
  closeButton.addEventListener("click", clearSearch);

  function clearSearch() {
    console.log("Clearing search input and displaying all Pokémon...");
    searchInput.value = "";
    filteredPokemons = allPokemons.filter(pokemon => !pokemon.deleted);
    displayPokemons(filteredPokemons);
    notFoundMessage.style.display = "none";
  }

  function fetchCompetitors() {
    console.log("Fetching competitors data from server...");
    fetch(`./get-competitors.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          console.error("Error from server:", data.error);
          displayCompetitorsError(data.error);
        } else {
          displayCompetitors(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching competitors data:", error);
        displayCompetitorsError("Failed to load competitors data. Please try again later.");
      });
  }

  function displayCompetitorsError(message) {
    const competitorsWrapper = document.querySelector("#competitors-wrapper");
    competitorsWrapper.innerHTML = `<p class="error-message">${message}</p>`;
  }

  function displayCompetitors(competitors) {
    competitorsWrapper.innerHTML = "";

    competitors.forEach((competitor) => {
      const listItem = document.createElement("div");
      listItem.className = "list-item";
      listItem.innerHTML = `
          <div class="number-wrap">
              <p class="caption-fonts">User ID: ${competitor.user_id}</p>
          </div>
          <div class="img-wrap">
              <img src="${competitor.image_url}" alt="${competitor.name}" />
          </div>
          <div class="name-wrap">
              <p class="body3-fonts">${competitor.name}</p>
          </div>
          <div class="pokemon-count">
              <p class="body3-fonts">Pokémon Count: ${competitor.pokemon_count}</p>
          </div>
      `;

      competitorsWrapper.appendChild(listItem);
    });
  }
})();
