import {
    showMyWatchlist,
    removeFromWatchlist,
    getWatchlist,
    addToWatchlist,
    controlWatchlistBtns,
    getWatchBtns} 
    from './watchlist.js'
import {getViewState, setViewState} from './viewstate.js'

let viewState = getViewState()

function renderSearchResults(movie, genresList){
    // Update watchlist
    let watchlist = getWatchlist()
    // Get image path, set place holder if no image provided by API
    let moviePosterPath =""
                if(movie.poster_path){
                    moviePosterPath = `${posterBaseUrl300}${movie.poster_path}`
                }
                else{
                    moviePosterPath = "./images/poster_not_available.jpg"
                }       
    // Format the movie overview to be less than a specific length, and provide
    // a placeholder when not available
    const readMoreBtnHtml = `<p class="read-more btn-transition" data-movieid="${movie.id}" >Read More</p>`
    const movieOverview = movie.overview && movie.overview.length < charactersMaxCount 
                    ? `${movie.overview}`
                    : !movie.overview ? `Description not available for this movie.`
                    : `${movie.overview.slice(0,charactersMaxCount)}...`
    const releaseYear = movie.release_date ? movie.release_date.slice(0,4) : "N/A"
    const rating = movie.vote_average ? movie.vote_average : "N/A"
    const watchlistBtns = getWatchBtns(movie.id)
    return `
        <div class="movie-container">
            <div class="movie-text">
                <div class="movie-top-row">
                    <h3 class="movie-title">${movie.title}</h3>
                    ${watchlistBtns}
                </div>
                <p class="movie-genres">• ${genresList.join(" • ")} 
                    <span class="inline-text"> 🧲 ${rating}</span>
                    <span class="inline-text"> 📅 ${releaseYear}
                </p>
                <p class="movie-overview">${movieOverview}</p>
            </div>
            ${readMoreBtnHtml}
            <img class="movie-poster" src="${moviePosterPath}" />
        </div>
    `
}

export {renderSearchResults}