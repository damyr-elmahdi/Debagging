import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const ClientExerciseList = () => {
  const { token } = useContext(AppContext);
  const [exercises, setExercises] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchExercises();
    fetchFavorites();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch("/api/exercises");
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch exercises: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched exercises:", data);
      setExercises(data);
    } catch (error) {
      console.error("Error in fetchExercises:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched favorites:", data);

      // Extract just the favorite exercise IDs
      const favoriteIds = data.map((exercise) => exercise.idExercice);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await fetch(`/api/exercises/${id}/favorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to toggle favorite");
      }

      // Update favorites state
      if (data.isFavorite) {
        setFavorites([...favorites, id]);
      } else {
        setFavorites(favorites.filter((favoriteId) => favoriteId !== id));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Filter exercises based on selected filter
  const filteredExercises =
    filter === "all"
      ? exercises
      : filter === "favorites"
      ? exercises.filter((exercise) => favorites.includes(exercise.idExercice))
      : exercises.filter((exercise) => exercise.partieCorps === filter);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 text-red-700">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Exercise Library</h2>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All Exercises
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "favorites" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("favorites")}
          >
            My Favorites
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "Arms" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("Arms")}
          >
            Arms
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "Legs" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("Legs")}
          >
            Legs
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "Chest" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("Chest")}
          >
            Chest
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "Back" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("Back")}
          >
            Back
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "Core" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("Core")}
          >
            Core
          </button>
        </div>
      </div>

      {filteredExercises.length === 0 ? (
        <p>No exercises found for the selected filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.idExercice}
              className="border rounded p-4 shadow-sm"
            >
              <div className="aspect-video bg-gray-200 mb-2">
                {exercise.image && (
                  <img
                    src={`http://localhost:8000/storage/${exercise.image}`}
                    alt={exercise.nom}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300"; // Fallback image
                    }}
                  />
                )}
              </div>
              <h3 className="text-lg font-bold">{exercise.nom}</h3>
              <p className="text-gray-600 mb-2">
                Difficulty: {exercise.niveauDifficult}
              </p>
              <p className="text-gray-600 mb-2">
                Body Part: {exercise.partieCorps}
              </p>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => toggleFavorite(exercise.idExercice)}
                  className={`flex items-center ${
                    favorites.includes(exercise.idExercice)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  <i
                    className={`ri-heart-${
                      favorites.includes(exercise.idExercice) ? "fill" : "line"
                    } text-xl mr-1`}
                  ></i>
                  {favorites.includes(exercise.idExercice)
                    ? "Favorited"
                    : "Add to Favorites"}
                </button>
                <Link
                  to={`/client/exercises/${exercise.idExercice}`}
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientExerciseList;