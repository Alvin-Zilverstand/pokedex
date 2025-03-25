const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`./get-pokemon.php`)
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      allPokemons = data;
      cacheImages(allPokemons);
      displayPokemons(allPokemons);
    } else {
      console.error("Unexpected response format:", data);
    }
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const pokemon = await fetch(`./get-pokemon.php?id=${id}`).then((res) =>
      res.json()
    );

    if (pokemon.error) {
      throw new Error(pokemon.error);
    }

    return true;
  } catch (error) {
    console.error("Failed to fetch Pokémon data before redirect:", error);
    return false;
  }
}

function cacheImages(pokemons) {
  pokemons.forEach((pokemon) => {
    const img = new Image();
    img.src = pokemon.image_url;
    img.onload = () => {
      localStorage.setItem(`pokemon_image_${pokemon.id}`, pokemon.image_url);
    };
  });
}

function getCachedImageUrl(pokemonId) {
  return localStorage.getItem(`pokemon_image_${pokemonId}`);
}

function displayPokemons(pokemons) {
  listWrapper.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const cachedImageUrl = getCachedImageUrl(pokemon.id);
    const imageUrl = cachedImageUrl || pokemon.image_url;

    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemon.id}</p>
        </div>
        <div class="img-wrap">
            <img src="${imageUrl}" alt="${pokemon.name}" />
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
