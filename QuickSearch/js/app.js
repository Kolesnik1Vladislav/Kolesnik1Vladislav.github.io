// Setup variables from html data
const search    = document.getElementById('search');
const matchList = document.getElementById('match-list');

// Search Voivodeships from data.json and filter them
    const searchPlaces = async searchText => {
    const res      = await fetch('../data/data.json');
    const voivode  = await res.json();

    // Get matches to current input 
    let matches = voivode.filter(state => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return state.name.match(regex) || state.abbr.match(regex);
    });

    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = '';
    }

    outputHtml(matches);
}

// Display in UI our matches
const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches.map(match => `
            <div class="card card-body mb-1">
                <h4>${match.name} (${match.abbr}) <span class="text-success">${match.capital}</span></h4>
                <small>Latitude: ${match.lat} / Long: ${match.long}</small>
            </div>
        `).join('');

        matchList.innerHTML = html;
    }
}

// Response to user request 
search.addEventListener('input', () => searchPlaces(search.value));