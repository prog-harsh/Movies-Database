import React, { useEffect, useState } from "react";
import axios from "../axios";
import List from "./List";
import { logout, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();


  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // fetchUserName();
  }, [user, loading]);

  useEffect(() => {
    async function fetchData() {

		console.log(searchTerm.length + "======");
      const res = await axios.get(searchTerm);
      const data = res.data.results;
      //   console.log(data);
      setMovies(prevData => [...data]);
    }
    if (searchTerm !== "") {
      fetchData();
    }
  }, [searchTerm]);

  function onSearch(e) {
    e.preventDefault();
    const search = e.target.value;
    console.log(search);
    if (search.length === 0 || searchTerm.length === 0) {
      setMovies([]);
	  setSearchTerm("");
    }
    if (!search) {
		setMovies([]);
		setSearchTerm("");
      return;
    }

    // window.location.href = `/search?search=${search}`;
    setSearchTerm(search);
  }
  return (
    <div>
      <form className="home_form">
        <input placeholder="Search movies" onChange={onSearch} type="text" />
        <button onClick={logout}>Logout</button>
		<button onClick={(e) => e.preventDefault()} type="submit">
          Search
        </button>
      </form>
      <List movies={movies} />
    </div>
  );
};

export default Home;
