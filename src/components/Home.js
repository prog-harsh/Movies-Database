import React, { useEffect, useState } from "react";
import axios from "../axios";
import List from "./List";
import { logout, auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, loading] = useAuthState(auth);
  const [timeoutId, updateTimeoutId] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  useEffect(() => {
    async function fetchData() {
      console.log(searchTerm.length + "======");
      const res = await axios.get(searchTerm);
      const data = res.data.Search;

      if (typeof data !== "undefined") {
        setMovies(data);
      }
    }
    if (searchTerm !== "") {
      fetchData();
    }
  }, [searchTerm]);

  function onSearch(e) {
    e.preventDefault();
    const search = e.target.value;
    if (search.length === 0 || searchTerm.length === 0) {
      setMovies([]);
      setSearchTerm("");
    }
    if (!search) {
      setMovies([]);
      setSearchTerm("");
      return;
    }
    clearTimeout(timeoutId);
    const timeout = setTimeout(() => setSearchTerm(search), 500);
    updateTimeoutId(timeout);
  }
  return (
    <div>
      <form className="home_form">
        <input placeholder="Search movies" onChange={onSearch} type="text" />
        <button onClick={(e) => e.preventDefault()}>My List</button>
        <button onClick={logout}>Logout</button>
      </form>
      {movies.length === 0 ? (
        <div className="no-results">
          <h1>No results</h1>
        </div>
      ) : (
        <div>
          {movies.map((movie) => {
            return <List key={movie.imdbID} movie={movie} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
