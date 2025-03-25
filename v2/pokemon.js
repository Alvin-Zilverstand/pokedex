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
    console.log("Loaded Pokémon data from cache:", allPokemons);
    displayPokemons(allPokemons);
  } else {
    fetchPokemons();
  }
});

function fetchPokemons() {
  console.log("Fetching Pokémon data from server...");
  fetch(`./get-pokemon.php`)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        allPokemons = data;
        localStorage.setItem("pokemons", JSON.stringify(allPokemons));
        localStorage.setItem("pokemons_timestamp", Date.now().toString());
        console.log("Fetched and cached Pokémon data:", allPokemons);
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
  const srcLow = img.getAttribute('data-src-low');
  const src = img.getAttribute('data-src');
  if (!srcLow || !src) {
    return;
  }
  console.log("Preloading low-resolution image:", srcLow);
  img.src = srcLow;
  const highResImg = new Image();
  highResImg.src = src;
  highResImg.onload = () => {
    console.log("Preloading high-resolution image:", src);
    img.src = src;
  };
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  console.log("Handling search with term:", searchTerm);
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
  console.log("Clearing search input and displaying all Pokémon...");
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}
