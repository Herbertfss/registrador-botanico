import { Router } from 'express';
import { authenticateJwt, AuthRequest } from '../../../../common/middleware/auth';
import { validate } from '../../../../common/validation/validate';
import { plantIdentificationSchema } from '../../../../common/validation/schemas';
import { PrismaPlantRepository } from '../prisma/PrismaPlantRepository';
import { CreatePlantIdentification } from '../../usecases/CreatePlantIdentification';

const router = Router();

/**
 * @openapi
 * /api/plant-identifications:
 *   post:
 *     summary: Cria uma nova identificação de planta.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Identificação criada.
 */
router.post(
  '/plant-identifications',
  authenticateJwt,
  validate(plantIdentificationSchema),
  async (req: AuthRequest, res) => {
    const repository = new PrismaPlantRepository();
    const useCase = new CreatePlantIdentification(repository);
    const user = req.user;

    const result = await useCase.execute(req.body, user?.email ?? 'unknown');
    return res.status(201).json(result);
  }
);

export { router as plantRouter };