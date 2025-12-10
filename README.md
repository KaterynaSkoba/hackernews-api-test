# Overview 
API tests for the public HackerNews API using Playwright and TypeScript.

This project covers the required acceptance criteria:
- Retrieving top stories with the Top Stories API 
- Using the Top Stories API to retrieve the current top story from the Items API
- Using the Top Stories API to retrieve a top story, retrieve its first comment using the Items API 
- Edge cases for the above to test out


# Structure

togetherai/
├── tests/
│ └── hackerNewsAPITest.spec.ts
├── package.json
├── playwright.config.ts
└── README.md


# How to install

npm install


# How to run

npx playwright test