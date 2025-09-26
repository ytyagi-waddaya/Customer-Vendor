import { User } from '@prisma/client';

// Customize this to match your JWT payload
export interface UserPayload extends Pick<User, 'id'> {}
