document.addEventListener("DOMContentLoaded", function() {
    const moveInput = document.getElementById("moveInput");
    const autocompleteDropdown = document.getElementById("autocompleteDropdown");
    const searchButton = document.getElementById("searchButton");
    const moveDetailsContainer = document.getElementById("moveDetails");
    let moveNames = []; // List to store Pokémon move names

    // Function to fetch a list of all Pokémon moves from the API
    async function fetchMoveList() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
            const data = await response.json();
            return data.results.map(result => result.name);
        } catch (error) {
            console.error("Error fetching move list:", error);
            return [];
        }
    }

    // Function to display autocomplete suggestions
    function displayAutocompleteSuggestions() {
        const searchTerm = moveInput.value.trim().toLowerCase();
        const matchedMoves = moveNames.filter(move => move.startsWith(searchTerm));
        const suggestionsHTML = matchedMoves.map(move => `<a class="dropdown-item d-block" href="#" onclick="selectMove('${move}')">${move}</a>`).join('\n');
        autocompleteDropdown.innerHTML = suggestionsHTML;
        autocompleteDropdown.classList.toggle('show', matchedMoves.length > 0);
    }

    // Function to handle selection of a move from autocomplete suggestions
    window.selectMove = function(moveName) {
        moveInput.value = moveName;
        autocompleteDropdown.classList.remove('show');
    };

    // Event listener for input in the search bar
    moveInput.addEventListener("input", displayAutocompleteSuggestions);

    // Event listener for search button click
    searchButton.addEventListener("click", handleMoveSearch);

    // Function to handle move search
    function handleMoveSearch() {
        const moveName = moveInput.value.trim().toLowerCase();
        if (moveName) {
            fetchMoveData(moveName)
                .then(data => {
                    if (data) {
                        displayMoveDetails(data);
                    } else {
                        moveDetailsContainer.innerHTML = "<p>Move details not found.</p>";
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    moveDetailsContainer.innerHTML = "<p>An error occurred while fetching move details.</p>";
                });
        }
        autocompleteDropdown.classList.remove('show');
    }

    // Function to fetch move data from the API
    async function fetchMoveData(moveName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
            if (!response.ok) {
                throw new Error('Unable to fetch move data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching move data:", error);
            return null;
        }
    }

    async function displayMoveDetails(move) {
        // Find the English entry with effect
        const englishEffectEntry = move.effect_entries.find(entry => entry.language.name === "en" && entry.effect);
    
        // If no entry with effect, find the entry with flavor text
        const englishFlavorTextEntry = move.effect_entries.find(entry => entry.language.name === "en" && entry.flavor_text);
    
        // Use effect entry if available, otherwise use flavor text entry
        const englishEntry = englishEffectEntry || englishFlavorTextEntry;
    
        function capitalizeWords(string) {
            return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
        }
    
        // Fetch the list of Pokémon that learn the move
        const pokemonWithMove = await fetchPokemonWithMove(move.name);
    
        // Capitalize the names of Pokémon in the list
        const capitalizedPokemonList = pokemonWithMove.map(pokemon => capitalizeWords(pokemon));
    
        // Sort the list of Pokémon alphabetically
        capitalizedPokemonList.sort();
    
        // Chunk the list of Pokémon into smaller arrays
        const pokemonChunks = chunkArray(capitalizedPokemonList, 5);
    
        // Construct the HTML for Pokémon that learn the move
        let pokemonListHTML = "<p><b>Pokémon that learn this move:</b></p>";
        pokemonListHTML += "<div class='row'>";
        pokemonChunks.forEach(chunk => {
            pokemonListHTML += `<div class="col-md-6"><ul>`;
            chunk.forEach(pokemon => {
                pokemonListHTML += `<li>${pokemon}</li>`;
            });
            pokemonListHTML += `</ul></div>`;
        });
        pokemonListHTML += "</div>";
    
        // Construct the move details HTML
        const moveDetailsHTML = `
            <div class="col-md-6 offset-md-3 mt-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><b>Name: </b>${capitalizeWords(move.name)}</h5>
                        <p class="card-text"><b>Type: </b>${capitalizeWords(move.type.name)}</p>
                        <p class="card-text"><b>Power: </b>${move.power || "N/A"}</p>
                        <p class="card-text"><b>Accuracy: </b>${move.accuracy || "N/A"}</p>
                        <p class="card-text">${englishEntry ? `<b>Description: </b>${englishEntry.effect || englishEntry.flavor_text}` : ''}</p>
                        <p class="card-text">${pokemonListHTML}</p>
                    </div>
                </div>
            </div>
        `;
    
        // Display the move details
        moveDetailsContainer.innerHTML = moveDetailsHTML;
    }
    
// Function to fetch Pokémon that learn a specific move
async function fetchPokemonWithMove(moveName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        if (!response.ok) {
            throw new Error("Failed to fetch move data");
        }
        const data = await response.json();
        const flattenedPokemon = data.learned_by_pokemon.flat(); // Flatten the nested array
        const pokemonWithMove = flattenedPokemon.map(pokemon => pokemon.name);
        return pokemonWithMove;
    } catch (error) {
        console.error("Error fetching Pokémon with move:", error);
        return [];
    }
}

    // Function to chunk array into smaller arrays
    function chunkArray(array, size) {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    }

    // Fetch move names when the page loads
    fetchMoveList()
        .then(data => {
            moveNames = data;
        })
        .catch(error => {
            console.error("Error fetching move list:", error);
        });
});