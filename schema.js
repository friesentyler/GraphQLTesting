export const typeDefs = `#graphql
    type Game {
        id: ID!
        title: String! 
        platform: [String!]!
        # more associations
        reviews: [Review!]
    }
    type Review {
        id: ID!
        rating: Int!
        content: String!
        # this determines our associations with other objects in the DB, wait to add this one
        game: Game!
        author: Author!
    }
    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        # more associations
        reviews: [Review!]
    }
    # you should first do the queries that request all data
    # then do the queries that filter for a specific item
    type Query {
        reviews: [Review]
        # don't start with this one
        review(id: ID!): Review
        games: [Game]
        # don't start with this one
        game(id: ID!): Game
        authors: [Author]
        # don't start with this one
        author(id: ID!): Author
    }
    # allows us to change the database, wait on this one
    type Mutation {
        addGame(game: AddGameInput!): Game
        # add deleteGame first, then add game
        deleteGame(id: ID!): [Game]
        # add updateGame last
        updateGame(id: ID!, edits: EditGameInput!): Game
    }
    # this allows the input needed for game creation
    input AddGameInput {
        title: String!
        platform: [String!]!
    }
    # allows input for editing a game
    input EditGameInput {
        title: String,
        platform: [String!]
    }
`

// int, float, string, boolean, ID
// ! indicates required field
// install graphQL syntax highlighting extension
// Query is not optional, a schema must always have type Query, it is our
// entry point into the graph




// query for a single item
/*
// parameters for ReviewQuery is id variable and then the # type
query ReviewQuery($id: ID!) {
  review(id: $id) {
    rating,
    content
  }
}

variables tab:
{
  "id": "1",
}
*/


// query for related items
/*
query GameQuery($id: ID!) {
  game(id: $id) {
    title,
    reviews {
      rating,
      content
    }
  }
}

variables tab:
{
  "id": "2",
}
*/


// even more complicated related data query
/*
query ReviewQuery($id: ID!) {
  review(id: $id) {
    rating,
    game {
      title,
      platform,
      reviews {
        rating
      }
    }
  }
}

{
  "id": "1",
}
*/


// mutation (delete)
/*

run this before to prove that it exists
query IsDeleted {
  games {
    id
  }
}

mutation DeleteMutation($id: ID!) {
  deleteGame(id: $id) {
    id,
    title,
    platform
  }
}

variables tab:
{
  "id": "1",
}

then run this after to verify its deleted
query IsDeleted {
  games {
    id
  }
}

this query also verifies its deletion
query IsDeleted($id: ID!) {
  game(id: $id) {
    id
  }
}
variables tab:
{
  "id": "1"
}

you can verify that it is missing by running this query
*/


// add game mutation
/*
mutation AddMutation($game: AddGameInput!) {
  addGame(game: $game) {
    id,
    title,
    platform
  }
}

variables tab:
{
  "game": {
    "title": "a new game",
    "platform": ["switch", "ps5"]
  }
}

verify that the game was added with this query
query Game {
  games {
    id
    title
    platform
  }
}
*/

// update game mutation
/*
mutation EditMutation($edits: EditGameInput!, $id: ID!) {
  updateGame(edits: $edits, id: $id) {
    title,
    platform
  }
}

variables tab:
{
  "edits": {
    "platform": ["PS5", "Switch"],
    "title": "some other game"
  },
  "id": "2"
}

// checks if update occurs
query checkUpdate {
  games {
    id,
    title,
    platform
  }
}
*/