// Evolutionary Algorithm for FUNGI Rule System Optimization
import {StaticRuleSystem} from "../model/StaticRuleSystem.js";
import {StaticRule} from "../model/StaticRule.js";
import {FungiHistory} from "../model/FungiHistory.js";
import {RuleSystemPool} from "../model/RuleSystemPool.js";

export class EvolutionaryAlgorithm {
    static evolutionaryAlgorithm = new EvolutionaryAlgorithm();

    constructor() {
        this.mutationRate = 0.3; // Probability of mutation
        this.crossoverRate = 0.7; // Probability of crossover
    }

    /**
     * Evolves a new rule system based on historical data and the current system.
     * @param {FungiHistory} history - Array of objects with `ruleSystem` and `fitness`.
     * @param {MycelialFungiHistory} mycelialHistory - Array of objects with `ruleSystem` and `fitness`.
     * @param {StaticRuleSystem} currentSystem - The currently selected rule system.
     * @returns {StaticRuleSystem} - A new mutated rule system.
     */
    evolve(history, mycelialHistory, currentSystem) {
        const pool = this.createPool(history, mycelialHistory, currentSystem);

        // Perform mutation and crossover to generate a new rule system
        let newRuleSystem = this.mutate(this.selectParent(pool), pool);

        // Optionally, add crossover for diversity
        if (Math.random() < this.crossoverRate) {
            const parent2 = this.selectParent(pool);
            newRuleSystem = this.crossover(newRuleSystem, parent2);
        }

        return newRuleSystem;
    }

    /**
     * Creates a selection pool based on fitness values.
     * @param {FungiHistory} history - Array of {ruleSystem, fitness}.
     * @param {MycelialFungiHistory} mycelialHistory - Array of objects with `ruleSystem` and `fitness`.
     * @param {StaticRuleSystem} currentSystem - The current rule system.
     * @returns {RuleSystemPool} - A pool of rule systems weighted by fitness.
     */
    createPool(history, mycelialHistory, currentSystem) {
        const pool = new RuleSystemPool([]);

        // Add entries to the pool proportional to their fitness
        history.getFungiStates().forEach(state => {
            const weight = Math.ceil(state.fitness * 10); // Scale fitness for pool weighting
            for (let i = 0; i < weight; i++) {
                pool.getRuleSystems().push(state.getRuleSystem());
            }
        });

        // Add entries to the pool proportional to their fitness
        mycelialHistory.getFungiStates().forEach(state => {
            const weight = Math.ceil(state.fitness * 10); // Scale fitness for pool weighting
            for (let i = 0; i < weight; i++) {
                pool.getRuleSystems().push(state.getRuleSystem());
            }
        });

        // Ensure current system is in the pool
        pool.getRuleSystems().push(currentSystem);
        return pool;
    }

    /**
     * Selects a parent from the pool using random selection.
     * @param {RuleSystemPool} pool - The selection pool of rule systems.
     * @returns {StaticRuleSystem} - A selected parent rule system.
     */
    selectParent(pool) {
        return pool.getRuleSystems()[Math.floor(Math.random() * pool.getRuleSystems().length)];
    }

    /**
     * Mutates a rule system by modifying, adding, or removing rules.
     * @param {StaticRuleSystem} parent - The rule system to mutate.
     * @param {RuleSystemPool} pool - Pool of RuleSystems in which to mutate
     * @returns {StaticRuleSystem} - A mutated rule system.
     */
    mutate(parent, pool) {
        const ruleClones = parent.getRules().map(rule => new StaticRule(rule.trigger, rule.response));

        // Optionally add a new random rule
        if (Math.random() < this.mutationRate) {
            console.log("Mutation occurred!");
            const ruleA = this.pickRandomRule(pool);
            const ruleB = this.pickRandomRule(pool);
            ruleClones.push(new StaticRule(ruleA.trigger, ruleB.response));
        }

        // Optionally remove a random rule
        if (ruleClones.length > 1 && Math.random() < this.mutationRate) {
            ruleClones.splice(Math.floor(Math.random() * ruleClones.length), 1);
        }

        return new StaticRuleSystem(ruleClones);
    }

    /**
     * Mutates an individual rule by altering its fields.
     * @param {StaticRule} rule - The rule to mutate.
     * @returns {StaticRule} - A mutated rule.
     */
    mutateRule(rule) {
        const trigger = Math.random() < 0.5 ? rule.trigger + "_mut" : rule.trigger;
        const response = Math.random() < 0.5 ? rule.response + " Mutated!" : rule.response;
        return new StaticRule(trigger, response);
    }

    /**
     * Generates a new random rule.
     * @returns {StaticRule} - A randomly generated rule.
     */
    generateRandomRule() {
        const triggers = ["hello", "pricing", "weather", "support"];
        const responses = [
            "Hi there! How can I assist?",
            "Check our pricing at example.com/pricing",
            "Weather today is sunny!",
            "Support is available at support@example.com"
        ];

        const trigger = triggers[Math.floor(Math.random() * triggers.length)];
        const response = responses[Math.floor(Math.random() * responses.length)];

        return new StaticRule(trigger, response);
    }

    /**
     *
     * @param {RuleSystemPool} pool
     */
    pickRandomRule(pool) {
        const rndRuleSystem = this.getRandomElementOfArray(pool.getRuleSystems());
        return this.getRandomElementOfArray(rndRuleSystem.getRules());
    }

    getRandomElementOfArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Performs crossover between two rule systems.
     * @param {StaticRuleSystem} parent1 - The first parent.
     * @param {StaticRuleSystem} parent2 - The second parent.
     * @returns {StaticRuleSystem} - A new rule system after crossover.
     */
    crossover(parent1, parent2) {
        const rules1 = parent1.getRules();
        const rules2 = parent2.getRules();

        const crossoverPoint = Math.floor(Math.random() * Math.min(rules1.length, rules2.length));

        const newRules = [
            ...rules1.slice(0, crossoverPoint),
            ...rules2.slice(crossoverPoint)
        ];

        return new StaticRuleSystem(newRules);
    }
}

// Example Usage
// const history = new FungiHistory([
//     new FungiState(new StaticRuleSystem([new StaticRule("hello", "Hi there!")]), 0.9),
//     new FungiState(new StaticRuleSystem([new StaticRule("pricing", "Check our pricing.")]), 0.8)
// ]);
// const currentSystem = new StaticRuleSystem([new StaticRule("support", "Support is available.")]);
//
// const evolutionaryAlgorithm = new EvolutionaryAlgorithm();
// const newRuleSystem = evolutionaryAlgorithm.evolve(history, currentSystem);
// console.log(newRuleSystem);
