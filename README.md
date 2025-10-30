# Logic Gate WebSocket Server

This project is a WebSocket server for a real-time logic gate game, built with TypeScript, Socket.io, and tsyringe for dependency injection.

## Running Unit Tests

This project uses **Jest** for unit testing. The test suite is configured to run in an ES Module environment.

### Prerequisites

- Node.js (LTS version recommended)
- npm (which comes with Node.js)

### 1. Install Dependencies

First, clone the repository and navigate into the project's root directory. Then, install all the necessary dependencies listed in `package.json`:

```bash
npm install
```

### 2. Run the Test Suite

To execute all unit tests, run the test script from package.json:

```bash
npm test
```

This command will automatically find and run all test files (ending in .test.ts) located in the tests/ directory. It executes Jest using cross-env and the `--experimental-vm-modules` flag to ensure compatibility with the project's ES Module setup.
