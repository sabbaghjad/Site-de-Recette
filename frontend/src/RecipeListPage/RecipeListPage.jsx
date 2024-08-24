import React, { useEffect, useState } from "react";
import "./RecipeListPage.css";
import RecipeDetail from "../components/RecipeDetail/RecipeDetail";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch( process.env.REACT_APP_BACKEND_URL + "recipes/");
      const donnees = await response.json();
      setRecipes(donnees.recipes);
    } catch (error) {
      console.error("Erreur avec la base de données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recipeListPage">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        recipes.map((recipe) => (
          <RecipeDetail key={recipe._id} recipe={recipe} />
        ))
      )}
    </div>
  );
};

export default RecipeListPage;