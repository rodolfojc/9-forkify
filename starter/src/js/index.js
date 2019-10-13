import axios from 'axios';

async function getResult(query){
    const key = '6538421b137ce14f7fd3e0b0733aef76';
    try {
    const result = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = result.data.recipes;
    console.log(recipes);
    } catch (error) {
        alert(error);
    }
}

getResult('pasta');

