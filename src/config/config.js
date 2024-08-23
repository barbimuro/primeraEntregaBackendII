import {config} from 'dotenv';
import {Command} from 'commander';

/*const program = new Command();

program.requiredOption('-m, --mode <mode>','Server mode','prod')

program.parse();

const options = program.opts();*/

config();

export default {
    app:{
        PORT: process.env.PORT||8080,
       // ADMIN_PWD: process.env.ADMIN_PASSWORD,
    },
    mongo:{
        URL:process.env.MONGO_URL,
    },
    auth:{
        jwt:{
            COOKIE: process.env.JWT_COOKIE,
            SECRET: process.env.JWT_SECRET
        },
        github:{
            CLIENT_ID: process.env.GITHUB_CLIENT_ID,
            CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
        }
    }
}