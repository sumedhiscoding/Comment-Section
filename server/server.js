import fastify from "fastify";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
dotenv.config();

const prisma=new PrismaClient(()=>{
    console.log("connected to prisma")
})

const app =fastify();
app.register(sensible);
app.register(cors,{
    origin:process.env.CLIENT_URL,
    credentials : true,
});
// app.register(fastifyCors);
app.get("/posts", async (req, res) => {
    return await commitToDb(
      prisma.post.findMany({
        select: {
          id: true,
          title: true,
        },
      })
    )
  })


async function commitToDb(promise){
const[error,data]= await app.to(promise)
if (error) return app.httpErrors.internalServerError(error.message)
return data;
}


app.listen( {port : process.env.PORT},()=>{
    console.log(`Server running on Port: ${process.env.PORT}}`)
})