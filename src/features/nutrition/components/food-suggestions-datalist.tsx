// Shared datalist of catalog food names, referenced by an input's list={id} for
// food-name autocomplete. Used by the meal log form and the recipe editor.

export function FoodSuggestionsDatalist({
  id,
  foods,
}: {
  id: string;
  foods: { name: string }[];
}) {
  return (
    <datalist id={id}>
      {foods.map((food) => (
        <option key={food.name} value={food.name} />
      ))}
    </datalist>
  );
}
