import jwt from 'jsonwebtoken'
import { NextRequest } from "next/server"

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get("token")?.value || '';
    if (!token) {
      console.log('No token found in cookies');
      return null;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    return decodedToken.userId;
  } catch (error: any) {
    console.error('Error decoding token:', error.message);
    return null;
  }
}