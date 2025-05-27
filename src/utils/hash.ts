import 'dotenv/config'
import bcrypt from 'bcryptjs'

const SALTS = process.env.SALT_ROUNDS

export async function hash(password: string){
    const salt = await bcrypt.genSalt(SALTS ? parseInt(SALTS) : 10)
    return await bcrypt.hash(
        password, 
        salt
    )
}