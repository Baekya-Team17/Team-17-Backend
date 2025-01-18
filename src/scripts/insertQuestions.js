import fs from 'fs';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function insertQuestions() {
    const questions = [];
    // "C:\Users\USER\Desktop\project\question.csv"
    fs.createReadStream('/Users/USER/Desktop/project/question.csv') // CSV 파일 경로
        .pipe(csvParser())
        .on('data', (row) => {
            questions.push({
                content: row.content,
                writerId: row.writer_id ? parseInt(row.writer_id, 10) : null, // writerId와 매핑
                createdAt: new Date(row.created_At), // Prisma 스키마에서 createdAt으로 매핑
                updatedAt: new Date(row.updated_At), // Prisma 스키마에서 updatedAt으로 매핑
            });
        })
        .on('end', async () => {
            console.log('CSV 파일 읽기 완료. 데이터베이스에 삽입 시작...');

            try {
                for (const question of questions) {
                    await prisma.question.create({
                        data: {
                            content: question.content,
                            writerId: question.writerId,
                            createdAt: question.createdAt,
                            updatedAt: question.updatedAt,
                        },
                    });
                }

                console.log('모든 데이터가 데이터베이스에 성공적으로 삽입되었습니다.');
            } catch (error) {
                console.error('데이터베이스 삽입 중 오류 발생:', error);
            } finally {
                await prisma.$disconnect();
            }
        });
}

insertQuestions().catch((e) => {
    console.error('에러 발생:', e);
    prisma.$disconnect();
    process.exit(1);
});
