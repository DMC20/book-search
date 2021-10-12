const { gql } = require('apollo-server-express');

const typeDefs = gql `

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBook: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

input savedBook {
    bookId: String
    description: String
    title: String
    image: String
    link: String
    authors: [String]
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: String!): User
}

type Query {
    me: User
}

type Auth {
    token: ID!
    user: User
}`;

module.exports = typeDefs;