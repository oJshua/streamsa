
import { app } from './notifier';

const PORT = process.env.PORT || 80;

const server = app.listen(PORT, () => {
  console.log(
      "  App is running at http://localhost:%d in %s mode",
      PORT,
      app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
