document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const pokemonDetails = document.getElementById("pokemonDetails");

  // Function to fetch Pokémon details from the API
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
    const types = pokemon.types.map(type => `<li class="list-inline-item">${type.type.name}</li>`).join('');
  
    const moves = pokemon.moves.map(move => `<div class="col-md-4"><p class="card-text">${move.move.name}</p></div>`).join('');
    
    const pokemonCard = `
      <div class="col-md-4 offset-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <img src="${pokemon.sprites.front_default}" class="img-fluid mb-3" alt="${pokemon.name}">
            <p class="card-text">Height: ${pokemon.height} decimetres</p>
            <p class="card-text">Weight: ${pokemon.weight} hectograms</p>
            <p class="card-text">Types:</p>
            <ul class="list-inline">${types}</ul>
            <p class="card-text">Moves Learned:</p>
            <div class="row">${moves}</div>
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

  // Event listener for search button click
  searchButton.addEventListener("click", handlePokemonSearch);

  // Fetch Pokémon details when the page loads
  const pokemonName = getPokemonNameFromURL();
  if (pokemonName) {
    fetchPokemonDetails(pokemonName)
      .then(data => {
        if (data) {
          displayPokemonDetails(data);
        } else {
          pokemonDetails.innerHTML = "<p>Pokémon details not found.</p>";
        }
      })
      .catch(error => {
        console.error("Error:", error);
        pokemonDetails.innerHTML = "<p>An error occurred while fetching Pokémon details.</p>";
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