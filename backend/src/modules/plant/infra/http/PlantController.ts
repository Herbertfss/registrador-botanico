import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { validate } from '../../../../common/validation/validate';
import { loginSchema } from '../../../../common/validation/schemas';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado.
 */
router.post('/auth/login', validate(loginSchema), (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (email !== 'admin@biowoma.com' || password !== 'biowoma123') {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const secret = process.env.JWT_SECRET ?? 'secret';
  const token = jwt.sign({ sub: 'admin', email }, secret, { expiresIn: '2h' });

  return res.json({ token });
});

export { router as authRouter };
