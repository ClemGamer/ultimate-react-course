import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const OMDB_KEY = "1ddb503d";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState(null);

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return storedValue ? JSON.parse(storedValue) : [];
  // });
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((cur) =>
      cur.some((v) => v.imdbID === movie.imdbID) ? cur : [...cur, movie]
    );
  }

  function handleDeleteWatched(id) {
    setWatched((cur) => cur.filter((v) => v.imdbID !== id));
  }

  const { movies, isLoading, error } = useMovies(query);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              id={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              key={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetail({ id, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const watchedMovie = watched.find((v) => v.imdbID === id);
  const countRef = useRef(watchedMovie?.userCountDecision || 0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const {
    Title: title,
    Director: director,
    Poster: poster,
    Genre: genre,
    Plot: plot,
    imdbRating,
    Released: released,
    Runtime: runtime,
    Actors: actors,
  } = movie;

  useEffect(
    function () {
      async function getMovieDetail() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${id}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }

      getMovieDetail();
    },
    [id]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useKey("Escape", onCloseMovie);

  function handleAdd() {
    const newWatched = {
      imdbID: id,
      title,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating,
      userRating,
      userCountDecision: countRef.current,
    };
    onAddWatched(newWatched);
    onCloseMovie();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
                defaultRating={watchedMovie?.userRating ?? 0}
                displayOnly={watchedMovie}
              />
              {userRating > 0 && !watchedMovie && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function ToggleButton({ isOn, onClick }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {isOn ? "–" : "+"}
    </button>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ToggleButton isOn={isOpen} onClick={() => setIsOpen((open) => !open)} />
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        X
      </button>
    </li>
  );
}
