import app from "./app";
import { config } from "./config";
import connectToDatabase from "./config/db";

const port: number = Number(process.env.PORT) || 8080;

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server is listening on - http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", (error as Error).message);
    process.exit(1);
  }
};

startServer();
