"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Employer",
    embedded: false
  },
  {
    name: "Suffix",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "VerificationToken",
    embedded: false
  },
  {
    name: "Loan",
    embedded: false
  },
  {
    name: "PaymentRequest",
    embedded: false
  },
  {
    name: "ChildcareProvider",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SECRET"]}`
});
exports.prisma = new exports.Prisma();
