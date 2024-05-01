document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const autocompleteDropdown = document.getElementById("autocompleteDropdown");
  const searchButton = document.getElementById("searchButton");
  const pokemonDetails = document.getElementById("pokemonDetails");
  let pokemonNames = []; // List to store Pokémon names

  // Function to fetch Pokémon names from the API
  async function fetchPokemonNames() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await response.json();
      pokemonNames = data.results.map(pokemon => pokemon.name);
    } catch (error) {
      console.error("Error fetching Pokémon names:", error);
    }
  }

  // Function to display autocomplete suggestions
  function displayAutocompleteSuggestions() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const matchedPokemons = pokemonNames.filter(pokemon => pokemon.startsWith(searchTerm));
    const suggestionsHTML = matchedPokemons.map(pokemon => `<a class="dropdown-item" href="#">${pokemon}</a>`).join('');
    autocompleteDropdown.innerHTML = suggestionsHTML;
    autocompleteDropdown.classList.toggle('show', matchedPokemons.length > 0);
  }

  // Event listener for input in the search bar
  searchInput.addEventListener("input", displayAutocompleteSuggestions);

  // Event listener for search button click
  searchButton.addEventListener("click", handlePokemonSearch);

  // Function to handle Pokémon search
  function handlePokemonSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      fetchPokemonDetails(searchTerm)
        .then(data => {
          if (data) {
            displayPokemonDetails(data);
            updateURL(searchTerm);
          } else {
            pokemonDetails.innerHTML = "<p>Pokémon details not found.</p>";
          }
        })
        .catch(error => {
          console.error("Error:", error);
          pokemonDetails.innerHTML = "<p>An error occurred while fetching Pokémon details.</p>";
        });
    }
  }

  // Fetch Pokémon names when the page loads
  fetchPokemonNames();

  // Function to get Pokémon details from the API
  async function fetchPokemonDetails(pokemonName) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      return null;
    }
  }

  // Function to display Pokémon details in the UI
  function displayPokemonDetails(pokemon) {
    const pokemonCard = `
      <div class="col-md-4 offset-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <img src="${pokemon.sprites.front_default}" class="img-fluid mb-3" alt="${pokemon.name}">
            <p class="card-text">Height: ${pokemon.height} decimetres</p>
            <p class="card-text">Weight: ${pokemon.weight} hectograms</p>
            <p class="card-text">Abilities:</p>
            <ul>
              ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    pokemonDetails.innerHTML = pokemonCard;
  }

  // Function to update URL with the searched Pokémon name
  function updateURL(pokemonName) {
    const newURL = `${window.location.pathname}?name=${pokemonName}`;
    window.history.pushState({ path: newURL }, '', newURL);
  }
});