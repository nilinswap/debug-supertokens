import { expect, server, BASE_URL } from "./setup"
import mongoose from "mongoose"

describe("Index page test", () => {
  it("gets base url", done => {
    server
      .get(`${BASE_URL}/`)
      .expect(200)
      .end((err: any, res: any) => {
        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal(
          "Test Environment variable is coming across."
        )
        done()
      })
  })
})

var COOKIES: string = ""
describe("test add user", () => {
  it("adds user", done => {
    const data = {
      email: "mariamlass@gm.in",
      first_name: "Mariam",
      last_name: "Lass",
      password: "password",
    }
    server
      .post(`${BASE_URL}/register`)
      .send(data)
      .expect(200)
      .end((_err: any, res: any) => {
        expect(res.status).to.equal(200)
        expect(res.body.status).to.equal("success")
        expect(res.body.data.row_count).to.equal(1)
        expect(res.header).to.have.property("set-cookie")
        let cookie = res.header["set-cookie"].pop().split(";")[0]
        console.log("cookie", cookie)
        COOKIES = cookie
        //  res.header["set-cookie"]
        //   .map(function (r: string) {
        //     return r.replace("; path=/; httponly", "")
        //   })
        //   .join("; ")
        console.log("COOKIES", COOKIES)
        let key = cookie.split("=")[0]
        expect(key).to.equal("connect.sid")
        done()
      })
  })
  it("get cart", done => {
    let req = server.get(`${BASE_URL}/cart/`)
    req.cookies = COOKIES
    req.expect(200).end((_err: any, res: any) => {
      expect(res.status).to.equal(200)
      expect(res.body.data.products).to.have.lengthOf(2)
      expect(res.body.data.products).contains(1)
      expect(res.body.data.products).contains(2)
      done()
    })
  })
})

describe("test user", () => {
  it("login user", done => {
    const data = {
      email: "mariamlass@gm.in",
      password: "password",
    }
    server
      .post(`${BASE_URL}/login`)
      .send(data)
      .expect(200)
      .end((_err: any, res: any) => {
        expect(res.status).to.equal(200)
        expect(res.body.status).to.equal("success")
        const user = res.body.data.user

        expect(user.email).to.equal("mariamlass@gm.in")
        expect(user.first_name).to.equal("Mariam")
        expect(user.last_name).to.equal("Lass")
        expect(user.phone).to.equal("0000000000")
        done()
      })
  })
  afterEach(async () => {
    try {
      await mongoose.connection.close()
    } catch (error) {
      console.log(error)
    }
  })
})

// describe("test get artifacts", () => {
//   it("get artifacts", done => {
//     let afid = 1
//     server
//       .get(`${BASE_URL}/artifact?afid=` + afid.toString())
//       .expect(200)
//       .end((_err: any, res: any) => {
//         expect(res.status).to.equal(200)
//         expect(res.body.data.artifacts).to.have.lengthOf(1)
//         expect(res.body.data.artifacts[0].artist_id).to.be.equal(1)
//         expect(res.body.data.artifacts[0].title).to.be.equal("Falling Sky")
//         expect(res.body.data.artifacts[0].description).to.be.equal(
//           "When river turns red, God wraths, sky falls. It is a depiction of a time when God ended the war"
//         )
//         expect(res.body.data.artifacts[0].price).to.be.equal(40.4)
//         expect(res.body.data.artifacts[0].is_exclusive).to.be.equal(true)
//         done()
//       })
//   })
// })

// describe("test get order", () => {
//   it("get order", done => {
//     let uid = 1
//     server
//       .get(`${BASE_URL}/order?uid=` + uid.toString())
//       .expect(200)
//       .end((_err: any, res: any) => {
//         expect(res.status).to.equal(200)
//         expect(res.body.data.orders).to.have.lengthOf(0)
//         done()
//       })
//   })
// })

// describe("test get payment", () => {
//   it("get payment", done => {
//     let uid = 1
//     server
//       .get(`${BASE_URL}/payment?pymtid=` + uid.toString())
//       .expect(200)
//       .end((_err: any, res: any) => {
//         expect(res.status).to.equal(200)
//         expect(res.body.data.payments).to.have.lengthOf(0)
//         done()
//       })
//   })
// })
