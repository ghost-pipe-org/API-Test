import { SessionsRepository } from "@/repositories/sessionsRepository";
import { UsersRepository } from "@/repositories/usersRepository";
import { NotFoundError } from "@/services/errors/notFoundError";
import { SessionAlreadyRejectedError } from "@/services/errors/sessionAlreadyRejectedError";


interface rejectSessionServiceRequest {
    sessionId: string;
    userId: string;

}

interface rejectSessionServiceResponse {
    sessionId: string;
    userId: string;
}

export class RejectSessionService {
    constructor(
        private sessionsRepository: SessionsRepository,
        private usersRepository: UsersRepository
    ) { }

    async execute({
        sessionId,
        userId
    }: rejectSessionServiceRequest): Promise<rejectSessionServiceResponse> {

        const session = await this.sessionsRepository.findById(sessionId);

        if (!session) {
            throw new NotFoundError("Sessão não encontrada");
        }

        if (session.status === "rejeitada") {
            throw new SessionAlreadyRejectedError();
        }

        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundError("Usuário não encontrado");
        }

        session.status = "rejeitada";

        await this.sessionsRepository.update(session.id, {
            status: session.status,
        });

        return {
            sessionId: session.id,
            userId: user.id
        };
    }
}