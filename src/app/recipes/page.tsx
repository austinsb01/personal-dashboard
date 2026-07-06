import { nutritionRepo } from "@/features/nutrition/repo";
import { recipesRepo } from "@/features/recipes/repo";
import { RecipeEditor } from "@/features/recipes/components/recipe-editor";
import { RecipeList } from "@/features/recipes/components/recipe-list";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const [foods, recipes] = await Promise.all([
    nutritionRepo.listFoods(),
    recipesRepo.listRecipes(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Recipes</h1>
        <p className="text-sm text-muted-foreground">Reusable meals you can log in one tap.</p>
      </header>
      <RecipeEditor foods={foods} />
      <RecipeList recipes={recipes} />
    </div>
  );
}
