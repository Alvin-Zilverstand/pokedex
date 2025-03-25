const MAX_POKEMON = 151;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

document.addEventListener("DOMContentLoaded", () => {
  const cachedData = localStorage.getItem("pokemons");
  const cacheTimestamp = localStorage.getItem("pokemons_timestamp");

  if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    allPokemons = JSON.parse(cachedData);
    displayPokemons(allPokemons);
  } else {
    fetchPokemons();
  }
});

function fetchPokemons() {
  fetch(`./get-pokemon.php`)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        allPokemons = data;
        localStorage.setItem("pokemons", JSON.stringify(allPokemons));
        localStorage.setItem("pokemons_timestamp", Date.now().toString());
        displayPokemons(allPokemons);
      } else {
        console.error("Unexpected response format:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching Pokémon data:", error);
    });
}

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const response = await fetch(`./get-pokemon.php?id=${id}`);
    const text = await response.text();
    console.log(`Response for Pokémon ID ${id}:`, text);
    const pokemon = JSON.parse(text);

    if (pokemon.error) {
      throw new Error(pokemon.error);
    }

    return true;
  } catch (error) {
    console.error("Failed to fetch Pokémon data before redirect:", error);
    return false;
  }
}

function displayPokemons(pokemons) {
  listWrapper.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemon.id}</p>
        </div>
        <div class="img-wrap">
            <img data-src="${pokemon.image_url}" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
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
  const images = document.querySelectorAll('.img-wrap img[data-src]');
  const config = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  let observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        preloadImage(entry.target);
        self.unobserve(entry.target);
      }
    });
  }, config);

  images.forEach(image => {
    observer.observe(image);
  });
}

function preloadImage(img) {
  const src = img.getAttribute('data-src');
  if (!src) {
    return;
  }
  img.src = src;
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.id.toString();
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}
