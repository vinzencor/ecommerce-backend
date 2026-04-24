import "dotenv/config";
import app from "./Src/App.js";
import "./Src/Config/Databse.js";

// start the server
const port = process.env.PORT ;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
