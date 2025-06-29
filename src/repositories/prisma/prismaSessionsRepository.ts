import type { Prisma } from '@prisma/client';
import type { UsersRepository } from '../usersRepository'; // Adjust the import path as necessary
import { prisma } from '@/lib/prisma'; // Adjust the import path as necessary
import { SessionsRepository } from '../sessionsRepository';

export class PrismaSessionsRepository implements SessionsRepository {

    async findById(id: string) {
        return prisma.session.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async create(data: Prisma.SessionCreateInput) {
        return prisma.session.create({
            data,
        });
    }

    async update(id: string, data: Prisma.SessionUpdateInput) {
        return prisma.session.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await prisma.session.delete({
            where: { id },
        });
    }

    async getAll() {
        return prisma.session.findMany({
            include: {
                creator: {
                    select: {
                        name: true,
                    },
                }
            },
        });
    }

    async getByUserId(userId: string) {
        return prisma.session.findMany({
            where: {
                enrollments: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                creator: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async getAllByStatus(status: string) {
        return prisma.session.findMany({
            where: { status },
            include: {
                creator: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async subscribeUserToSession(sessionId: string, userId: string) {
        return prisma.sessionEnrollment.create({
            data: {
                sessionId,
                userId,
            },
        });
    }

    async isUserEnrolled(sessionId: string, userId: string) {
        const enrollment = await prisma.sessionEnrollment.findFirst({
            where: {
                sessionId,
                userId,
            },
        });
        return !!enrollment;
    }

    async findFirstByCreatorAndStatus(creatorId: string, status: string) {
        return prisma.session.findFirst({
            where: {
                creatorId,
                status,
            },
        });
    }

    async findEmittedByCreator(creatorId: string) {
        return prisma.session.findMany({
            where: {
                creatorId,
            },
        });
    }

    async findEnrolledByUser(userId: string) {
        return prisma.sessionEnrollment.findMany({
            where: {
                userId,
            },
            include: {
                session: true, // Include session details if needed
            },
        });
    }
}