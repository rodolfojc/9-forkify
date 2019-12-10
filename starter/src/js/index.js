import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';


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
            console.log(error);
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

         // HIGTLIGHT SELECTED SEARCH
         if (state.search) searchView.highlightSelected(id);

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

 /*
 * LIST CONTROLLER
 *
 */

const controlList = () => {

    // CREATE A NEW LIST IF THERE IN NONE YET
    if (!state.list) state.list = new List();

    // ADD EACH INGREDIENT TO THE LIST
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });



}


 // HANDELING RECIPE BUTTON CLICKS
 elements.recipe.addEventListener('click', e => {
     if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // DECREASE IS CLICK
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
       
     } else if (e.target.matches('.btn-increase, .btn-increase *')){
        // INCREASE IS CLICK
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
     } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
     }
 });

 window.l = new List();