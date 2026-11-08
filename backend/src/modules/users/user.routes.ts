import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../../utils/store';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRoles('SUPER_ADMIN'));

// List all managers and staff
router.get('/staff', (req: Request, res: Response) => {
  const staff = store.users
    .filter(u => u.role !== 'CUSTOMER')
    .map(({ passwordHash, ...safeUser }) => safeUser);
  return sendSuccess(res, staff, 'Staff members retrieved');
});

// Create new department manager
router.post('/staff', (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, role, password } = req.body;
  if (!email || !password || !role) {
    return sendError(res, 'Email, role and password are required', 400);
  }

  const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return sendError(res, 'User with this email already exists', 400);
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newStaff = {
    id: `usr-staff-${Date.now()}`,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone: phone || null,
    passwordHash,
    role,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString()
  };

  store.users.push(newStaff);
  const { passwordHash: _, ...safeUser } = newStaff;
  return sendSuccess(res, safeUser, 'Staff account created successfully', 201);
});

// Update staff status or role
router.put('/staff/:id', (req: Request, res: Response) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return sendError(res, 'Staff member not found', 404);

  if (req.body.role) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = Boolean(req.body.isActive);
  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;

  const { passwordHash, ...safeUser } = user;
  return sendSuccess(res, safeUser, 'Staff updated');
});

export default router;
