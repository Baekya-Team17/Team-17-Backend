import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();


export default prisma; // default export 추가

// export const prisma = new PrismaClient({ log: ["query"] }); - sql 쿼리 확인 가능 옵션 (필요시 사용) 