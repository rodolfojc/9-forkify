import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * GLOBAL STATE OF THE APP
 * SEARCH OBJECT
 * CURRENT RECIPE OBJECT
 * SHOPPING LIST OBJECT
 * LIKED RECIPES
 */

const state = {}; 

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


        // 4.- SEARCH FOR RECIPES        
        await state.search.getResult();

        // 5.- RENDER RESULT ON UI
        clearLoader();
        searchView.renderResults(state.search.result);
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