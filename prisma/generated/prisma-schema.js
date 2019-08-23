module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.34.6). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateEligibilityCriteria {
  count: Int!
}

type AggregateEmployer {
  count: Int!
}

type AggregateLoan {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type AggregateVerificationToken {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

type EligibilityCriteria {
  id: ID!
  maximumAmount: Float!
  minimumServiceLength: Int!
  maxSalaryPercentage: Float!
}

type EligibilityCriteriaConnection {
  pageInfo: PageInfo!
  edges: [EligibilityCriteriaEdge]!
  aggregate: AggregateEligibilityCriteria!
}

input EligibilityCriteriaCreateInput {
  id: ID
  maximumAmount: Float!
  minimumServiceLength: Int!
  maxSalaryPercentage: Float!
}

input EligibilityCriteriaCreateOneInput {
  create: EligibilityCriteriaCreateInput
  connect: EligibilityCriteriaWhereUniqueInput
}

type EligibilityCriteriaEdge {
  node: EligibilityCriteria!
  cursor: String!
}

enum EligibilityCriteriaOrderByInput {
  id_ASC
  id_DESC
  maximumAmount_ASC
  maximumAmount_DESC
  minimumServiceLength_ASC
  minimumServiceLength_DESC
  maxSalaryPercentage_ASC
  maxSalaryPercentage_DESC
}

type EligibilityCriteriaPreviousValues {
  id: ID!
  maximumAmount: Float!
  minimumServiceLength: Int!
  maxSalaryPercentage: Float!
}

type EligibilityCriteriaSubscriptionPayload {
  mutation: MutationType!
  node: EligibilityCriteria
  updatedFields: [String!]
  previousValues: EligibilityCriteriaPreviousValues
}

input EligibilityCriteriaSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: EligibilityCriteriaWhereInput
  AND: [EligibilityCriteriaSubscriptionWhereInput!]
  OR: [EligibilityCriteriaSubscriptionWhereInput!]
  NOT: [EligibilityCriteriaSubscriptionWhereInput!]
}

input EligibilityCriteriaUpdateDataInput {
  maximumAmount: Float
  minimumServiceLength: Int
  maxSalaryPercentage: Float
}

input EligibilityCriteriaUpdateInput {
  maximumAmount: Float
  minimumServiceLength: Int
  maxSalaryPercentage: Float
}

input EligibilityCriteriaUpdateManyMutationInput {
  maximumAmount: Float
  minimumServiceLength: Int
  maxSalaryPercentage: Float
}

input EligibilityCriteriaUpdateOneInput {
  create: EligibilityCriteriaCreateInput
  update: EligibilityCriteriaUpdateDataInput
  upsert: EligibilityCriteriaUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: EligibilityCriteriaWhereUniqueInput
}

input EligibilityCriteriaUpsertNestedInput {
  update: EligibilityCriteriaUpdateDataInput!
  create: EligibilityCriteriaCreateInput!
}

input EligibilityCriteriaWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  maximumAmount: Float
  maximumAmount_not: Float
  maximumAmount_in: [Float!]
  maximumAmount_not_in: [Float!]
  maximumAmount_lt: Float
  maximumAmount_lte: Float
  maximumAmount_gt: Float
  maximumAmount_gte: Float
  minimumServiceLength: Int
  minimumServiceLength_not: Int
  minimumServiceLength_in: [Int!]
  minimumServiceLength_not_in: [Int!]
  minimumServiceLength_lt: Int
  minimumServiceLength_lte: Int
  minimumServiceLength_gt: Int
  minimumServiceLength_gte: Int
  maxSalaryPercentage: Float
  maxSalaryPercentage_not: Float
  maxSalaryPercentage_in: [Float!]
  maxSalaryPercentage_not_in: [Float!]
  maxSalaryPercentage_lt: Float
  maxSalaryPercentage_lte: Float
  maxSalaryPercentage_gt: Float
  maxSalaryPercentage_gte: Float
  AND: [EligibilityCriteriaWhereInput!]
  OR: [EligibilityCriteriaWhereInput!]
  NOT: [EligibilityCriteriaWhereInput!]
}

