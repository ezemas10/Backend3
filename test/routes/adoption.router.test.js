import {describe, it, after} from "mocha"
import supertest from "supertest"
import {expect} from "chai"
import mongoose from "mongoose"
import { server } from "../../src/app.js"
import userModel from "../../src/dao/models/User.js"
import petModel from "../../src/dao/models/Pet.js"



await mongoose.connect(process.env.MONGO_URL,{
    dbName:process.env.DB_NAME
})

const requester=supertest(server)


describe("Pruebas router adoptions", ()=>{

    it("El endpoint /api/adoptions, metodo get, retorna un objeto con la property status, valor success", async()=>{
        let resultado=await requester.get("/api/adoptions")
        // console.log(resultado)

        expect(resultado.body).to.has.property("status").and.to.be.eq("success")
    })

    it("El endpoint /api/adoptions, metodo get, retorna un objeto con la property payload, de tipo array", async()=>{
        let resultado=await requester.get("/api/adoptions")
        // console.log(resultado)

        expect(resultado.body).to.has.property("payload")
        expect(Array.isArray(resultado.body.payload)).to.be.true
    })

    it("El endpoint /api/adoptions, metodo get, retorna un objeto con la property payload, de tipo array de adopciones", async()=>{
        let resultado=await requester.get("/api/adoptions")
        // console.log(resultado)

        expect(resultado.body).to.has.property("payload")
        expect(Array.isArray(resultado.body.payload)).to.be.true
        if(resultado.body.payload.length>0){
            expect(resultado.body.payload[0]).to.has.property("_id")
        }
    })

    it("El endpoint /api/adoptions/:aid, metodo get, retorna error si la adopcion no existe", async()=>{
        let adoptionId="000000000000000000000000"
        let resultado=await requester.get(`/api/adoptions/${adoptionId}`)
        // console.log(resultado)

        expect(resultado.body).to.has.property("status").and.to.be.eq("error")
    })


    it("El endpoint /api/adoptions/:aid, metodo get, retorna una adopcion si el id existe", async()=>{
        let resultadoAdoptions=await requester.get("/api/adoptions")
        // console.log(resultadoAdoptions.body)

        if(resultadoAdoptions.body.payload.length>0){
            let adoptionId=resultadoAdoptions.body.payload[0]._id

            let resultado=await requester.get(`/api/adoptions/${adoptionId}`)
            // console.log(resultado)

            expect(resultado.body).to.has.property("status").and.to.be.eq("success")
            expect(resultado.body).to.has.property("payload")
            expect(resultado.body.payload).to.has.property("_id").and.to.be.eq(adoptionId)
            }
    })


    it("El endpoint /api/adoptions/:uid/:pid, metodo post, retorna error si el usuario no existe", async()=>{
        let userId="111111111111111111111111"
        let petId="999999999999999999999999"

        let resultado=await requester.post(`/api/adoptions/${userId}/${petId}`)

        expect(resultado.body).to.has.property("status").and.to.be.eq("error")
        expect(resultado.body).to.has.property("error").and.to.be.eq("user Not found")


    })

    it("El endpoint /api/adoptions/:uid/:pid, metodo post, retorna error si la mascota no existe", async()=>{

        const usuarioMock={
        first_name:"Juan",
        last_name:"Crespo",
        email:"jcrespo1@test.com",
        password:"123"
        }

        let usuarioCreado=await userModel.create(usuarioMock)
        let userId=usuarioCreado._id.toString()
        let petId="999999999999999999999999"

        let resultado=await requester.post(`/api/adoptions/${userId}/${petId}`)
        // console.log(resultado)

        expect(resultado.body).to.has.property("status").and.to.be.eq("error")
        expect(resultado.body).to.has.property("error").and.to.be.eq("Pet not found")

    })

    it("El endpoint /api/adoptions/:uid/:pid, metodo post, retorna error si la mascota ya fue adoptada", async()=>{

        const usuarioMock={
            first_name:"Juan",
            last_name:"Crespo",
            email:"jcrespo2@test.com",
            password:"123"
        }
    
        let usuarioCreado=await userModel.create(usuarioMock)

        const petMock={
                name: "Marshall", 
                specie: "dog", 
                birthDate: "20201406",
                adopted:true
            }

        let mascotaCreada=await petModel.create(petMock)

        let userId=usuarioCreado._id.toString()
        let petId=mascotaCreada._id.toString()

        let resultado=await requester.post(`/api/adoptions/${userId}/${petId}`)
        // console.log(resultado)

        expect(resultado.body).to.has.property("status").and.to.be.eq("error")
        expect(resultado.body).to.has.property("error").and.to.be.eq("Pet is already adopted")

    })


    it("El endpoint /api/adoptions/:uid/:pid, metodo post, permite crear una adopcion", async()=>{

        const usuarioMock={
            first_name:"Juan",
            last_name:"Crespo",
            email:"jcrespo3@test.com",
            password:"123"
        }

        let usuarioCreado=await userModel.create(usuarioMock)

        const petMock={
                name: "Marshall", 
                specie: "dog", 
                birthDate: "20201406",
            }

        let mascotaCreada=await petModel.create(petMock)

        let userId=usuarioCreado._id.toString()
        let petId=mascotaCreada._id.toString()

        let resultado=await requester.post(`/api/adoptions/${userId}/${petId}`)
        // console.log(resultado)

        expect(resultado.body).to.has.property("status").and.to.be.eq("success")
        expect(resultado.body).to.has.property("message").and.to.be.eq("Pet adopted")

    })

    after(async()=>{

        await mongoose.connection.collection("users").deleteOne({email:"jcrespo1@test.com"})
        await mongoose.connection.collection("users").deleteOne({email:"jcrespo2@test.com"})
        await mongoose.connection.collection("users").deleteOne({email:"jcrespo3@test.com"})

        await mongoose.connection.collection("pets").deleteOne({name:"Marshall"})
    })

})