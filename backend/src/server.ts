import { config } from 'dotenv';

config();

import app from './app';

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`🚀 Registrador Botânico backend rodando em http://localhost:${PORT}`);
});
