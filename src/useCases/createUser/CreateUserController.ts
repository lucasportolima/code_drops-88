import { Response, Request } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";


class CreateUserController {
    async handle(request: Request, response: Response) {
        const { username, name, password } = request.body;

        const createUserUserCase = new CreateUserUseCase();

        const user = await createUserUserCase.execute({
            username,
            name,
            password
        })

        return response.json(user);
    }
}

export { CreateUserController }