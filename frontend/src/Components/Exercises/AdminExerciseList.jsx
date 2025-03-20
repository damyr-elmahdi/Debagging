import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/exercises", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete exercise");
      }

      // Remove the deleted exercise from state
      setExercises(exercises.filter((exercise) => exercise.idExercice !== id));
      alert("Exercise deleted successfully");
    } catch (error) {
      console.error("Error deleting exercise:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading exercises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Exercises</h2>
        <Link
          to="/admin/exercises/create"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Create New Exercise
        </Link>
      </div>

      {exercises.length === 0 ? (
        <p>No exercises found. Create your first exercise!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
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
              <div className="flex space-x-2 mt-2">
                <Link
                  to={`/admin/exercises/edit/${exercise.idExercice}`}
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(exercise.idExercice)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminExerciseList;