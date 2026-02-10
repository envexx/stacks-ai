import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

let requestCount = 0;
let paymentCount = 0;
let totalRevenue = 0;

router.get('/', (req, res) => {
  res.json({
    requests: requestCount,
    payments: paymentCount,
    revenue: {
      microSTX: totalRevenue,
      STX: totalRevenue / 1_000_000
    },
    uptime: process.uptime()
  });
});

export { router as statsRoutes };
