import dayjs from "dayjs";
import { client } from "../../database/client"
import { GenerateRefreshTokenProvider } from "../../provider/GenerateRefreshTokenProvider";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

class RefreshTokenUserUseCase {
    async execute(refresh_token: string) {
        const refreshToken = await client.refreshToken.findFirst({
            where: {
                id: refresh_token
            }
        })

        if (!refreshToken) {
            throw new Error("Refresh token invalid");
        }

        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn))

        const generateToken = new GenerateTokenProvider();
        const token = await generateToken.execute(refreshToken.userId);

        if (refreshTokenExpired) {
            await client.refreshToken.deleteMany({
                where: {
                    userId: refreshToken.userId
                }
            })

            const generateRefreshToken = new GenerateRefreshTokenProvider()
            const newRefreshToken = generateRefreshToken.execute(refreshToken.userId)

            return { token, newRefreshToken }
        }

        return { token }
    }
}

export { RefreshTokenUserUseCase }