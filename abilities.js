document.addEventListener("DOMContentLoaded", function() {
    const abilityInput = document.getElementById("abilityInput");
    const autocompleteDropdown = document.getElementById("autocompleteDropdown");
    const searchButton = document.getElementById("searchButton");
    const abilityDetailsContainer = document.getElementById("abilityDetails");
    let abilityNames = []; // List to store Pokémon ability names

    // Function to fetch a list of all Pokémon abilities from the API
    async function fetchAbilityList() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/ability?limit=1000');
            const data = await response.json();
            abilityNames = data.results.map(result => result.name);
        } catch (error) {
            console.error("Error fetching ability list:", error);
        }
    }

    // Function to display autocomplete suggestions
    function displayAbilityAutocompleteSuggestions() {
        const searchTerm = abilityInput.value.trim().toLowerCase();
        const matchedAbilities = abilityNames.filter(ability => ability.startsWith(searchTerm));
        const suggestionsHTML = matchedAbilities.map(ability => `<a class="dropdown-item d-block" href="#" onclick="selectAbility('${ability}')">${ability}</a>`).join('\n');
        autocompleteDropdown.innerHTML = suggestionsHTML;
        autocompleteDropdown.classList.toggle('show', matchedAbilities.length > 0);
    }

    // Function to handle selection of an ability from autocomplete suggestions
    window.selectAbility = function(abilityName) {
        abilityInput.value = abilityName;
        autocompleteDropdown.classList.remove('show');
    };

    // Event listener for input in the search bar
    abilityInput.addEventListener("input", displayAbilityAutocompleteSuggestions);

    // Event listener for search button click
    searchButton.addEventListener("click", handleAbilitySearch);

    // Function to handle Pokémon ability search
    function handleAbilitySearch() {
        const abilityName = abilityInput.value.trim().toLowerCase();
        if (abilityName) {
            fetchAbilityData(abilityName)
                .then(data => {
                    if (data) {
                        displayAbilityDetails(data);
                    } else {
                        abilityDetailsContainer.innerHTML = "<p>Ability details not found.</p>";
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    abilityDetailsContainer.innerHTML = "<p>An error occurred while fetching ability details.</p>";
                });
        }
        // Hide autocomplete menu
        autocompleteDropdown.classList.remove('show');
    }

    // Function to fetch Pokémon ability data from the API
    async function fetchAbilityData(abilityName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
            if (!response.ok) {
                throw new Error('Unable to fetch ability data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching ability data:", error);
            return null;
        }
    }

    async function displayAbilityDetails(ability) {
        // Find the English entry with effect
        const englishEffectEntry = ability.effect_entries.find(entry => entry.language.name === "en" && entry.effect);
    
        // If no entry with effect, find the entry with flavor text
        const englishFlavorTextEntry = ability.flavor_text_entries.find(entry => entry.language.name === "en" && entry.flavor_text);
    
        // Use effect entry if available, otherwise use flavor text entry
        const englishEntry = englishEffectEntry || englishFlavorTextEntry;
    
        if (!englishEntry) {
            abilityDetailsContainer.innerHTML = "<p>No English description available for this ability.</p>";
            return;
        }
    
        function capitalizeWords(string) {
            return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
        }
    
        // Fetch the list of Pokémon with the ability
        const pokemonWithAbility = await fetchPokemonWithAbility(ability.name);
    
        // Capitalize the names of Pokémon in the list
        const capitalizedPokemonList = pokemonWithAbility.map(pokemon => capitalizeWords(pokemon));
    
        // Sort the list of Pokémon alphabetically
        capitalizedPokemonList.sort();
    
        // Chunk the list of Pokémon into smaller arrays
        const pokemonChunks = chunkArray(capitalizedPokemonList, 5);
    
        // Construct the HTML for Pokémon with the ability
        let pokemonListHTML = "<p><b>Pokémon with this ability:</b></p>";
        pokemonListHTML += "<div class='row'>";
        pokemonChunks.forEach(chunk => {
            pokemonListHTML += `<div class="col-md-6"><ul>`;
            chunk.forEach(pokemon => {
                pokemonListHTML += `<li>${pokemon}</li>`;
            });
            pokemonListHTML += `</ul></div>`;
        });
        pokemonListHTML += "</div>";
    
        // Construct the ability details HTML
        const abilityDetailsHTML = `
            <div class="col-md-6 offset-md-3 mt-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><b>Name: </b>${capitalizeWords(ability.name)}</h5>
                        <p class="card-text"><b>Description: </b>${englishEntry.effect || englishEntry.flavor_text}</p>
                        <p class="card-text">${pokemonListHTML}</p>
                    </div>
                </div>
            </div>
        `;
    
        // Display the ability details
        abilityDetailsContainer.innerHTML = abilityDetailsHTML;
    }
    
    // Function to chunk array into smaller arrays
    function chunkArray(array, size) {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    }

// Function to fetch Pokémon with the specified ability
async function fetchPokemonWithAbility(abilityName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        const data = await response.json();
        const pokemonWithAbility = data.pokemon.map(pokemon => pokemon.pokemon.name);
        return pokemonWithAbility;
    } catch (error) {
        console.error("Error fetching Pokémon with ability:", error);
        return [];
    }
}

    // Fetch Pokémon abilities when the page loads
    fetchAbilityList();
});