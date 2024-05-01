document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const pokemonList = document.getElementById("pokemonList");
  
    // Function to fetch Pokémon data from the API
    async function fetchPokemonData() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        return [];
      }
    }
  
    // Function to display Pokémon in the UI
    function displayPokemon(pokemonArray) {
      pokemonList.innerHTML = "";
      pokemonArray.forEach(pokemon => {
        const pokemonCard = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${pokemon.name}</h5>
              </div>
            </div>
          </div>
        `;
        pokemonList.innerHTML += pokemonCard;
      });
    }
  
    // Function to filter Pokémon based on search input
    function filterPokemon(searchTerm) {
      const filteredPokemon = pokemonData.filter(pokemon => pokemon.name.includes(searchTerm.toLowerCase()));
      displayPokemon(filteredPokemon);
    }
  
    // Event listener for search input
    searchInput.addEventListener("input", function() {
      const searchTerm = searchInput.value.trim();
      filterPokemon(searchTerm);
    });
  
    // Fetch Pokémon data when the page loads
    let pokemonData = [];
    fetchPokemonData()
      .then(data => {
        pokemonData = data;
        displayPokemon(pokemonData);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });