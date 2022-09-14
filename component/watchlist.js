import {getViewState, setViewState} from './viewstate.js'
import {renderSearchResults} from './render.js'
import {readMore, renderReadMoreMovie} from './readmore.js'


let viewState = getViewState()

let watchlist = JSON.parse(localStorage.getItem('watchlist'))

function getWatchBtns(movieId){
    // watchlist = JSON.parse(localStorage.getItem('watchlist'))
    getWatchlist()
    const watchBtnStatus = watchlist && watchlist.includes(String(movieId)) ? 'hide' : ''
    const removeBtnStatus = !watchlist || !watchlist.includes(String(movieId)) ? 'hide' : ''
    const watchBtnHtml = `
        <p 
            class= "movie-btn-watchlist btn-transition ${watchBtnStatus}" 
            data-movieid= "${movieId}"
            data-state="add"
            >${addToWatchlistText}
        </p>
        `
    const removeBtnHtml = `
        <p
            class= "movie-btn-watchlist btn-transition ${removeBtnStatus}" 
            data-movieid= "${movieId}"
            data-state="remove"
            >${removeFromWatchlistText}
        </p>
        `
    // console.log(getViewState())
    if (getViewState() === 'watchlist') {
        return `${removeBtnHtml}`
    }
    return `${watchBtnHtml}${removeBtnHtml}`
}

function controlWatchlistBtns(){
    const watchListButtons = document.querySelectorAll('.movie-btn-watchlist')    
    for (let btn of watchListButtons){
        if (btn.dataset.state === "add"){
        btn.addEventListener('click', e => addToWatchlist(e.target, e.target.dataset.movieid))
        }
        else{
            btn.addEventListener('click', e => removeFromWatchlist(e.target, e.target.dataset.movieid))
        }
    }
}

function addToWatchlist(watchBtn, movieId){
    watchBtn.nextElementSibling.classList.remove('hide')
    watchBtn.classList.add('hide')
    if (watchlist){
        if(!watchlist.includes(movieId)){
            watchlist.push(movieId)
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
        }
    }
    else{
        localStorage.setItem('watchlist', JSON.stringify([movieId]))
        watchlist = JSON.parse(localStorage.getItem('watchlist'))
    }
}

function getWatchlist(){
    watchlist = JSON.parse(localStorage.getItem('watchlist'))
}


function removeFromWatchlist(removeBtn, movieId){
    removeBtn.previousElementSibling.classList.remove('hide')
    removeBtn.classList.add('hide')
    if (watchlist.includes(String(movieId))){
        let newArr = watchlist.filter(movie_id => movie_id !== movieId)
        watchlist = [...newArr] 
        if (watchlist.length > 0) localStorage.setItem('watchlist', JSON.stringify(watchlist))
        else (localStorage.removeItem('watchlist'))
    }
    if (getViewState() === "watchlist") showMyWatchlist()    
}


function showMyWatchlist(currentViewState){
    setViewState('watchlist')
    // console.log(getViewState())
    currentViewState = getViewState()
    watchlist = JSON.parse(localStorage.getItem('watchlist'))
    if (watchlist){
        document.getElementById('results-container').innerHTML =""
        for (let movieId of watchlist){
            fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`)
                .then(res => res.json())
                .then(movieObj => {
                    let movieGenres = movieObj.genres.map(genreObj => genreObj.name)
                // Limit each movie's genres to a maximum of 3
                    let genresMax3 = movieGenres.length ? movieGenres.slice(0,3) 
                        :["Genre not available"]
                    document.getElementById('results-container').innerHTML += renderSearchResults(movieObj,genresMax3) 
                    const watchListButtons = document.querySelectorAll('.movie-btn-watchlist')
                    for (let btn of watchListButtons){
                        btn.addEventListener('click', e => removeFromWatchlist(e.target, e.target.dataset.movieid))        
                    }
                    const readMoreBtns = document.querySelectorAll('.read-more')
                    for (let btn of readMoreBtns){
                        btn.addEventListener('click', (e)=> readMore(e.target.dataset.movieid))
                    }
                })
                .catch(err => console.log(err))
        }
    }
    else{
        document.getElementById('results-container').innerHTML = "<h3>Your watchlist is empty, let's add some movies</h3>"
    }
}

export {showMyWatchlist, removeFromWatchlist, getWatchlist, addToWatchlist, controlWatchlistBtns, getWatchBtns}