document.addEventListener("DOMContentLoaded", function() {
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
  
    // Function to get Pokémon name from URL query parameter
    function getPokemonNameFromURL() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      return urlParams.get('name');
    }
  
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
  });