import { prisma } from "./prisma";


export async function generateUniqueUsername(firstName: string, lastName: string): Promise<string> {
  const base = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, "");
  
  let username: string;
  let exists = true;

  while (exists) {
    const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    username = `${base}${suffix}`;
    
    // check if already exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    exists = !!user; // if found, loop again
  }

  return username!;
}
