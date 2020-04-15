module.exports = {
	// when using React Testing Library and adds special
	// extended assertions to Jest
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

	transform: {
		'^.+\\.jsx?$': 'babel-jest', // Adding this line solved the issue
		'^.+\\.tsx?$': 'ts-jest',
	},

	// Module file extensions for importing
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
