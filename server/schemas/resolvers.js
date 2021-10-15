const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                let userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            let user = await User.create(args);
            let token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            let user = await User.findOne({ email });

            if (!user) throw new AuthenticationError('Incorrect credentials');
            console.log('****** it works, returning single statement *******');

            let correctPw = await user.isCorrectPassword(password);
            if (!correctPw) throw new AuthenticationError('Incorrect credentials');
            console.log('******* single return if statement works ********');

            let token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { input }, { user }) => {
            if (!user) {
                let userAdd = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                );
                return userAdd;
            } 
            throw new AuthenticationError('You need to be logged in!')
        },
        removeBook: async (parent, { input }, { user }) => {
            if (!user) {
                let userRemove = await User.findOneAndUpdate(
                    { _id: user._id},
                    { $pull: { savedBooks: { bookId: bookId} } },
                    { new: true }
                );
                return userRemove;
            }
            throw new AuthenticationError('You need to be logged in!')
        }
    }
};

module.exports = resolvers;
