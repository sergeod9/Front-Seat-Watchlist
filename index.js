import {
    showMyWatchlist,
    removeFromWatchlist,
    getWatchlist,
    addToWatchlist,
    controlWatchlistBtns,
    getWatchBtns} 
    from './component/watchlist.js'
import {getViewState, setViewState} from './component/viewstate.js'
import {renderSearchResults} from './component/render.js'
import {readMore, renderReadMoreMovie} from './component/readmore.js'
import getCreditHtml from './component/credit.js'

const searchBtn = document.getElementById('search-btn')
const toTopBtn = document.getElementById('to-top-btn')

const myWatchlistBtn = document.getElementById('my-watchlist-btn')
const resultsReport = document.getElementById('results-report')
const nowPlayingBtn = document.getElementById('now-playing-btn')
const creditBtn = document.getElementById('credit-btn')
const topRatedBtn = document.getElementById('top-rated-btn')
const trendingBtn = document.getElementById('trending-btn')


let genresIds = []
let currentPage = 1
let currentQuery = ""

// Get a list of genres ids/names  from the API
getMoviesGenresDB()
getNowPlaying(null, currentPage)

searchBtn.addEventListener('click', handleSearch)
// Show/Hide go to top button
window.addEventListener('scroll', e=>{
    if (scrollY > 200){
        toggleVisibility(toTopBtn, true)
    }
    else{
        toggleVisibility(toTopBtn, false)
    }
})

toTopBtn.addEventListener('click',scrollToTop)
nowPlayingBtn.addEventListener('click', getNowPlaying)
topRatedBtn.addEventListener('click', getTopRated)
trendingBtn.addEventListener('click', getTrending)
myWatchlistBtn.addEventListener('click', showMyWatchlist)
creditBtn.addEventListener('click', getCredit)

function handleViewBtns(data, moviesHtml, viewType){
    if (data.total_pages > 1) moviesHtml += renderPagination(data.total_pages)
        document.getElementById('results-container').innerHTML = moviesHtml
        const pagesInput =  document.getElementById('pages-input')
        if (pagesInput){
            controlPagesInput(viewType, pagesInput)
        }
        controlWatchlistBtns()
        const readMoreBtns = document.querySelectorAll('.read-more')
        for (let btn of readMoreBtns){
            btn.addEventListener('click', (e)=> readMore(e.target.dataset.movieid))
        }
}

function handleSearch(e){
    e.preventDefault()
    // reset page unless coming from my watchlist
    if (getViewState() !== 'watchlist') currentPage = 1
    currentQuery = document.getElementById('search-input').value
    searchDB(currentQuery, currentPage)
}

function getCredit(){
    document.getElementById('results-container').innerHTML = getCreditHtml()
}
// Show 'now playing' content
function getNowPlaying(e, page){
    // if invoked by a top menu link, for instance, if going from top rated, to now playing
    // reset page input field
    if (e) {
        page = 1
        currentPage = 1
    }
    let moviesHtml = "<h2 id='now-playing-title' >Now Playing</h2>"
    resultsReport.innerHTML = ""
    setViewState('now-playing')
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`)
    .then (res => res.json())
    .then(data => {
        data.results.map(movie => {
                let movieGenres = getMovieGenres(movie)
                // Limit each movie's genres to a maximum of 3
                let genresMax3 = movieGenres.length ? movieGenres.slice(0,3) 
                    :["Genre not available"] 
                moviesHtml += renderSearchResults(movie, genresMax3)
            })
        handleViewBtns(data, moviesHtml, 'now-playing')
    })
}

// Show 'top rated' content
function getTopRated(e, page){
    if (e) {
        page = 1
        currentPage = 1
    }
    let moviesHtml = "<h2 id='top-rated-title' >Top Rated</h2>"
    resultsReport.innerHTML = ""
    setViewState('top-rated')
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`)
    .then (res => res.json())
    .then(data => {
        data.results.map(movie => {
                let movieGenres = getMovieGenres(movie)
                // Limit each movie's genres to a maximum of 3
                let genresMax3 = movieGenres.length ? movieGenres.slice(0,3) 
                    :["Genre not available"] 
                moviesHtml += renderSearchResults(movie, genresMax3)
            })
        handleViewBtns(data, moviesHtml, 'top-rated')
    })
}

