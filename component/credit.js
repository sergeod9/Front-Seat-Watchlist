function getCreditHtml(){
    return `
        <div id="credit-container">
            <h2 class="credit-title">Front Seat Watchlist:</h2>
            <p class="credit-text within-paragraph">
                Hello, my name is Georges Dahdouh, I made Front Seat app as a solo project in the 
                process of learning about restful APIs, and asynchronus Javascript. 
                As a user, you can search for your favorite movies, or check what's trending, what's playing now in theater's, and top rated movies, and save them to your watchlist.
            </p>
            <p class="credit-text within-paragraph">
                Your watchlist is saved in your browser, in the localstorage, Front Seat doesn't have a backend database. You can add, or remove titles to and from your watchlist, and you can click "read more" to find out more about the movie.
            </p>
            <p class="credit-text">this project is a part of the Front-End Career Path, module #9 in <a href="https://www.scrimba.com">Scrimba.com</a>, 
                instructed by Bob Ziroll.
            </p>
            <h2 class="credit-title">Development</h2>
            <p class="credit-text within-paragraph">
                Front Seat is developed using:
            </p>
            <ul>
                <li>HTML 5</li>
                <li>CSS 3</li>
                <li>Javascript</li>
            </ul>
            <h2 class="credit-title">Resources</h2>
            <p class="credit-text within-paragraph">Missing poster placeholder image: <a href="https://unsplash.com/@anikamikkelson">https://unsplash.com/@anikamikkelson</a></p>
            <p class="credit-text within-paragraph">Hero image: <a href="https://unsplash.com/@tjump"> https://unsplash.com/@tjump </a></p>
            <p class="credit-text within-paragraph">And finally, this app wouldn't have been possible to make without the generous 
            free plan provided by: <a href="https://www.themoviedb.org/">themoviedb.org</a>, themoviedb.org provides all the data about the movies presented in Front Seat.</p>
        </div>
    `
}

export default getCreditHtml