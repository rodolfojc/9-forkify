// Global app controller

import string from './models/Search';
// 1st WAY
//import {add as a, mult as m, ID} from './views/searchView';

import * as searchView from './views/searchView';

// 1st WAY
//console.log(`Using imported functions ${a(ID, 2)} and ${m(3,5)}. ${string} `);

console.log(`Using imported functions ${searchView.add(searchView.ID, 2)} and ${searchView.mult(3,5)}. ${string} `);