//Show 'trending' content
function getTrending(e, page){
    if (e) {
        page = 1
        currentPage = 1
    }
    let moviesHtml = "<h2 id='now-playing-title' >Trending</h2>"
    resultsReport.innerHTML = ""
    setViewState('trending')
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`)
    .then (res => res.json())
    .then(data => {
        data.results.map(movie => {
                let movieGenres = getMovieGenres(movie)
                // Limit each movie's genres to a maximum of 3
                let genresMax3 = movieGenres.length ? movieGenres.slice(0,3) 
                    :["Genre not available"] 
                moviesHtml += renderSearchResults(movie, genresMax3)
            })
        // Refactor this (same exists in searchDB function)            
        handleViewBtns(data, moviesHtml, 'trending')
        // End refactor this (uptil here)
    })
}

// show search for a movie by name content
function searchDB(query, page){
    setViewState('search')
    document.getElementById('results-container').innerHTML = ""
    let moviesHtml = ""
    fetch(`${baseUrl}${searchEndPoint}?api_key=${apiKey}&language=en-US&page=${page}&include_adult=false&query=${query}`)
        .then(res => res.json())
        .then(data => {
            if (data.errors){
                resultsReport.textContent = `Nothing to show, write your keyword(s) in the search field.`
                resultsReport.classList.add('error')
                return
            }
            else{
                resultsReport.textContent = `Found ${data.total_results} movies, displayed in ${data.total_pages} pages`
                resultsReport.classList.remove('error')
            }
            data.results.map(movie => {
                let movieGenres = getMovieGenres(movie)
                // Limit each movie's genres to a maximum of 3
                let genresMax3 = movieGenres.length ? movieGenres.slice(0,3) 
                    :["Genre not available"] 
                moviesHtml += renderSearchResults(movie, genresMax3)
            })
            handleViewBtns(data, moviesHtml, 'search')
        })
        .catch(err => console.log(err))
}

function renderPagination(pages){
    const isDisabledPrev = currentPage <= 1 ? "disabled" : "" 
    const isDisabledNext = currentPage >= pages ? "disabled" : ""
    return `
        <div>    
            <label for="pages-input" id="pages-label">Page</label>
            <input id="pages-input" type="number" min=1 max=${pages} value=${currentPage} />
            <input id="prev-page-btn" type="button" value="<" ${isDisabledPrev} />    
            <input id="next-page-btn" type="button" value=">" ${isDisabledNext} />        
        </div>  

    `
}

function getPage(type, pageInput){
    currentPage = pageInput.value
    if (type === 'search') searchDB(currentQuery, currentPage)
    else if (type === 'now-playing')getNowPlaying(null, currentPage)
    else if (type === 'top-rated') getTopRated(null, currentPage)
    else if (type === 'trending') getTrending(null, currentPage)
}

function controlPagesInput(type, pagesInput){
    pagesInput.addEventListener('change', e => {
                getPage(type,pagesInput)
                })
            document.getElementById('prev-page-btn').addEventListener('click', () => {
                --currentPage
                pagesInput.value = currentPage
                getPage(type, pagesInput)
            })
            document.getElementById('next-page-btn').addEventListener('click', () => {
                ++currentPage
                pagesInput.value = currentPage
                getPage(type, pagesInput)
            })
}
// Returns a list of a movie's genres
function getMovieGenres(movie){
    let movieGenres =[]  
        // Loop through the genres of the movie          
        for (let genreId of movie.genre_ids){
            // Loop through the genres objects provided by the API list of genres
            for (let genObj of genresIds){
                if (genObj.id === genreId){
                    movieGenres.push(genObj.name)
                }
            }
        }
    return movieGenres
}

// Gets the list of genres from the API
function getMoviesGenresDB(){
    fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`)
        .then(res => res.json())
        .then(gen => {
            genresIds = gen.genres
        })
        .catch(err => console.log(err))
}

//Toggles the go to top button visibility
function toggleVisibility(element,state){
    if (state){
        element.classList.remove('hide')
    }
    else{
        element.classList.add('hide')
    }
}

function scrollToTop(){
    window.scrollTo(0,0);
}