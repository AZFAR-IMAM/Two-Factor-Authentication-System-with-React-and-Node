import {connect} from "mongoose"

const dbConnect = async()=>{
    try {
        const mongoDbConnection = await connect(process.env.DB_CONNECTION_STRING);
        console.log(`Database connected ${mongoDbConnection.connection.host}`);
    } catch (error) {
        console.log(`Database Connection failed ${error.message}`);
        process.exit(1);
    }
}
export default  dbConnect