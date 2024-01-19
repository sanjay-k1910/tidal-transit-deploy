import { apiRoutes } from "../config/apiRoutes"
import { envConfig } from "../config/envConfig"
import API from "./api"
import { createClient } from '@supabase/supabase-js'
import CryptoJS from "crypto-js"

export interface UserSignUpData {
    email: string,
}
export interface AddPasswordDetails {
    email: string
    password: string
    isPasskey: boolean
    firstName: string | null
    lastName: string | null
}
export interface UserSignInData {
    email: string | undefined,
    isPasskey: boolean,
    password?: string
}
export interface EmailVerifyData {
    verificationCode: string,
    email: string
}


export const getSupabaseClient = () => {

    let supabaseUrl = ''
    let supabaseAnonKey = ''

    try {
        supabaseUrl = process.env.PUBLIC_SUPABASE_URL || envConfig.PUBLIC_SUPABASE_URL;
        supabaseAnonKey = process.env.PUBLIC_SUPABASE_KEY || envConfig.PUBLIC_SUPABASE_KEY;
    } catch (error) {
        supabaseUrl = envConfig.PUBLIC_SUPABASE_URL
        supabaseAnonKey = envConfig.PUBLIC_SUPABASE_KEY
    }

    return createClient(supabaseUrl, supabaseAnonKey)
}

export const passwordEncryption = (password: string): string => {
    const CRYPTO_PRIVATE_KEY: string = `${envConfig.PUBLIC_CRYPTO_PRIVATE_KEY}`
    const encryptedPassword: string = CryptoJS.AES.encrypt(JSON.stringify(password), CRYPTO_PRIVATE_KEY).toString()
    return encryptedPassword
}


export const loginUser = async () => {
    const payload: UserSignInData = {
        email: envConfig.PUBLIC_EMAIL,
        isPasskey: false,
        // password: 'U2FsdGVkX18Y7bdtrjA444InlqFbMTownPCloGszjy0='
        password: passwordEncryption(envConfig.PUBLIC_PASSWORD)
    }
    console.log(324324, payload)
    try {
        const response = await API({
            url: `${apiRoutes.sinIn}`,
            method: 'POST',
            payload
        });
        console.log(345345, response)
        localStorage.setItem('session', response?.data?.access_token)
        return response?.data?.access_token;
    }
    catch (error) {
        const err = error as Error
        return err?.message
    }
}

// Try 5 times
const limit = 5;
let count = 0
export const reCallAPI = async (error: any, api: any, params: any = []) => {
    try {
        console.log(35345345, params, error);
        if (error.statusCode === 401 && count <= limit) {
            const token = await loginUser()
            console.log(23123, token)
            count++;
            return await api(token, ...params)
        } else {
            console.error("Recall not required ERROR:::", error)
            throw error
        }
    } catch (err) {
        console.log("RECALL ERROR:::", err)
        throw err
    }
}