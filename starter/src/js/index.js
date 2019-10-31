import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe'

/**
 * GLOBAL STATE OF THE APP
 * SEARCH OBJECT
 * CURRENT RECIPE OBJECT
 * SHOPPING LIST OBJECT
 * LIKED RECIPES
 */

const state = {};

/**
 * 
 * SEARCH CONTROLLER
 * 
 */

const controlSearch = async() => {

    // 1.- GET THE QUERY FROM THE VIEW
    const query = searchView.getInput();
    
    if (query) {
        // 2.- NEW SEARCH OBJECT AND ADD STATE
        state.search = new Search(query);

        // 3.- PREPARE UI FOR RESULT
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4.- SEARCH FOR RECIPES        
            await state.search.getResult();

            // 5.- RENDER RESULT ON UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch (error) {
            alert('Something went wrong!!!');
            clearLoader();
        }
    }


}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{
    const button = e.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);        
    }
    
});

/**
 * 
 * RECIPE CONTROLLER
 *  
 */

 const controlRecipe = async () => {

    // GET ID FROM URL
     const id = window.location.hash.replace('#','');
     console.log(id);

     if (id) {
         // PREPARE UI FOR CHANGES
         recipeView.clearRecipe();
         renderLoader(elements.recipe);
         
         // CREATE NEW RECIPE OBJECT
         state.recipe = new Recipe(id);

         // FOR TESTING //
         window.r = state.recipe;

         try{
            // CREATE NEW RECICPE OBJEC AND 
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // GET RECIPE DATA
            state.recipe.calcTime();
            state.recipe.calcServing();
            
            // RENDER RECIPE
            clearLoader();
            console.log(state.recipe);
            recipeView.renderRecipe(state.recipe);


         }catch (error) {
             alert('Error processing recipe!!');
             console.log(error);
         }

     }
 }

 window.addEventListener('hashchange', controlRecipe);
 //window.addEventListener('load', controlRecipe);

 //['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));