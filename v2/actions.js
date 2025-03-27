document.querySelector("#register-pokemon").addEventListener("click", registerPokemon);
document.querySelector("#edit-pokemon").addEventListener("click", editPokemon);
document.querySelector("#delete-pokemon").addEventListener("click", deletePokemon);
document.querySelector("#toggle-competitors").addEventListener("click", toggleCompetitors);

function registerPokemon() {
  const name = prompt("Enter Pokémon name:");
  const id = prompt("Enter Pokémon ID:");
  const height = prompt("Enter Pokémon height:");
  const weight = prompt("Enter Pokémon weight:");
  const base_experience = prompt("Enter Pokémon base experience:");
  const species_url = prompt("Enter Pokémon species URL:");
  const image_url = prompt("Enter Pokémon image URL:");

  if (name && id && height && weight && base_experience && species_url && image_url) {
    fetch(`./register-pokemon.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, id, height, weight, base_experience, species_url, image_url }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Pokémon registered successfully!");
          location.reload();
        } else {
          alert("Failed to register Pokémon.");
        }
      })
      .catch((error) => {
        console.error("Error registering Pokémon:", error);
      });
  } else {
    alert("All fields are required.");
  }
}

function editPokemon() {
  const id = prompt("Enter Pokémon ID to edit:");
  if (!id) {
    alert("Pokémon ID is required.");
    return;
  }

  const name = prompt("Enter new Pokémon name:");
  const height = prompt("Enter new Pokémon height:");
  const weight = prompt("Enter new Pokémon weight:");
  const base_experience = prompt("Enter new Pokémon base experience:");
  const species_url = prompt("Enter new Pokémon species URL:");
  const image_url = prompt("Enter new Pokémon image URL:");

  if (name && height && weight && base_experience && species_url && image_url) {
    fetch(`./edit-pokemon.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, height, weight, base_experience, species_url, image_url }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Pokémon edited successfully!");
          location.reload();
        } else {
          alert("Failed to edit Pokémon.");
        }
      })
      .catch((error) => {
        console.error("Error editing Pokémon:", error);
      });
  } else {
    alert("All fields are required.");
  }
}

function deletePokemon() {
  const id = prompt("Enter Pokémon ID to delete:");
  if (!id) {
    alert("Pokémon ID is required.");
    return;
  }

  fetch(`./delete-pokemon.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Pokémon marked as deleted successfully!");
        location.reload();
      } else {
        alert("Failed to mark Pokémon as deleted.");
      }
    })
    .catch((error) => {
      console.error("Error marking Pokémon as deleted:", error);
    });
}

function toggleCompetitors() {
  const competitorsWrapper = document.querySelector("#competitors-wrapper");
  const toggleButton = document.querySelector("#toggle-competitors");

  if (competitorsWrapper.classList.contains("hidden")) {
    competitorsWrapper.classList.remove("hidden");
    toggleButton.textContent = "Hide";
  } else {
    competitorsWrapper.classList.add("hidden");
    toggleButton.textContent = "Show";
  }
}
