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

    parseIngredients(){
        
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];

        const newIngrediente = this.ingredients.map(el => {
            //1.- UNIFORM UNITS
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);

            });

            //2.- REMOVE PERENTHESES
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3.- PARSE INGREDIENTS INTO COUNT, UNIT AND INGREDIENTE
            const arrIng = ingredient.split(' ');
            const unitsIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng; 

            if (unitsIndex > -1) {
                // THERE IS A UNIT
                // ex.; 4 1/2  cups
                //      4 cups, arrCount is [4, 1/2] --> "4+1/2" --> 4.5 
                const arrCount = arrIng.slice(0, unitsIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitsIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitsIndex],
                    ingredient: arrIng.slice(unitsIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0],10))  {
                // THERE IS NO UNIT BUT 1ST ELEMENT IS A NUMBER
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitsIndex === -1 ) {
                // THERE IS NO UNIT AND NO NUMBER IN 1ST POSITION
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }
            
            return objIng;
        });
        this.ingredients = newIngrediente;
    }

    updateServings (type) {
        // SERVNG
        const newServings = type ==='dec' ? this.servings -1 : this.servings +1;

        // INGREDIENTS
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });            
        
        this.servings = newServings;
    }
}