import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    default_password: process.env.DEFAULT_PASS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_pass_ui_link: process.env.RESET_PASSWORD,
    cloudinary_cloud_name: process.env.CLOUDINARY_APP_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    reset_sender_account_email: process.env.RESET_SENDER_ACCOUNT_EMAIL,
    reset_sender_account_password: process.env.RESET_SENDER_ACCOUNT_PASSWORD,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
}
