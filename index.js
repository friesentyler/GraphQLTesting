import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// types, (import this after the schema.js is made)
import { typeDefs } from './schema.js'

// import this after _db.js is made
import db from './_db.js'

// resolver functions,  make these after _db.js has been made
const resolvers = {
    Query: {
        games() {
            return db.games
        },
        // wait to write this resolver
        game(_, args) {
            return db.games.find((game) => game.id === args.id)
        },
        authors() {
            return db.authors
        },
        // wait to write this resolver
        author(_, args) {
            return db.author.find((author) => author.id === args.id)
        },
        reviews() {
            return db.reviews
        },
        // wait to write this resolver
        review(_, args) {
            // we are passing a callback function into find() so that it can do comparisons
            db.games = db.reviews.find((review) => review.id === args.id)
            return db.games
        }
    },
    // this allows us to nest queries of related objects. Wait to add this
    Game: {
        // The `parent` argument represents the data resolved for the parent field of this resolver.
        // In this case, it is assumed that the parent represents a game object with an `id` property.
        // The logic here filters and returns only the reviews that are associated with the parent game (parent.id).
        reviews(parent) {
            // Filtering the `db.reviews` array to include only reviews where the `game_id` matches the `parent.id`.
            return db.reviews.filter((review) => review.game_id === parent.id);
        }
    },
    // wait on this one too
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review: {
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id)
        },
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id)
        }
    },
    // wait on this one, implement in the schema first
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter((game) => game.id !== args.id)

        },
        // add this after delete game
        addGame(_, args) {
            let game = {
                // this auto assigns all the game fields from the input in the schema
                ...args.game,
                // randomly assigns a game id
                id: Math.floor(Math.random() * 10000).toString()
            }
            // adds to the database
            db.games.push(game)
            return game
        },
        updateGame(_, args) {
            // the map function takes an array and creates a new one with the specified operation from the
            // callback function
            // Using the `map` method to iterate over each game in the `db.games` array.
            db.games = db.games.map((game) => {
                // Checking if the current game's ID matches the ID provided in the arguments.
                if (game.id === args.id) {
                    // If there is a match, update the game by merging its existing properties
                    // with the new properties provided in the `args.edits` object using the spread operator.
                    return { ...game, ...args.edits };
                }
                // If the current game's ID does not match the provided ID, return the game unchanged.
                return game;
            });
            // After updating the database, use the `find` method to retrieve and return
            // the updated game with the specified ID from the `db.games` array.
            return db.games.find((game) => game.id === args.id);
        }
    }
}

// server setup
const server = new ApolloServer({
    // typeDefs -- definitions of types of data
    typeDefs,
    // resolvers -- make these after _db.js has been made
    resolvers
})

// destructuring, startStandaloneServer() returns a promise which resolve
// to an object containing a property 'url', { url } allows us to assign
// that property to a variable 'url'
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Server ready at port', 4000);