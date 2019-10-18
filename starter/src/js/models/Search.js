import axios from 'axios';
import { key } from '../config';

export default class Search {

    constructor(query){
        this.query = query;
    }    

    async getResult(){
        //const key = '6538421b137ce14f7fd3e0b0733aef76';
            try {
                const rest = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
                this.result = rest.data.recipes;                
            } catch (error) {
                alert(error);
        }
    }

}