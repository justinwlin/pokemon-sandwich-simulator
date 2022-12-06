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

    depthFirstSearchForSandwich = (isCondimentNode: boolean) => {
        // Termination case
        // If fillings or condiments is empty terminate
        // if (this.fillings.length === 0 || this.condiments.length === 0) {
        //     return;
        // }
        // If the max amount of ingredients are hit, the terminate the search
        if (this.fillings.length >= this.maxFillings) {
            return;
        }

        if (this.condiments.length >= this.maxCondiments) {
            return;
        }

        // if the length of recipesFound is equal to the number of recipes to search for, terminate the search
        if (this.numberOfRecipesToSearchFor != "ALL" && this.recipesFound.length === this.numberOfRecipesToSearchFor) {
            return;
        }

        // Recursive case
        // Children
        if (isCondimentNode) {
            // If I am at a condiment node, then I need to try to add a condiment
            const currentCondiment = CONDIMENT[this.currentCondimentIdx]
            this.condiments.push(currentCondiment)
            console.log("Current condiment pushing: ", currentCondiment)
            console.log("Current condiments list: ", JSON.stringify(this.condiments))
            this.depthFirstSearchForSandwich(false)
            this.condiments.pop()
            this.currentCondimentIdx += 1
        } else {
            // I need to try to add a filling
            const currentFilling = FILLING[this.currentFillingIdx]
            this.fillings.push(currentFilling)
            this.depthFirstSearchForSandwich(true)
            this.fillings.pop()
            this.currentFillingIdx += 1
        }
    }

}

export const findSandwichRecipes = (typeOfPower: typeOfPower, type: typesOfPokemon,
    level: "1" | "2" | "3", maxFillings: number, maxCondiments: number, numberOfRecipesToSearchFor: number | "ALL") => {

    const searchAlgo = new SearchingForSandwich(typeOfPower, type, level, maxFillings, maxCondiments, numberOfRecipesToSearchFor, 0, 0, [], [], [], {})
    const findExistingSandwiches = searchAlgo.checkExistingSandwichEffects();

    searchAlgo.depthFirstSearchForSandwich(true)

    // const sandwichList: any[] = []
    // const existingSandwiches = checkExistingSandwichEffects(typeOfPower, type, level)
    // console.log(existingSandwiches)

    // const recipesFound: any[] = []
    // const fillings: filling[] = []
    // const condiment: condiment[] = []
    // // craftSandwich()
    // depthFirstSearchForSandwich(typeOfPower, type, level,
    //     fillings, condiment, 0, 0, maxFillings,
    //     maxCondiments, recipesFound, numberOfRecipesToSearchFor)
}