import { craftSandwich } from './../util';
import EXISTING_SANDWICHES from '../data/sandwiches.json';
import FILLING from '../data/fillings.json';
import CONDIMENT from '../data/condiments.json';

class SearchingForSandwich {
    // Constructor
    constructor(
        // The type of power looking for
        public typeOfPower: typeOfPower,
        // The type of the pokemon applying to. Empty string is due to powers that don't apply such as egg power.
        public type: typesOfPokemon,
        // Level of the power looking for
        public level: "1" | "2" | "3",
        // The max amount of fillings to use
        public maxFillings: number,
        // The max amount of condiments to use
        public maxCondiments: number,
        // The number of recipes to search for
        public numberOfRecipesToSearchFor: number | "ALL",
        // The current amount of fillings
        public currentFillingIdx: number,
        // The current amount of condiments
        public currentCondimentIdx: number,
        // The current list of fillings
        public fillings: filling[],
        // The current list of condiments
        public condiments: condiment[],
        // The list of recipes found
        public recipesFound: any[],
        // a hashmap of already checked combinations of fillings and condiments
        public alreadyChecked: { [key: string]: boolean }
    ) {
        this.typeOfPower = typeOfPower
        this.type = type
        this.level = level
        this.maxFillings = maxFillings
        this.maxCondiments = maxCondiments
        this.numberOfRecipesToSearchFor = numberOfRecipesToSearchFor
        this.currentFillingIdx = currentFillingIdx
        this.currentCondimentIdx = currentCondimentIdx
        this.fillings = fillings
        this.condiments = condiments
        this.recipesFound = recipesFound
        this.alreadyChecked = {}
    }

    // Methods
    checkExistingSandwichEffects = () => {
        return EXISTING_SANDWICHES.filter((sandwich) => {
            for (const effect of sandwich.effects) {
                if (effect.name === this.typeOfPower && effect.level === this.level && effect.type === this.type) {
                    return true
                }
            }
        })
    }

}

export const findSandwichRecipes = (typeOfPower: typeOfPower, type: typesOfPokemon,
    level: "1" | "2" | "3", maxFillings: number, maxCondiments: number, numberOfRecipesToSearchFor: number | "ALL") => {

    const searchAlgo = new SearchingForSandwich(typeOfPower, type, level, maxFillings, maxCondiments, numberOfRecipesToSearchFor, 0, 0, [], [], [], {})
    const findExistingSandwiches = searchAlgo.checkExistingSandwichEffects();
    console.log(findExistingSandwiches)
}