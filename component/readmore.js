import {setViewState} from './viewstate.js'
import {
    showMyWatchlist,
    removeFromWatchlist,
    getWatchlist,
    addToWatchlist,
    controlWatchlistBtns,
    getWatchBtns} 
    from './watchlist.js'

function readMore(movieId){
    setViewState('read-more-movie')
    fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`)
        .then(res => res.json())
        .then(movie => {
            getPeople(movie)
        })
}

function renderReadMoreMovie(movie, actors){
    // console.log(movie)
    let PosterFullPath = ""
    window.scrollTo(0,200);
    if(movie.poster_path){
        PosterFullPath = `${posterBaseUrl600}${movie.poster_path}`
    }
    else{
        PosterFullPath = "./images/poster_not_available.jpg"
    }  
    
    const movieGenres = movie.genres.length > 0 
        ? movie.genres.map(genre => genre.name)
        : ["N/A"]  
    const movieReleaseArray = movie.release_date.split("-")
    const movieReleaseDate = movieReleaseArray.length > 0 
        ?`
            ${movieReleaseArray[2]} - ${movieReleaseArray[1]} - ${movieReleaseArray[0]}
        `
        : "N/A"
    const movieRating = movie.vote_average ? movie.vote_average : "N/A"
    const movieBudget = movie.budget ? movie.budget : "N/A"
    const movieLanguages = movie.spoken_languages.length
        ? movie.spoken_languages.map(lang => lang.english_name) 
        : ["N/A"]
    const productionCompanies = movie.production_companies.length
        ? movie.production_companies.map(company => company.name)
        : ["N/A"]
    const watchListBtns = getWatchBtns(movie.id)    

    let actorsHtml=""
    
    // console.log(directorHtml)
    for (let actor of actors){
        if ( actor.character && actor.character !== "Director") actor.character = `as ${actor.character}`
        actorsHtml += `
            <div class="actor">
                <h3>${actor.name}</h3>
                <p>${actor.character}</p>
                <img src="${actor.image}" alt="${actor.name} portrait photo" />
            </div>
        `
    }

    const movieHtml = `
        <div id="read-more-movie-container" >
            <div class="movie-read-more-header" >
                <div>
                    <h2 class="movie-read-more-title">${movie.title}</h2>
                    <h3>${movie.tagline} </h3>
                    <p>Genres: <span>• ${movieGenres.join(" • ")}</span></p>
                    <p>Realease Date: <span>${movieReleaseDate}</span></p> 
                    <p>Rating: <span>${movieRating}</span></p>
                    <p>Budget: <span>${movieBudget}</span></p>
                    <p>Original Languages: <span>• ${movieLanguages.join(" • ")}</p>
                    <p>Production: <span>• ${productionCompanies.join(" • ")}</span>
                    <p>Overview: <span>${movie.overview}</span></p>
                    ${watchListBtns}
                </div>
                <img src="${PosterFullPath}" />
            </div> 
        </div>
        <div id="people-container">
            <div id="actors-container">
                ${actorsHtml}
            </div>
        </div>        
    `
    // console.log(movie)
    document.getElementById('results-container').innerHTML = (movieHtml)
    controlWatchlistBtns()
}

function getPeople(movie){
    fetch(`${baseUrl}/movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`)
        .then(res => res.json())
        .then(people => {
            const actors =[]
            let director =""
            let cast = people.cast.filter(person => person.popularity > 5)
            // console.log(people.cast)
           
            for (let person of cast){ 
                let personCharacter = person.character ? person.character : "N/A"
                let personImage = person.profile_path 
                    ? `${posterBaseUrl300}${person.profile_path} `
                    : "./images/poster_not_available.jpg"
                actors.push({
                    name: person.name, 
                    character: person.character, 
                    image: `${personImage} `
                })
                
            }
            // console.log(actors)
            let directorFromDB = people.crew.filter(person => person.job ==="Director")
            let directorImagePath =""
            if (directorFromDB[0] && directorFromDB[0].profile_path){
                directorImagePath = `${posterBaseUrl300}${directorFromDB[0].profile_path}`
            }
            else{
                directorImagePath = "./images/poster_not_available.jpg"
            }
            if (directorFromDB[0]){
                director = {name: directorFromDB[0].name, character: "Director", image: directorImagePath}
                // console.log(`Direcotr: ${director.name}, image: ${director.image}`)
                actors.unshift(director)
            }
            renderReadMoreMovie(movie,actors.slice(0,20))            
        })
        .catch(err => console.log(err))
}

export {readMore, renderReadMoreMovie, }