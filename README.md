# Express + TypeScript Boilerplate in vercel ✏️

This repository contains a boilerplate for setting up an Express project with TypeScript, including a structured folder setup with controllers and models. Follow the steps below to get started


[Visit-Link](https://express-ts-vercel-starter.vercel.app/)

## Table of Contents

1. [Initialize Node Project](#initialize-node-project)
2. [Install And Initalialize Typescript](#install-typescript)
3. [Install Packages](#install-packages)
4. [Folder Structure](#project-folder-structure)
5. [Update tsconfig.json](#update-tsconfigjson)
6. [Write Express Server Code](#write-express-server-code)
7. [Update Scripts in `package.json`](#update-scripts-in-packagejson)
8. [Create Vercel Account](#create-vercel-account)
9. [Add Vercel Configuration](#add-vercel-configuration)
10. [Update pakage.json](#update-packagejson)
11. [Add Project on vercel](#add-project)
12. [Push Code to Github ](#push-code-to-github)

---

## 1. Initialize Node Project

```bash
npm init -y
```

## 2. Install And Initialize Typescript

```bash
npm install --save-dev typescript
npx tsc --init
```

## 3. Install Packages

```bash
npm install dotenv  rimraf express @types/express typescript ts-node nodemon dotenv --save-dev
```

## 4. Folder Structure

```
│
├── /src
│   ├── /controllers
│   │   └── user-controller.ts
│   ├── /models
│   │   └── user.models.ts
│   ├── /routes
│   │   └── user.routes.ts
│   ├── index.ts
│   └── app.ts
│
├── /dist
│
├── /node_modules
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── vercel.json
```

## 5. Update tsconfig.json

```bash
{
  "compilerOptions": {
      "module": "commonjs",
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "target": "es6",
      "noImplicitAny": true,
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist",
      "baseUrl": ".",
      "paths": {
          "*": ["node_modules/*", "src/types/*"]
      }
  },
  "include": ["./src/**/*"]
  }
```

## 6. Write Express Server Code

- models/user.model.ts

  ```bash
  export interface User {
      id: number;
      name: string;
      email: string;
  }
  ```

- controllers/user.controller.ts

  ```bash
  import { Request, Response } from "express";
  import { User } from "../models/user.model";

  const mockUser: User = {
    id: 1,
    name: "Gourav Mahobe",
    email: "gourav.mahobe@example.com",
  };

  const getUser = (_req: Request, res: Response) => {
    res.json(mockUser);
  };

  export { getUser };
  ```

- routes/user.route.ts

  ```bash
  import express from "express";
  import { getUser } from "../controllers/  user-controller";

  const router = express.Router();

  router.get("/user", getUser);

  export default router;
  ```

- index.ts

  ```bash
  import app from "./app";

  const port = process.env.PORT || 8080;

   app.listen(port, () => {
     console.log(`Server is listening on ${port}`);
   });
  ```

- app.ts

  ```bash
  import express from "express";
  import userRoutes from "./routes/user.routes";

  const app = express();

  //Health check endpoint at root
  app.get("/", (req, res) => {
    res.status(200).send("Server is live");
  });

  app.use(express.json());
  app.use("/api", userRoutes);

  export default app;

  ```

## 7 Update Scripts in `package.json`

- Explaination :

  1. 'nodemon' is a utility that monitors for any changes in your source and automatically restarts your server. Perfect for development.

  2. The '-r' option in nodemon (or Node itself) stands for require, and dotenv/config is a configuration module that loads environment variables from a .env file into process.env.

  3. The '--exec' option in 'nodemon' specifies an executable command that should be run to start your application. 'ts-node' is a TypeScript execution engine that allows you to run TypeScript files directly without the need to pre-compile them to JavaScript. It compiles TypeScript on-the-fly and runs the resulting JavaScript code.

  ```bash

   "scripts": {
    "dev": "nodemon -r dotenv/config --exec ts-node src/index.ts",

    }
  ```

## 8. Create Vercel Project

Creating a Vercel project allows you to deploy your application quickly and efficiently. Vercel provides a seamless deployment experience, especially for projects using frameworks like Next.js.

## 9. Add Vercel Configuration

- create 'vercel.json' file in the root and paste the given code:

```bash
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node",
      "config": { "includeFiles": ["dist/**"] }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}

```

- # Explanation

  - version
    : Specifies the version of the Vercel configuration. "version": 2 indicates that you're using version 2 of the configuration schema, which is the latest.

- builds: An array of build settings that define how Vercel should build your application

  - src: Specifies the source file that Vercel should use to start building your application. In this case, it's "dist/index.js", which means your build output is in the dist directory, and the entry point is index.js

  - use: Specifies the build engine or runtime to use. "@vercel/node" indicates that you're using Vercel's Node.js runtime

  - config: An optional object that provides additional configuration for the build process.

    - includeFiles: Specifies additional files or directories to include in the build. "dist/**" means that all files and subdirectories within the dist directory should be included in the deployment.

- routes: An array of routing rules that define how incoming requests should be handled.

  - src: Specifies the source path pattern for incoming requests. "/(.*)" is a regex pattern that matches all paths.
  - dest: Specifies the destination file to handle the matched requests. "dist/index.js" means that all requests should be handled by the "index.js" file in the dist directory.

- Summary
  - This configuration file tells Vercel to use version 2 of the configuration schema, build your application using the 'dist/index.js' file with the Node.js runtime, include all files in the 'dist' directory, and route all incoming requests to 'dist/index.js.' This setup is typically used for deploying a Node.js application with a custom build output directory.

## 10. Update 'package.json'

- Update the script in the 'package.json' file:

```bash
"scripts": {
    "dev": "nodemon -r dotenv/config --exec ts-node src/index.ts",
    "build": "rimraf dist && tsc",
    "ts.check": "tsc --project tsconfig.json",
    "add-build": "git add dist"
  },

```

- npm run build: Clean the previous build and compile your TypeScript code into JavaScript.

- npm run ts.check: Type-check your TypeScript code to ensure there are no type errors.

- npm run add-build: Stage the build output for committing to your Git repository.


## Add Project on Your Vercel Account

In this step, you'll deploy your project to Vercel, a platform that provides a seamless experience for deploying frontend applications. Vercel integrates well with Next.js and supports continuous deployment, enabling you to push updates effortlessly. Follow the steps below to add your project to your Vercel account:

### Step-by-Step Instructions

1. **Login to Vercel**:
   - Navigate to [Vercel's website](https://vercel.com/).
   - Log in with your preferred method (GitHub, GitLab, Bitbucket, or email).

2. **Import Your Project**:
   - Click on the "New Project" button on your Vercel dashboard.
   - Select the Git provider where your project repository is hosted (e.g., GitHub).
   - Authorize Vercel to access your repositories if prompted.
   - Choose the repository you want to deploy from the list of available repositories.

3. **Configure Project Settings**:
   - After selecting the repository, you will be directed to the project configuration page.
   - Ensure the framework preset is correctly identified as Next.js.
   - Verify the root directory and other settings to match your project's structure.
   - Add any necessary environment variables under the "Environment Variables" section.

4. **Deploy Your Project**:
   - Click the "Deploy" button to start the deployment process.
   - Vercel will clone your repository, install dependencies, build your project, and deploy it.
   - Wait for the deployment to complete. Once done, you'll see a live URL for your project.

5. **Manage Your Project**:
   - You can manage your deployments, view logs, and configure settings from your Vercel dashboard.
   - Any new commits pushed to the repository will trigger automatic redeployments, ensuring your project is always up-to-date.

By following these steps, you'll have your project live on Vercel, benefiting from its optimized performance, scalability, and ease of use.

## Push Code to GitHub

To ensure your code is properly configured and ready for deployment, follow the steps below to push your code to GitHub using the provided `package.json` configuration:

### Step-by-Step Instructions

1. **Initialize Git Repository**:
   - If you haven't already, initialize a Git repository in your project directory:
     ```bash
     git init
     ```

2. **Create a .gitignore File**:
   - Create a `.gitignore` file to exclude files and directories that should not be pushed to the repository:
     ```plaintext
     node_modules
     .env
     ```

3. **Install Dependencies**:
   - Install the necessary dependencies as specified in the `package.json` file:
     ```bash
     npm install
     ```

4. **Build the Project**:
   - Run the build script to compile the TypeScript code:
     ```bash
     npm run build
     ```

5. **Add Build Artifacts**:
   - Add the build artifacts (e.g., the `dist` directory) to Git using the provided script:
     ```bash
     npm run add-build
     ```

6. **Commit and Push Code**:
   - Commit your changes and push the code to your GitHub repository:
     ```bash
     git add .
     git commit -m "Initial commit"
     git remote add origin <your-repo-url>
     git push -u origin main
     ```

7. **Verify Repository**:
   - Verify that your code has been successfully pushed to the GitHub repository by checking the repository on GitHub.

By following these steps, you'll ensure your project is properly configured and pushed to GitHub, ready for deployment to Vercel.
