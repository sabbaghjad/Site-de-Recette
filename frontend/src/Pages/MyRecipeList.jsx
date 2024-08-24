import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeDetail from "../components/RecipeDetail/RecipeDetail";
import SideBar from "../components/SideBar/SideBar";
import { useAuthContext } from "../hooks/useAuthContext";
import useFetch from "../hooks/useFetch";

export default function MyRecipeList() {
  const { user, token } = useAuthContext();
  const [recipes, setRecipes] = useState([]);

  const { data, error } = useFetch( process.env.REACT_APP_BACKEND_URL + "recipes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (data && data.recipes) {
      const userRecipes = data.recipes.filter(
        (recipe) => recipe.createdBy === user._id
      );
      setRecipes(userRecipes);
    }
    if (error) {
      console.error(error);
    }
  }, [data, user]);

  return (
    <div>
      <SideBar />
      <div className="recipeListPage" style={{ marginLeft: "250px" }}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeDetail recipe={recipe} key={recipe._id} />
          ))
        ) : (
          <>
          <div>Vous n'avez pas de recette ! Créez en une ici : <Link to="/RecipeFormPage">Ajouter une recette</Link></div>
          </>
        )}
      </div>
    </div>
  );
}
