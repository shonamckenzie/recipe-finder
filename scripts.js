const recipeEndpoint = 'http://www.recipepuppy.com/api/';
// cors proxy - don't use with sensitive data
const proxy = 'https://cors-anywhere.herokuapp.com/';
const form = document.querySelector('form.search');
const ingredForm = document.querySelector('form.ingredientsSearch');
const recipesGrid = document.querySelector('.recipes');
const listTitle = document.querySelector('.list');
const image = document.querySelector('.mainImage');

async function fetchRecipes(query) {
  // get response
  const response = await fetch(`${proxy}${recipeEndpoint}?q=${query}`);
  // turn to json
  const data = await response.json();
  return data;
}

async function fetchRecipesByIngredient(ingredients) {
  // get response
  const response = await fetch(`${proxy}${recipeEndpoint}?i=${ingredients}`);
  // turn to json
  const data = await response.json();
}

async function handleSubmit(event) {
  event.preventDefault();
  const el = event.currentTarget;
  fetchAndDisplay(form.query.value);
}

async function fetchAndDisplay(query) {
  // turn the form off
  form.submit.disabled = true;
  // submit the search
  const recipes = await fetchRecipes(query);
  form.submit.disabled = false;
  form.reset();
  listTitle.textContent = `${query.replace(/[ ]*,[ ]*|[ ]+/g, ' & ')} recipes`;
  displayRecipes(recipes.results);
  image.hidden = true;
}

async function fetchAndDisplayIngreds(ingredients) {
  // turn the form off
  ingredForm.submit.disabled = true;
  // submit the search
  const recipes = await fetchRecipes(ingredients);
  ingredForm.submit.disabled = false;
  ingredForm.reset();
  listTitle.textContent = `${ingredients.replace(/[ ]*,[ ]*|[ ]+/g, ' & ')} recipes`;
  displayRecipes(recipes.results);
}

function displayRecipes(recipes) {
  const html = recipes.map(
    recipe => `
    <div class="recipe">
      <h2>${recipe.title}</h2>
      ${
        recipe.thumbnail
          ? `<img src="${recipe.thumbnail}" alt="${recipe.title}"/>`
          : ''
      }
      <p>${recipe.ingredients}</p> 
      <a href="${recipe.href}">View Recipe</a>
    </div> `
  );
  // add to page, use join otherwise would be separarted by commas
  recipesGrid.innerHTML = html.join(' ');
}

form.addEventListener('submit', handleSubmit);
ingredForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const el = event.currentTarget;
  fetchAndDisplayIngreds(ingredForm.ingredients.value);
});
