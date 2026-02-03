import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { testConnection } from "./db/sequelize";
import apiRouter from "./routers/api.router";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/pigsa-api", apiRouter);

// Middleware de erros (centraliza mensagens de SIGNAL das SPs)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const msg = err?.original?.sqlMessage || err?.message || "Erro interno";
  const status = msg?.toLowerCase()?.includes("não encontrado") ? 404 :
                 msg?.toLowerCase()?.includes("ativo") ? 409 : 400;
  res.status(status).json({ error: true, message: msg });
});

const PORT = Number(process.env.PORT || 3000);

(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`API ON http://localhost:${PORT}`));
  } catch (e) {
    console.error("Falha na conexão com a base:", e);
    process.exit(1);
  }
})();