input EligibilityCriteriaWhereUniqueInput {
  id: ID
}

type Employer {
  id: ID!
  name: String!
  slug: String!
  user(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User!]
  eligibilityCriteria: EligibilityCriteria
  updatedAt: DateTime!
  createdAt: DateTime!
}

type EmployerConnection {
  pageInfo: PageInfo!
  edges: [EmployerEdge]!
  aggregate: AggregateEmployer!
}

input EmployerCreateInput {
  id: ID
  name: String!
  slug: String!
  user: UserCreateManyWithoutEmployerInput
  eligibilityCriteria: EligibilityCriteriaCreateOneInput
}

input EmployerCreateOneWithoutUserInput {
  create: EmployerCreateWithoutUserInput
  connect: EmployerWhereUniqueInput
}

input EmployerCreateWithoutUserInput {
  id: ID
  name: String!
  slug: String!
  eligibilityCriteria: EligibilityCriteriaCreateOneInput
}

type EmployerEdge {
  node: Employer!
  cursor: String!
}

enum EmployerOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  slug_ASC
  slug_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type EmployerPreviousValues {
  id: ID!
  name: String!
  slug: String!
  updatedAt: DateTime!
  createdAt: DateTime!
}

type EmployerSubscriptionPayload {
  mutation: MutationType!
  node: Employer
  updatedFields: [String!]
  previousValues: EmployerPreviousValues
}

input EmployerSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: EmployerWhereInput
  AND: [EmployerSubscriptionWhereInput!]
  OR: [EmployerSubscriptionWhereInput!]
  NOT: [EmployerSubscriptionWhereInput!]
}

input EmployerUpdateInput {
  name: String
  slug: String
  user: UserUpdateManyWithoutEmployerInput
  eligibilityCriteria: EligibilityCriteriaUpdateOneInput
}

input EmployerUpdateManyMutationInput {
  name: String
  slug: String
}

input EmployerUpdateOneRequiredWithoutUserInput {
  create: EmployerCreateWithoutUserInput
  update: EmployerUpdateWithoutUserDataInput
  upsert: EmployerUpsertWithoutUserInput
  connect: EmployerWhereUniqueInput
}

input EmployerUpdateWithoutUserDataInput {
  name: String
  slug: String
  eligibilityCriteria: EligibilityCriteriaUpdateOneInput
}

input EmployerUpsertWithoutUserInput {
  update: EmployerUpdateWithoutUserDataInput!
  create: EmployerCreateWithoutUserInput!
}

input EmployerWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  slug: String
  slug_not: String
  slug_in: [String!]
  slug_not_in: [String!]
  slug_lt: String
  slug_lte: String
  slug_gt: String
  slug_gte: String
  slug_contains: String
  slug_not_contains: String
  slug_starts_with: String
  slug_not_starts_with: String
  slug_ends_with: String
  slug_not_ends_with: String
  user_every: UserWhereInput
  user_some: UserWhereInput
  user_none: UserWhereInput
  eligibilityCriteria: EligibilityCriteriaWhereInput
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  AND: [EmployerWhereInput!]
  OR: [EmployerWhereInput!]
  NOT: [EmployerWhereInput!]
}

input EmployerWhereUniqueInput {
  id: ID
  slug: String
}

type Loan {
  id: ID!
  amount: Float!
  terms: Int!
  approved: Boolean!
  agreementURL: String
  updatedAt: DateTime!
  createdAt: DateTime!
}

type LoanConnection {
  pageInfo: PageInfo!
  edges: [LoanEdge]!
  aggregate: AggregateLoan!
}

input LoanCreateInput {
  id: ID
  amount: Float!
  terms: Int!
  approved: Boolean!
  agreementURL: String
}

