// Server-rendered list of saved recipes with a delete action. The create form
// lives on the same page above this list.

import { Trash2 } from "lucide-react";

import { deleteRecipeAction } from "@/features/recipes/actions";
import type { RecipeListItem } from "@/features/recipes/repo";

export function RecipeList({ recipes }: { recipes: RecipeListItem[] }) {
  if (recipes.length === 0) {
    return <p className="text-sm text-muted-foreground">No recipes yet. Create one above.</p>;
  }
  return (
    <ul className="flex flex-col gap-1.5">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5">
          <div className="flex flex-col">
            <span className="text-sm">{recipe.name}</span>
            {recipe.note && <span className="text-xs text-muted-foreground">{recipe.note}</span>}
          </div>
          <form action={deleteRecipeAction.bind(null, recipe.id)}>
            <button
              type="submit"
              aria-label="Delete recipe"
              className="flex opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
