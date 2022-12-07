import {
  craftSandwich,
  getIngredientsSums,
  presetSandwichExists,
} from './../util';
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
    public level: '1' | '2' | '3',
    // The max amount of fillings to use
    public maxFillings: number,
    // The max amount of condiments to use
    public maxCondiments: number,
    // The number of recipes to search for
    public numberOfRecipesToSearchFor: number | 'ALL',
    // The current list of fillings
    public fillings: filling[],
    // The current list of condiments
    public condiments: condiment[],
    // The list of recipes found
    public recipesFound: any[],
    // a hashmap of already checked combinations of fillings and condiments
    public alreadyChecked: { [key: string]: boolean },
    // public visited max times already
    public alreadyVisitedIngredient: { [key: string]: number }
  ) {
    this.typeOfPower = typeOfPower;
    this.type = type;
    this.level = level;
    this.maxFillings = maxFillings;
    this.maxCondiments = maxCondiments;
    this.numberOfRecipesToSearchFor = numberOfRecipesToSearchFor;
    this.fillings = fillings;
    this.condiments = condiments;
    this.recipesFound = recipesFound;
    this.alreadyChecked = {};
    this.alreadyVisitedIngredient = {};
  }

  // Methods
  checkExistingSandwichEffects = () => {
    return EXISTING_SANDWICHES.filter((sandwich) => {
      for (const effect of sandwich.effects) {
        if (
          effect.name === this.typeOfPower &&
          effect.level === this.level &&
          effect.type === this.type
        ) {
          return true;
        }
      }
    });
  };

  checkIfSandwichMatches = (sandwich: craftedSandwich) => {
    const effects = sandwich.effects;
    // Check if any of the effects match the type of power, level, and type
    for (const effect of effects) {
      if (
        effect.name === this.typeOfPower &&
        effect.level === this.level &&
        effect.type === this.type
      ) {
        return true;
      }
    }

    return false;
  };

  depthFirstSearchForSandwich = (
    condimentIdx: number,
    fillingIdx: number,
    addCondiment: boolean
  ) => {
    // Termination case
    // If condimentIdx or fillingIdx is greater than the length of the condiments or fillings, terminate the search
    if (condimentIdx >= CONDIMENT.length || fillingIdx >= FILLING.length) {
      return;
    }
    // If the max amount of ingredients are hit, the terminate the search
    if (
      this.fillings.length >= this.maxFillings ||
      this.condiments.length >= this.maxCondiments
    ) {
      return;
    }
    // if the length of recipesFound is equal to the number of recipes to search for, terminate the search
    if (
      this.numberOfRecipesToSearchFor != 'ALL' &&
      this.recipesFound.length === this.numberOfRecipesToSearchFor
    ) {
      return;
    }

    // Grab the current condiment and filling
    const currentCondiment = CONDIMENT[condimentIdx];
    const currentFilling = FILLING[fillingIdx];

    // Create a unique key from the list of condiments and fillings
    const key =
      JSON.stringify([...this.condiments].sort()) +
      JSON.stringify([...this.fillings].sort());

    // If the key is not already in the hashmap, add it
    if (!this.alreadyChecked[key]) {
      this.alreadyChecked[key] = true;
    } else {
      // If the key is already in the hashmap, terminate the search
      return;
    }

    // If there is at least 1 condiment and 1 filling, check if the sandwich exists
    if (this.condiments.length > 0 && this.fillings.length > 0) {
      const ingredients = [
        ...this.fillings.sort((a, b) => a.name.localeCompare(b.name)),
        ...this.condiments.sort((a, b) => a.name.localeCompare(b.name)),
      ];
      const summationOfCurrentFillingsAndCondiment =
        getIngredientsSums(ingredients);

      const existingSandwich = presetSandwichExists(
        this.fillings,
        this.condiments
      );

      const sandwichCrafted: craftedSandwich | null = craftSandwich(
        [...this.fillings],
        [...this.condiments],
        summationOfCurrentFillingsAndCondiment,
        existingSandwich
      );

      if (sandwichCrafted) {
        const sandwichPowerFound = this.checkIfSandwichMatches(sandwichCrafted);
        if (sandwichPowerFound) {
          console.log('Sandwich Found! : ', sandwichCrafted);
          this.recipesFound.push(sandwichCrafted);
        }
      }
    }

    // Visit the children
    
  };
}

export const findSandwichRecipes = (
  typeOfPower: typeOfPower,
  type: typesOfPokemon,
  level: '1' | '2' | '3',
  maxFillings: number,
  maxCondiments: number,
  numberOfRecipesToSearchFor: number | 'ALL'
) => {
  const searchAlgo = new SearchingForSandwich(
    typeOfPower,
    type,
    level,
    maxFillings,
    maxCondiments,
    numberOfRecipesToSearchFor,
    [],
    [],
    [],
    {},
    {}
  );
  const findExistingSandwiches = searchAlgo.checkExistingSandwichEffects();

  searchAlgo.depthFirstSearchForSandwich(0, 0, true);
  console.log('Done searching!');
};
