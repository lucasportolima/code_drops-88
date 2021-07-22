import { hash } from "bcryptjs"

import { client } from "../../database/client"

interface IUserRequest {
    name: string;
    password: string;
    username: string;
}

class CreateUserUseCase {
    async execute({ name, username, password }: IUserRequest) {
        // Verificar se o usuário existe
        const userAlreadyExists = await client.user.findFirst({
            where: {
                username
            }
        })

        if (userAlreadyExists) {
            throw new Error("User already exists!")
        }
        // Cadastra o usuário

        const passwordHash = await hash(password, 8)

        const user = client.user.create({
            data: {
                name,
                username,
                password: passwordHash
            }
        })

        return user
    }
}

export { CreateUserUseCase }