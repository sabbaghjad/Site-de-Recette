import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "./MealPlanDetailPage.css";

const MealPlanDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuthContext();
  const [recipeTitles, setRecipeTitles] = useState({});
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchMealPlanAndRecipes = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `meal-plans/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Non autorisé. Veuillez vous reconnecter.");
        } else {
          throw new Error("Une erreur s'est produite lors de la récupération du plan de repas.");
        }
      }
      const data = await response.json();
      setMealPlan(data);

      const recipeTitles = {};
      for (let day of data.mealPlan.days) {
        for (let meal of day.meals) {
          const recipeResponse = await fetch(
            process.env.REACT_APP_BACKEND_URL + `recipes/${meal.recipe}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!recipeResponse.ok) {
            if (recipeResponse.status === 404) {
              recipeTitles[meal.recipe] = "Recette non trouvée";
            } else {
              throw new Error("Une erreur s'est produite lors de la récupération de la recette.");
            }
          } else {
            const recipeData = await recipeResponse.json();
            recipeTitles[meal.recipe] = recipeData.recipe.title;
          }
        }
      }
      setRecipeTitles(recipeTitles);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchMealPlanAndRecipes();
}, [id, token]);

  const handleDeleteMealPlan = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `meal-plans/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error deleting meal plan");
      }

      window.location.href = "/profile";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mealPlanDetailPage">
      {mealPlan ? (
        <>
          <h2>{mealPlan.mealPlan.title}</h2>
          <p>Description: {mealPlan.mealPlan.description}</p>
          <h3>Plan de repas:</h3>
          <ul>
            {mealPlan.mealPlan.days &&
              mealPlan.mealPlan.days.map((day, index) => (
                <li key={index}>
                  <h4>{day.day}</h4>
                  <ul>
                    {day.meals &&
                      day.meals.map((meal, index) => (
                        <li key={index}>
                          <strong>{meal.time}:</strong>{" "}
                          {recipeTitles[meal.recipe] || "Recette inconnue"}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
          <p>
            Créé le :{" "}
            <span>
              {new Date(mealPlan.mealPlan.createdAt).toLocaleString()}
            </span>
          </p>
          <button className="deleteButton" onClick={handleDeleteMealPlan}>
            Supprimer
          </button>
        </>
      ) : (
        <p>Vous n'avez pas encore créé de plan de repas.</p>
      )}
    </div>
  );
};

export default MealPlanDetailPage;
