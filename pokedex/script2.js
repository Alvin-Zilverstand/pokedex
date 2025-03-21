const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const colors = {
  fire: "#e03a3a",
  grass: "#50C878",
  electric: "#fad343",
  water: "#1E90FF",
  ground: "#735139",
  rock: "#63594f",
  fairy: "#EE99AC",
  poison: "#b34fb3",
  bug: "#A8B820",
  dragon: "#fc883a",
  psychic: "#882eff",
  flying: "#87CEEB",
  fighting: "#bf5858",
  normal: "#D2B48C",
  ghost: "#7B62A3",
  dark: "#414063",
  steel: "#808080",
  ice: "#98D8D8",
};
const main_types = Object.keys(colors);

const fetchPokemonDetails = async () => {
  const url = `http://localhost/pokedex/pokedex/get_pokemon.php?id=${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayPokemonDetails(data);
};

const displayPokemonDetails = (pokemon) => {
  const name = pokemon.name;
  const japaneseName = pokemon.japanese_name;
  const id = pokemon.id.toString().padStart(3, "0");
  const imageSrc = pokemon.image_url;
  const poke_types = pokemon.types;
  const type = poke_types[0];
  const color = colors[type];

  const hp = pokemon.stats?.hp || 0;
  const attack = pokemon.stats?.attack || 0;
  const spAttack = pokemon.stats?.sp_attack || 0;
  const spDefense = pokemon.stats?.sp_defense || 0;
  const defense = pokemon.stats?.defense || 0;
  const speed = pokemon.stats?.speed || 0;

  const abilities = pokemon.abilities;
  const eggGroups = pokemon.egg_groups;
  document.body.style.backgroundColor = color;

  let tab2 = document.getElementById("tab_2");
  tab2.innerHTML = `
    <div class="stats">
      <div class="stat">
        <div>
          <span> Health:</span>
          <span>${hp}</span>
        </div>
        <meter id="hp" min="0" max="255" low="70" high="120" optimum="150" value="${hp}"></meter>
      </div>
      <div class="stat">
        <div>
          <span> Attack:</span>
          <span>${attack}</span>
        </div>
        <meter id="attack" min="0" max="255" low="70" high="120" optimum="150" value="${attack}"></meter>
      </div>
      <div class="stat">
        <div>
          <span> Defense:</span>
          <span>${defense}</span>
        </div>
        <meter id="defense" min="0" max="255" low="70" high="120" optimum="150" value="${defense}"></meter>
      </div>
      <div class="stat">
        <div>
          <span> Sp. Atk:</span>
          <span>${spAttack}</span>
        </div>
        <meter id="spattack" min="0" max="255" low="70" high="120" optimum="150" value="${spAttack}"></meter>
      </div>
      <div class="stat">
        <div>
          <span> Sp. Def:</span>
          <span>${spDefense}</span>
        </div>
        <meter id="spdefense" min="0" max="255" low="70" high="120" optimum="150" value="${spDefense}"></meter>
      </div>
      <div class="stat">
        <div>
          <span>Speed:</span>
          <span>${speed}</span>
        </div>
        <meter id="speed" min="0" max="255" low="70" high="120" optimum="150" value="${speed}"></meter>
      </div>
      <div class="stat">
        <div>
          <span> Total:</span>
          <span>${speed + hp + attack + defense + spAttack + spDefense}</span>
        </div>
        <meter id="total" min="0" max="1530" low="500" high="720" optimum="1000" value="${speed + hp + attack + defense + spAttack + spDefense}"></meter>
      </div>
    </div>
  `;

  let pokemonDetailsEl = document.getElementById("pokemon-details");
  pokemonDetailsEl.innerHTML = `
    <div class="btn">
      <button class="previousBtn" onclick="backButton()"><i class="fas fa-chevron-left"></i></button>
      <button class="nextBtn" onclick="nextPokemon()"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="names">
      <div class="japaneseName">${japaneseName}</div>
      <div class="name">${name}</div>
    </div>
    <div class="top">
      <div class="image">
        <img class="imgFront" src="${imageSrc}" alt="${name}">
        <img class="imgBack" src="./Icons/default/pokeball.svg" alt="pokeball">
      </div>
    </div>
  `;

  const height = pokemon.height / 10 + "m";
  const weight = pokemon.weight / 10 + "kg";
  const genderRate = pokemon.gender_rate;
  let male = "";
  let female = "";
  if (genderRate === -1) {
    male = "??";
    female = "??";
  } else if (genderRate === 0) {
    male = "100%";
    female = "0%";
  } else if (genderRate === 8) {
    male = "0%";
    female = "100%";
  } else {
    female = (genderRate / 8) * 100 + "%";
    male = 100 - (genderRate / 8) * 100 + "%";
  }
  const friendship = pokemon.base_happiness;
  const catchRate = pokemon.capture_rate;

  let tab1 = document.getElementById("tab_1");
  tab1.innerHTML = `
    <div>
      <div class="overview">
        <p><span class="genus">${pokemon.genus}</span><br>${pokemon.flavor_text}</p>
        <div class="heightWeight">
          <span>Height:<br><b>${height}</b></span>
          <span>Weight:<br><b>${weight}</b></span>
        </div>
        <div class="types">
          ${poke_types.map(type => `
            <div class="poke__type__bg ${type}">
              <img src="Icons/${type}.svg" alt="Type">
            </div>
          `).join("")}
        </div>
      </div>
      <div class="about">
        <div>Id: <b class="id">#${id}</b></div>
        <div>Gender: <b><i class="fa-solid fa-mars" style="color: #1f71ff;"></i>${male}  <i class="fa-solid fa-venus" style="color: #ff5c74;"></i>${female}</b></div>
        <span>Abilities: <b>${abilities.join(", ")}</b></span>
        <span>Catch Rate: <b>${catchRate} (${((catchRate / 255) * 100).toFixed(2)}% chance)</b></span>
        <span>Base Friendship: <b>${friendship} (${friendship < 50 ? "lower" : friendship < 100 ? "normal" : "higher"})</b></span>
        <span>Base Exp: <b>${pokemon.base_experience}</b></span>
        <span>Growth Rate: <b>${pokemon.growth_rate}</b></span>
        <span>Egg Groups: <b>${eggGroups.join(", ")}</b></span>
      </div>
    </div>
  `;
};

const tabs = document.querySelectorAll("[data-tab-value]");
const tabsContainer = document.querySelector(".tabs");
const tabInfos = document.querySelectorAll("[data-tab-info]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.tabValue);

    tabInfos.forEach((tabInfo) => {
      tabInfo.classList.remove("active");
    });
    target.classList.add("active");
    target.scrollIntoView({ behavior: "smooth" });
  });
});
const nextPokemon = (e) => {
  window.location.href = `details.html?id=${id + 1}`;
  e.preventDefault();
};
const backButton = (e) => {
  window.history.back();
  e.preventDefault();
};

fetchPokemonDetails();

//preloader
window.addEventListener("load", function () {
  document.querySelector("body").classList.add("loaded");
});

