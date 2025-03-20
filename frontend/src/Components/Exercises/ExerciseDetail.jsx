import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const ExerciseDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const [exercise, setExercise] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const response = await fetch(`/api/exercises/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch exercise details");
        }
        const data = await response.json();
        console.log('Image path from API:', data.image);
        console.log('Full image URL:', `/storage/${data.image}`);
        setExercise(data);

        if (token) {
          const favResponse = await fetch("/api/favorites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (favResponse.ok) {
            const favorites = await favResponse.json();
            setIsFavorite(
              favorites.some((fav) => fav.idExercice === parseInt(id))
            );
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetails();
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`/api/exercises/${id}/favorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite status");
      }

      const result = await response.json();
      setIsFavorite(result.isFavorite);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-blue-600 font-semibold animate-pulse">
          Loading exercise details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-sm">
        Error: {error}
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg shadow-sm">
        Exercise not found.
      </div>
    );
  }

  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1].split("?")[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (url.includes("vimeo.com")) {
      const vimeoId = url.split("vimeo.com/")[1].split("?")[0];
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}`;
      }
    }

    return url;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/client/exercises"
          className="text-blue-600 hover:text-blue-800 flex items-center font-semibold"
        >
          <i className="ri-arrow-left-line mr-2"></i> Back to Exercises
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {exercise.image ? (
              <img
                className="w-full h-64 md:h-full object-cover"
                src={`http://localhost:8000/storage/${exercise.image}`}
                alt={exercise.nom}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300"; // Fallback image if the main image fails to load
                }}
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          <div className="p-8 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800">
                {exercise.nom}
              </h1>
              {token && (
                <button
                  onClick={toggleFavorite}
                  className="p-2 bg-gray-50 rounded-full shadow transition hover:scale-105"
                >
                  <i
                    className={`ri-heart-${
                      isFavorite ? "fill text-red-500" : "line text-gray-500"
                    } text-2xl`}
                  ></i>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span
                  className={`inline-block text-sm font-medium px-3 py-1 rounded ${
                    exercise.niveauDifficult === "Beginner"
                      ? "bg-green-100 text-green-700"
                      : exercise.niveauDifficult === "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {exercise.niveauDifficult}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Target Area
                </h3>
                <p className="text-gray-600">{exercise.partieCorps}</p>
                {exercise.partieCorpsPic && (
                  <img
                    src={`http://localhost:8000/storage/${exercise.partieCorpsPic}`}
                    alt="Target area"
                    className="mt-4 h-32 object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300"; // Fallback image if the body part image fails to load
                    }}
                  />
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Description
                </h3>
                <p className="text-gray-600">{exercise.description}</p>
              </div>

              {exercise.urlVido && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Instruction Video
                  </h3>
                  <div className="relative pt-[56.25%] mt-4">
                    <iframe
                      className="absolute inset-0 w-full h-full rounded shadow"
                      src={convertToEmbedUrl(exercise.urlVido)}
                      title={`${exercise.nom} video`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;