
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		// Get current user 
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id }).populate("savedBooks");
			}
			throw new AuthenticationError("You need to be logged in.");
		},
	},

	Mutation: {
		// Create a new user
		addUser: async (parent, { username, email, password }, context) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		// Log in user
		login: async (parent, { email, password }, context) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("No user found with this email address.");
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError("Incorrect password.");
			}

			const token = signToken(user);

			return { token, user };
		},
		// Save a book 
		saveBook: async (parent, { input }, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: input } },
					{ new: true, runValidators: true }
				);

				return updatedUser;
			}
			throw new AuthenticationError("You need to be logged in.");
		},
		// Remove a book 
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);

				return updatedUser;
			}
			throw new AuthenticationError("You need to be logged in.");
		},
	},
};

module.exports = resolvers;