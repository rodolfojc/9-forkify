import axios from 'axios';
import {key} from '../config';

export default class Recipe {
    
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch (error) {
            alert('Something went wrong :( ');
        }
    }

    calcTime() {
        // ASSUMING THAT WE NEED 15 MIN FOR EACH 3 INGREDIENTS
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServing() {
        this.serving = 4;
    }

    parseIngredients (){
        
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngrediente = this.ingredients.map(el => {
            //1.- UNIFORM UNITS
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);

            });

            //2.- REMOVE PERENTHESES
            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            //3.- PARSE INGREDIENTS INTO COUNT, UNIT AND INGREDIENTE
            return ingredient;
        });
        this.ingredients = newIngrediente;
    }

}