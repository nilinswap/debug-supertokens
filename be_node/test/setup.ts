import supertest from "supertest";
import chai from "chai";
import sinonChai from "sinon-chai";
import app from "../src/app";
import "mocha";

chai.use(sinonChai);
export const { expect } = chai;
export const server = supertest(app);
export const BASE_URL = "/api";
