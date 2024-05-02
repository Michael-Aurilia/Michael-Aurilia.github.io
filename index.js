document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const autocompleteDropdown = document.getElementById("autocompleteDropdown");
  const searchButton = document.getElementById("searchButton");
  const pokemonDetails = document.getElementById("pokemonDetails");
  let pokemonNames = []; // List to store Pokémon names

  // Function to fetch Pokémon names from the API
  async function fetchPokemonNames() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1500");
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
    const suggestionsHTML = matchedPokemons.map(pokemon => `<a class="dropdown-item d-block" href="#" onclick="selectPokemon('${pokemon}')">${pokemon}</a>`).join('\n');
    autocompleteDropdown.innerHTML = suggestionsHTML;
    autocompleteDropdown.classList.toggle('show', matchedPokemons.length > 0);
  }

  // Function to handle selection of a Pokémon from autocomplete suggestions
  window.selectPokemon = function(pokemonName) {
    searchInput.value = pokemonName;
    autocompleteDropdown.classList.remove('show');
  };

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
            autocompleteDropdown.classList.remove('show'); // Hide autocomplete menu
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
  // Function to capitalize the first letter of each word
  function capitalizeWords(string) {
      return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  }

  const abilities = pokemon.abilities.map(ability => capitalizeWords(ability.ability.name)).join(', ');

  const moves = pokemon.moves.map(move => move.move.name);
  const movesChunks = chunkArray(moves, 5); // Split moves into chunks of 5
  
  const movesList = movesChunks.map(chunk => {
      return `<div class="col-md-6"><ul>${chunk.map(move => `<li>${move}</li>`).join('')}</ul></div>`;
  }).join('');
  const pokemonCard = `
      <div class="col-md-4 offset-md-4">
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title"><b>Name: </b>${capitalizeWords(pokemon.name)}</h5>
                  <img src="${pokemon.sprites.front_default}" class="img-fluid mb-3" alt="${pokemon.name}">
                  <p class="card-text"><b>Height: </b>${pokemon.height} decimetres</p>
                  <p class="card-text"><b>Weight: </b>${pokemon.weight} hectograms</p>
                  <p class="card-text"><b>Types:</b></p>
                  <ul>
                      <p class="card-text">${pokemon.types.map(type => capitalizeWords(type.type.name)).join(', ')}</p>
                  </ul>
                  <p class="card-text"><b>Abilities: </b>${abilities}</p>
                  <p class="card-text"><b>Moves Learned:</b></p>
                  <div class="row">${movesList}</div>
              </div>
          </div>
      </div>
  `;
  pokemonDetails.innerHTML = pokemonCard;
}

// Function to chunk array into smaller arrays
function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

  // Function to handle clicking on an autocomplete option
function handleAutocompleteClick(pokemonName) {
  searchInput.value = pokemonName;
  handlePokemonSearch();
}

  // Function to update URL with the searched Pokémon name
  function updateURL(pokemonName) {
    const newURL = `${window.location.pathname}?name=${pokemonName}`;
    window.history.pushState({ path: newURL }, '', newURL);
  }
});