// start.js
import app from "./server.js";

app.listen(process.env.PORT, () => {
  console.log("server is running");
});

// app.listen(3000);