input LoanCreateOneInput {
  create: LoanCreateInput
  connect: LoanWhereUniqueInput
}

type LoanEdge {
  node: Loan!
  cursor: String!
}

enum LoanOrderByInput {
  id_ASC
  id_DESC
  amount_ASC
  amount_DESC
  terms_ASC
  terms_DESC
  approved_ASC
  approved_DESC
  agreementURL_ASC
  agreementURL_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type LoanPreviousValues {
  id: ID!
  amount: Float!
  terms: Int!
  approved: Boolean!
  agreementURL: String
  updatedAt: DateTime!
  createdAt: DateTime!
}

type LoanSubscriptionPayload {
  mutation: MutationType!
  node: Loan
  updatedFields: [String!]
  previousValues: LoanPreviousValues
}

input LoanSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: LoanWhereInput
  AND: [LoanSubscriptionWhereInput!]
  OR: [LoanSubscriptionWhereInput!]
  NOT: [LoanSubscriptionWhereInput!]
}

input LoanUpdateDataInput {
  amount: Float
  terms: Int
  approved: Boolean
  agreementURL: String
}

input LoanUpdateInput {
  amount: Float
  terms: Int
  approved: Boolean
  agreementURL: String
}

input LoanUpdateManyMutationInput {
  amount: Float
  terms: Int
  approved: Boolean
  agreementURL: String
}

input LoanUpdateOneInput {
  create: LoanCreateInput
  update: LoanUpdateDataInput
  upsert: LoanUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: LoanWhereUniqueInput
}

input LoanUpsertNestedInput {
  update: LoanUpdateDataInput!
  create: LoanCreateInput!
}

input LoanWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  amount: Float
  amount_not: Float
  amount_in: [Float!]
  amount_not_in: [Float!]
  amount_lt: Float
  amount_lte: Float
  amount_gt: Float
  amount_gte: Float
  terms: Int
  terms_not: Int
  terms_in: [Int!]
  terms_not_in: [Int!]
  terms_lt: Int
  terms_lte: Int
  terms_gt: Int
  terms_gte: Int
  approved: Boolean
  approved_not: Boolean
  agreementURL: String
  agreementURL_not: String
  agreementURL_in: [String!]
  agreementURL_not_in: [String!]
  agreementURL_lt: String
  agreementURL_lte: String
  agreementURL_gt: String
  agreementURL_gte: String
  agreementURL_contains: String
  agreementURL_not_contains: String
  agreementURL_starts_with: String
  agreementURL_not_starts_with: String
  agreementURL_ends_with: String
  agreementURL_not_ends_with: String
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  AND: [LoanWhereInput!]
  OR: [LoanWhereInput!]
  NOT: [LoanWhereInput!]
}

input LoanWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createEligibilityCriteria(data: EligibilityCriteriaCreateInput!): EligibilityCriteria!
  updateEligibilityCriteria(data: EligibilityCriteriaUpdateInput!, where: EligibilityCriteriaWhereUniqueInput!): EligibilityCriteria
  updateManyEligibilityCriterias(data: EligibilityCriteriaUpdateManyMutationInput!, where: EligibilityCriteriaWhereInput): BatchPayload!
  upsertEligibilityCriteria(where: EligibilityCriteriaWhereUniqueInput!, create: EligibilityCriteriaCreateInput!, update: EligibilityCriteriaUpdateInput!): EligibilityCriteria!
  deleteEligibilityCriteria(where: EligibilityCriteriaWhereUniqueInput!): EligibilityCriteria
  deleteManyEligibilityCriterias(where: EligibilityCriteriaWhereInput): BatchPayload!
  createEmployer(data: EmployerCreateInput!): Employer!
  updateEmployer(data: EmployerUpdateInput!, where: EmployerWhereUniqueInput!): Employer
  updateManyEmployers(data: EmployerUpdateManyMutationInput!, where: EmployerWhereInput): BatchPayload!
  upsertEmployer(where: EmployerWhereUniqueInput!, create: EmployerCreateInput!, update: EmployerUpdateInput!): Employer!
  deleteEmployer(where: EmployerWhereUniqueInput!): Employer
  deleteManyEmployers(where: EmployerWhereInput): BatchPayload!
  createLoan(data: LoanCreateInput!): Loan!
  updateLoan(data: LoanUpdateInput!, where: LoanWhereUniqueInput!): Loan
  updateManyLoans(data: LoanUpdateManyMutationInput!, where: LoanWhereInput): BatchPayload!
  upsertLoan(where: LoanWhereUniqueInput!, create: LoanCreateInput!, update: LoanUpdateInput!): Loan!
  deleteLoan(where: LoanWhereUniqueInput!): Loan
  deleteManyLoans(where: LoanWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
  createVerificationToken(data: VerificationTokenCreateInput!): VerificationToken!
  updateVerificationToken(data: VerificationTokenUpdateInput!, where: VerificationTokenWhereUniqueInput!): VerificationToken
  updateManyVerificationTokens(data: VerificationTokenUpdateManyMutationInput!, where: VerificationTokenWhereInput): BatchPayload!
  upsertVerificationToken(where: VerificationTokenWhereUniqueInput!, create: VerificationTokenCreateInput!, update: VerificationTokenUpdateInput!): VerificationToken!
  deleteVerificationToken(where: VerificationTokenWhereUniqueInput!): VerificationToken
  deleteManyVerificationTokens(where: VerificationTokenWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  eligibilityCriteria(where: EligibilityCriteriaWhereUniqueInput!): EligibilityCriteria
  eligibilityCriterias(where: EligibilityCriteriaWhereInput, orderBy: EligibilityCriteriaOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [EligibilityCriteria]!
  eligibilityCriteriasConnection(where: EligibilityCriteriaWhereInput, orderBy: EligibilityCriteriaOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): EligibilityCriteriaConnection!
  employer(where: EmployerWhereUniqueInput!): Employer
  employers(where: EmployerWhereInput, orderBy: EmployerOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Employer]!
  employersConnection(where: EmployerWhereInput, orderBy: EmployerOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): EmployerConnection!
  loan(where: LoanWhereUniqueInput!): Loan
  loans(where: LoanWhereInput, orderBy: LoanOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Loan]!
  loansConnection(where: LoanWhereInput, orderBy: LoanOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): LoanConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  verificationToken(where: VerificationTokenWhereUniqueInput!): VerificationToken
  verificationTokens(where: VerificationTokenWhereInput, orderBy: VerificationTokenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [VerificationToken]!
  verificationTokensConnection(where: VerificationTokenWhereInput, orderBy: VerificationTokenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): VerificationTokenConnection!
  node(id: ID!): Node
}

type Subscription {
  eligibilityCriteria(where: EligibilityCriteriaSubscriptionWhereInput): EligibilityCriteriaSubscriptionPayload
  employer(where: EmployerSubscriptionWhereInput): EmployerSubscriptionPayload
  loan(where: LoanSubscriptionWhereInput): LoanSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  verificationToken(where: VerificationTokenSubscriptionWhereInput): VerificationTokenSubscriptionPayload
}

type User {
  id: ID!
  employer: Employer!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String!
  dob: DateTime!
  nationality: String!
  employmentStartDate: DateTime!
  annualSalary: Float!
  employeeID: String
  verificationToken: VerificationToken
  loan: Loan
  updatedAt: DateTime!
  createdAt: DateTime!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  employer: EmployerCreateOneWithoutUserInput!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String!
  dob: DateTime!
  nationality: String!
  employmentStartDate: DateTime!
  annualSalary: Float!
  employeeID: String
  verificationToken: VerificationTokenCreateOneInput
  loan: LoanCreateOneInput
}

input UserCreateManyWithoutEmployerInput {
  create: [UserCreateWithoutEmployerInput!]
  connect: [UserWhereUniqueInput!]
}

input UserCreateWithoutEmployerInput {
  id: ID
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String!
  dob: DateTime!
  nationality: String!
  employmentStartDate: DateTime!
  annualSalary: Float!
  employeeID: String
  verificationToken: VerificationTokenCreateOneInput
  loan: LoanCreateOneInput
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  firstName_ASC
  firstName_DESC
  lastName_ASC
  lastName_DESC
  email_ASC
  email_DESC
  phoneNumber_ASC
  phoneNumber_DESC
  dob_ASC
  dob_DESC
  nationality_ASC
  nationality_DESC
  employmentStartDate_ASC
  employmentStartDate_DESC
  annualSalary_ASC
  annualSalary_DESC
  employeeID_ASC
  employeeID_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type UserPreviousValues {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String!
  dob: DateTime!
  nationality: String!
  employmentStartDate: DateTime!
  annualSalary: Float!
  employeeID: String
  updatedAt: DateTime!
  createdAt: DateTime!
}

input UserScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  firstName: String
  firstName_not: String
  firstName_in: [String!]
  firstName_not_in: [String!]
  firstName_lt: String
  firstName_lte: String
  firstName_gt: String
  firstName_gte: String
  firstName_contains: String
  firstName_not_contains: String
  firstName_starts_with: String
  firstName_not_starts_with: String
  firstName_ends_with: String
  firstName_not_ends_with: String
  lastName: String
  lastName_not: String
  lastName_in: [String!]
  lastName_not_in: [String!]
  lastName_lt: String
  lastName_lte: String
  lastName_gt: String
  lastName_gte: String
  lastName_contains: String
  lastName_not_contains: String
  lastName_starts_with: String
  lastName_not_starts_with: String
  lastName_ends_with: String
  lastName_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  phoneNumber: String
  phoneNumber_not: String
  phoneNumber_in: [String!]
  phoneNumber_not_in: [String!]
  phoneNumber_lt: String
  phoneNumber_lte: String
  phoneNumber_gt: String
  phoneNumber_gte: String
  phoneNumber_contains: String
  phoneNumber_not_contains: String
  phoneNumber_starts_with: String
  phoneNumber_not_starts_with: String
  phoneNumber_ends_with: String
  phoneNumber_not_ends_with: String
  dob: DateTime
  dob_not: DateTime
  dob_in: [DateTime!]
  dob_not_in: [DateTime!]
  dob_lt: DateTime
  dob_lte: DateTime
  dob_gt: DateTime
  dob_gte: DateTime
  nationality: String
  nationality_not: String
  nationality_in: [String!]
  nationality_not_in: [String!]
  nationality_lt: String
  nationality_lte: String
  nationality_gt: String
  nationality_gte: String
  nationality_contains: String
  nationality_not_contains: String
  nationality_starts_with: String
  nationality_not_starts_with: String
  nationality_ends_with: String
  nationality_not_ends_with: String
  employmentStartDate: DateTime
  employmentStartDate_not: DateTime
  employmentStartDate_in: [DateTime!]
  employmentStartDate_not_in: [DateTime!]
  employmentStartDate_lt: DateTime
  employmentStartDate_lte: DateTime
  employmentStartDate_gt: DateTime
  employmentStartDate_gte: DateTime
  annualSalary: Float
  annualSalary_not: Float
  annualSalary_in: [Float!]
  annualSalary_not_in: [Float!]
  annualSalary_lt: Float
  annualSalary_lte: Float
  annualSalary_gt: Float
  annualSalary_gte: Float
  employeeID: String
  employeeID_not: String
  employeeID_in: [String!]
  employeeID_not_in: [String!]
  employeeID_lt: String
  employeeID_lte: String
  employeeID_gt: String
  employeeID_gte: String
  employeeID_contains: String
  employeeID_not_contains: String
  employeeID_starts_with: String
  employeeID_not_starts_with: String
  employeeID_ends_with: String
  employeeID_not_ends_with: String
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  AND: [UserScalarWhereInput!]
  OR: [UserScalarWhereInput!]
  NOT: [UserScalarWhereInput!]
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  employer: EmployerUpdateOneRequiredWithoutUserInput
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
  dob: DateTime
  nationality: String
  employmentStartDate: DateTime
  annualSalary: Float
  employeeID: String
  verificationToken: VerificationTokenUpdateOneInput
  loan: LoanUpdateOneInput
}

input UserUpdateManyDataInput {
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
  dob: DateTime
  nationality: String
  employmentStartDate: DateTime
  annualSalary: Float
  employeeID: String
}

input UserUpdateManyMutationInput {
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
  dob: DateTime
  nationality: String
  employmentStartDate: DateTime
  annualSalary: Float
  employeeID: String
}

input UserUpdateManyWithoutEmployerInput {
  create: [UserCreateWithoutEmployerInput!]
  delete: [UserWhereUniqueInput!]
  connect: [UserWhereUniqueInput!]
  set: [UserWhereUniqueInput!]
  disconnect: [UserWhereUniqueInput!]
  update: [UserUpdateWithWhereUniqueWithoutEmployerInput!]
  upsert: [UserUpsertWithWhereUniqueWithoutEmployerInput!]
  deleteMany: [UserScalarWhereInput!]
  updateMany: [UserUpdateManyWithWhereNestedInput!]
}

input UserUpdateManyWithWhereNestedInput {
  where: UserScalarWhereInput!
  data: UserUpdateManyDataInput!
}

input UserUpdateWithoutEmployerDataInput {
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
  dob: DateTime
  nationality: String
  employmentStartDate: DateTime
  annualSalary: Float
  employeeID: String
  verificationToken: VerificationTokenUpdateOneInput
  loan: LoanUpdateOneInput
}

input UserUpdateWithWhereUniqueWithoutEmployerInput {
  where: UserWhereUniqueInput!
  data: UserUpdateWithoutEmployerDataInput!
}

input UserUpsertWithWhereUniqueWithoutEmployerInput {
  where: UserWhereUniqueInput!
  update: UserUpdateWithoutEmployerDataInput!
  create: UserCreateWithoutEmployerInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  employer: EmployerWhereInput
  firstName: String
  firstName_not: String
  firstName_in: [String!]
  firstName_not_in: [String!]
  firstName_lt: String
  firstName_lte: String
  firstName_gt: String
  firstName_gte: String
  firstName_contains: String
  firstName_not_contains: String
  firstName_starts_with: String
  firstName_not_starts_with: String
  firstName_ends_with: String
  firstName_not_ends_with: String
  lastName: String
  lastName_not: String
  lastName_in: [String!]
  lastName_not_in: [String!]
  lastName_lt: String
  lastName_lte: String
  lastName_gt: String
  lastName_gte: String
  lastName_contains: String
  lastName_not_contains: String
  lastName_starts_with: String
  lastName_not_starts_with: String
  lastName_ends_with: String
  lastName_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  phoneNumber: String
  phoneNumber_not: String
  phoneNumber_in: [String!]
  phoneNumber_not_in: [String!]
  phoneNumber_lt: String
  phoneNumber_lte: String
  phoneNumber_gt: String
  phoneNumber_gte: String
  phoneNumber_contains: String
  phoneNumber_not_contains: String
  phoneNumber_starts_with: String
  phoneNumber_not_starts_with: String
  phoneNumber_ends_with: String
  phoneNumber_not_ends_with: String
  dob: DateTime
  dob_not: DateTime
  dob_in: [DateTime!]
  dob_not_in: [DateTime!]
  dob_lt: DateTime
  dob_lte: DateTime
  dob_gt: DateTime
  dob_gte: DateTime
  nationality: String
  nationality_not: String
  nationality_in: [String!]
  nationality_not_in: [String!]
  nationality_lt: String
  nationality_lte: String
  nationality_gt: String
  nationality_gte: String
  nationality_contains: String
  nationality_not_contains: String
  nationality_starts_with: String
  nationality_not_starts_with: String
  nationality_ends_with: String
  nationality_not_ends_with: String
  employmentStartDate: DateTime
  employmentStartDate_not: DateTime
  employmentStartDate_in: [DateTime!]
  employmentStartDate_not_in: [DateTime!]
  employmentStartDate_lt: DateTime
  employmentStartDate_lte: DateTime
  employmentStartDate_gt: DateTime
  employmentStartDate_gte: DateTime
  annualSalary: Float
  annualSalary_not: Float
  annualSalary_in: [Float!]
  annualSalary_not_in: [Float!]
  annualSalary_lt: Float
  annualSalary_lte: Float
  annualSalary_gt: Float
  annualSalary_gte: Float
  employeeID: String
  employeeID_not: String
  employeeID_in: [String!]
  employeeID_not_in: [String!]
  employeeID_lt: String
  employeeID_lte: String
  employeeID_gt: String
  employeeID_gte: String
  employeeID_contains: String
  employeeID_not_contains: String
  employeeID_starts_with: String
  employeeID_not_starts_with: String
  employeeID_ends_with: String
  employeeID_not_ends_with: String
  verificationToken: VerificationTokenWhereInput
  loan: LoanWhereInput
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
  phoneNumber: String
}

type VerificationToken {
  id: ID!
  token: String!
  updatedAt: DateTime!
  createdAt: DateTime!
}

type VerificationTokenConnection {
  pageInfo: PageInfo!
  edges: [VerificationTokenEdge]!
  aggregate: AggregateVerificationToken!
}

input VerificationTokenCreateInput {
  id: ID
  token: String!
}

input VerificationTokenCreateOneInput {
  create: VerificationTokenCreateInput
  connect: VerificationTokenWhereUniqueInput
}

type VerificationTokenEdge {
  node: VerificationToken!
  cursor: String!
}

enum VerificationTokenOrderByInput {
  id_ASC
  id_DESC
  token_ASC
  token_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type VerificationTokenPreviousValues {
  id: ID!
  token: String!
  updatedAt: DateTime!
  createdAt: DateTime!
}

type VerificationTokenSubscriptionPayload {
  mutation: MutationType!
  node: VerificationToken
  updatedFields: [String!]
  previousValues: VerificationTokenPreviousValues
}

input VerificationTokenSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: VerificationTokenWhereInput
  AND: [VerificationTokenSubscriptionWhereInput!]
  OR: [VerificationTokenSubscriptionWhereInput!]
  NOT: [VerificationTokenSubscriptionWhereInput!]
}

input VerificationTokenUpdateDataInput {
  token: String
}

input VerificationTokenUpdateInput {
  token: String
}

input VerificationTokenUpdateManyMutationInput {
  token: String
}

input VerificationTokenUpdateOneInput {
  create: VerificationTokenCreateInput
  update: VerificationTokenUpdateDataInput
  upsert: VerificationTokenUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: VerificationTokenWhereUniqueInput
}

input VerificationTokenUpsertNestedInput {
  update: VerificationTokenUpdateDataInput!
  create: VerificationTokenCreateInput!
}

input VerificationTokenWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  token: String
  token_not: String
  token_in: [String!]
  token_not_in: [String!]
  token_lt: String
  token_lte: String
  token_gt: String
  token_gte: String
  token_contains: String
  token_not_contains: String
  token_starts_with: String
  token_not_starts_with: String
  token_ends_with: String
  token_not_ends_with: String
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  AND: [VerificationTokenWhereInput!]
  OR: [VerificationTokenWhereInput!]
  NOT: [VerificationTokenWhereInput!]
}

input VerificationTokenWhereUniqueInput {
  id: ID
  token: String
}
`
      }
    