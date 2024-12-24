import { Header, Gateway, APIError, Query } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParam {
    authHeader?: Header<"Authorization">
    apiHeader?: Header<"X-API-Key">
    apiQuery?: Query<"api_key">
} 

interface AuthData {
    userID: string
}

export const  AuthHandler = authHandler<AuthParam, AuthData>( 
    async (params) =>  {

        const token = params.authHeader??params.apiHeader??params.apiQuery
        if (token !== "password") throw APIError.unauthenticated("Invalid key")
        return {userID: "valid"}
        
    }
)


export const gateway = new Gateway({authHandler: AuthHandler})