// Movie Class: Represents a Movie
class Movie {
    constructor(movieTitle, movieDirector, releaseDate) {
        this.movieTitle = movieTitle;
        this.movieDirector = movieDirector;
        this.releaseDate = releaseDate;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayMovies() {

        const movies = Store.getMovies();

        movies.forEach((movie)=> {
            UI.addMovieToList(movie);
        })
    }

    static addMovieToList(movie) {
        const list = document.querySelector('#movie-list');

        const row = document.createElement('tr')
        row.classList.add('align-middle')
        row.innerHTML = `
        <td>${movie.movieTitle}</td>
        <td>${movie.movieDirector}</td>
        <td>${movie.releaseDate}</td>
        <td><i class="fa-regular fa-trash-can btn-lg delete"></i></td>
        `;

        list.appendChild(row);
    }

    static deleteMovieFromList(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static submit() {
        const movieTitle = document.querySelector('#movie-title').value;
        const movieDirector = document.querySelector('#movie-director').value;
        const releaseDate = document.querySelector('#release-date').value;

        if(movieTitle === "" || movieDirector === "" || releaseDate === "") {
            UI.showAlert("Please fill in all fields", "danger");
        } else {
            let movie = new Movie(movieTitle, movieDirector, releaseDate);
            UI.addMovieToList(movie);
            Store.addMovie(movie);
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#movie-form');
        container.insertBefore(div, form);

        // Remove after 3 seconds
        setTimeout(()=> {
            document.querySelector('.alert').remove()}, 3000)
    }

    static clearFields() {
        document.querySelector('#movie-title').value = "";
        document.querySelector('#movie-director').value = "";
        document.querySelector('#release-date').value = "";
    }
}

// Store Class: Handles Storage in Browser
class Store {
    static getMovies() {
        let movies;
        if(localStorage.getItem('movies') === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem('movies'));
        }

        return movies;
    }

    static addMovie(movie) {
        const movies = Store.getMovies();
        movies.push(movie);
        localStorage.setItem('movies', JSON.stringify(movies))
    }

    static deleteMovie(movieTitle, releaseDate) {
        const movies = Store.getMovies();
        movies.forEach((movie, index)=>{
            if(movie.movieTitle === movieTitle && movie.releaseDate === releaseDate) {
                movies.splice(index, 1);
            }
        });
        localStorage.setItem('movies', JSON.stringify(movies))
    }
}

// Event: Display Movies
document.addEventListener('DOMContentLoaded', UI.displayMovies);

// Event: Add a Movie
document.querySelector('#movie-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    UI.submit();

    // Show success message
    UI.showAlert("Movie has been added", "success");
    
    // Clear Fields
    UI.clearFields();
})

// Event: Remove a Movie
document.querySelector('#movie-list').addEventListener('click', (e)=>{
    // Remove movie from UI
    UI.deleteMovieFromList(e.target);

    // Remove movie from local storage
    const releaseDate = e.target.parentElement.previousElementSibling.textContent;
    const movieTitle = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    Store.deleteMovie(movieTitle, releaseDate);

    // Show success message
    UI.showAlert("Movie has been removed", "success")
})
