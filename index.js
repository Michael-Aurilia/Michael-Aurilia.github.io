document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const pokemonDetails = document.getElementById("pokemonDetails");

  // Function to fetch Pokémon abilities from the API
  async function fetchPokemonAbilities(pokemonName) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      return data.abilities;
    } catch (error) {
      console.error("Error fetching Pokémon abilities:", error);
      return [];
    }
  }

  // Function to display Pokémon abilities in the UI
  function displayPokemonAbilities(abilities) {
    if (abilities.length === 0) {
      pokemonDetails.innerHTML = "<p>No abilities found for this Pokémon.</p>";
      return;
    }

    const abilitiesList = abilities.map(ability => `
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${ability.ability.name}</h5>
            <p class="card-text">${ability.is_hidden ? "(Hidden Ability)" : ""}</p>
          </div>
        </div>
      </div>
    `).join('');

    pokemonDetails.innerHTML = abilitiesList;
  }

  // Function to update URL with the searched Pokémon name
  function updateURL(pokemonName) {
    const newURL = `${window.location.pathname}?name=${pokemonName}`;
    window.history.pushState({ path: newURL }, '', newURL);
  }

  // Function to handle Pokémon search
  function handlePokemonSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      fetchPokemonAbilities(searchTerm)
        .then(abilities => {
          displayPokemonAbilities(abilities);
          updateURL(searchTerm);
        })
        .catch(error => {
          console.error("Error:", error);
          pokemonDetails.innerHTML = "<p>An error occurred while fetching Pokémon abilities.</p>";
        });
    }
  }

  // Event listener for search button click
  searchButton.addEventListener("click", handlePokemonSearch);

  // Fetch Pokémon abilities when the page loads
  const pokemonName = getPokemonNameFromURL();
  if (pokemonName) {
    fetchPokemonAbilities(pokemonName)
      .then(abilities => {
        displayPokemonAbilities(abilities);
      })
      .catch(error => {
        console.error("Error:", error);
        pokemonDetails.innerHTML = "<p>An error occurred while fetching Pokémon abilities.</p>";
      });
  } else {
    pokemonDetails.innerHTML = "<p>Pokémon name not provided.</p>";
  }

  // Function to get Pokémon name from URL query parameter
  function getPokemonNameFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('name');
  }
});