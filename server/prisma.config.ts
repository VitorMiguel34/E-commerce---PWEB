import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
<<<<<<< HEAD
        url: env("DATABASE_URL"),
=======
        url:"file:./dev.db",
>>>>>>> e685ec177cbb88baa181bdf755d654eddc20c620
    },
});