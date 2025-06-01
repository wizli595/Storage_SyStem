import app from "./app";
import { env } from "./config";
const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
