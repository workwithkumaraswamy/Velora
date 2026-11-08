import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { store } from '../../utils/store';
import { prisma, getDbStatus } from '../../prisma/client';

export class AuthService {
  static async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    const existing = store.users.find(
      u => u.email.toLowerCase() === data.email.toLowerCase() || (data.phone && u.phone === data.phone)
    );
    if (existing) {
      throw new Error('A user with this email or phone number already exists.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      passwordHash,
      role: 'CUSTOMER',
      avatar: null,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);

    const token = this.generateToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    const { passwordHash: _, ...userSafe } = newUser;
    return { user: userSafe, token, refreshToken };
  }

  static async login(credential: string, passwordPlain: string) {
    const user = store.users.find(
      u => u.email.toLowerCase() === credential.toLowerCase() || u.phone === credential
    );

    if (!user) {
      throw new Error('Invalid email/phone or password.');
    }

    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact concierge support.');
    }

    const isMatch = bcrypt.compareSync(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email/phone or password.');
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const { passwordHash: _, ...userSafe } = user;
    return { user: userSafe, token, refreshToken };
  }

  static async getProfile(userId: string) {
    const user = store.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    const { passwordHash, ...userSafe } = user;
    return userSafe;
  }

  static async updateProfile(userId: string, updates: Partial<{ firstName: string; lastName: string; phone: string; avatar: string }>) {
    const user = store.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.phone) user.phone = updates.phone;
    if (updates.avatar) user.avatar = updates.avatar;

    const { passwordHash, ...userSafe } = user;
    return userSafe;
  }

  static generateToken(user: any) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      config.jwt.secret as jwt.Secret,
      { expiresIn: config.jwt.expiresIn as any }
    );
  }

  static generateRefreshToken(user: any) {
    return jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret as jwt.Secret,
      { expiresIn: config.jwt.refreshExpiresIn as any }
    );
  }

  static verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
      const user = store.users.find(u => u.id === decoded.userId);
      if (!user) throw new Error('User no longer exists');
      return this.generateToken(user);
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
