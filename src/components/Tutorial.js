import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";

import TutorialDataService from "../services/TutorialService";

const Tutorial = (props) => {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
  };
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [message, setMessage] = useState("");
  const { data } = useQuery(
    ["getTutorial", props.match.params.id],
    () => TutorialDataService.get(props.match.params.id)
  );
  const { mutate: mutateUpdate } = useMutation(TutorialDataService.update);
  const { mutate: mutateDelete } = useMutation(TutorialDataService.remove, {
    onSuccess: () => {
      props.history.push("/tutorials");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if(data) {
      setCurrentTutorial(data.data);
    }
  }, [data]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updatePublished = (status) => {
    var data = {
      id: currentTutorial.id,
      title: currentTutorial.title,
      description: currentTutorial.description,
      published: status,
    };

    mutateUpdate({ id: currentTutorial.id, data: data }, {
      onSuccess: () => {
        setCurrentTutorial({ ...currentTutorial, published: status });
      },
      onError: (err) => {
        console.log(err);
      }
    })
  };

  const updateTutorial = () => {
    mutateUpdate({ id: currentTutorial.id, data: currentTutorial }, {
      onSuccess: (response) => {
        console.log(response.data);
        setMessage("The tutorial was updated successfully!");
      },
      onError: (err) => {
        console.log(err);
      }
    })
  };

  const deleteTutorial = () => {
    mutateDelete(currentTutorial.id);
  };

  return (
    <div>
      {currentTutorial ? (
        <div className="edit-form">
          <h4>Tutorial</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTutorial.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTutorial.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentTutorial.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentTutorial.published ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={deleteTutorial}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateTutorial}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
