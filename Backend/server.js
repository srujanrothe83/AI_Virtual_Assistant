import dotenv from 'dotenv'
dotenv.config()
import app from './src/app.js'
import ConnectDb from './config/Db.js'


const Port = process.env.PORT || 5000

const startServer = async () => {
    try {
        await ConnectDb();

        app.listen(Port, () => {
            console.log(`Server running on Port ${Port}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
    }
};

startServer();
