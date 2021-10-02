import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import TutorialDataService from "../services/TutorialService";

const TutorialsList = () => {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");
  const queryClient = useQueryClient();
  const { data, error, isSuccess } = useQuery(
    "retrieveTutorials",
    TutorialDataService.getAll
  );
  const {
    data: searchData,
    error: searchError,
    isSuccess: searchIsSuccess,
    refetch: refetchSearch,
  } = useQuery(
    ["findByTitle", searchTitle],
    () => TutorialDataService.findByTitle(searchTitle),
    {
      enabled: false,
    }
  );
  const { mutate } = useMutation(TutorialDataService.removeAll, {
    onSuccess: () => {
      queryClient.invalidateQueries("retrieveTutorials");
      refreshList();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const retrieveTutorials = useCallback(() => {
    if (isSuccess && data) {
      console.log(data.data);
      setTutorials(data.data);
    } else {
      console.log(error);
    }
  }, [data, error, isSuccess]);

  useEffect(() => {
    retrieveTutorials();
  }, [retrieveTutorials]);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveTutorials();
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const removeAllTutorials = () => {
    mutate();
  };

  const findByTitle = () => {
    refetchSearch();
    if (searchIsSuccess && searchData) {
      setTutorials(searchData.data);
    } else {
      console.log(searchError);
    }
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Tutorials List</h4>

        <ul className="list-group">
          {tutorials &&
            tutorials.map((tutorial, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTutorial(tutorial, index)}
                key={index}
              >
                {tutorial.title}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllTutorials}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentTutorial ? (
          <div>
            <h4>Tutorial</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentTutorial.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentTutorial.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentTutorial.published ? "Published" : "Pending"}
            </div>

            <Link
              to={"/tutorials/" + currentTutorial.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsList;
