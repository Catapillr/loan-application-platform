import styled from "styled-components"
import moment from "moment"
import * as R from "ramda"

import { Heading } from "../styles"

import tealTick from "../../../static/icons/teal-tick.svg"
import progress4 from "../../../static/images/progress4.svg"
import { BusinessDetails, Documents, BankDetails } from "./stepNames"

import nationalities from "../nationalityOptions"

const sections = [
  {
    heading: "Business Details",
    fields: [
      { title: "Business name", Field: "businessName", page: BusinessDetails },
      {
        title: "Generic business email",
        Field: "businessEmail",
        page: BusinessDetails,
      },
      {
        title: "Company Number",
        Field: "companyNumber",
        page: BusinessDetails,
      },
    ],
  },
  {
    heading: "Details of the Legal Representative",
    fields: [
      {
        title: "First name",
        Field: "ownerFirstName",
        page: BusinessDetails,
      },
      {
        title: "Last name",
        Field: "ownerLastName",
        page: BusinessDetails,
      },
      {
        title: "Key contact",
        Field: "ownerKeyContact",
        page: BusinessDetails,
      },
      {
        title: "Country of residence",
        Field: "ownerCountryOfResidence",
        page: BusinessDetails,
      },
      {
        title: "Nationality",
        Field: "ownerNationality",
        page: BusinessDetails,
      },
    ],
  },
  {
    heading: "Documents",
    fields: [
      {
        title: "Proof of ID",
        Field: "proofOfId",
        page: Documents,
      },
      {
        title: "Articles of Association",
        Field: "articlesOfAssociation",
        page: Documents,
      },
      {
        title: "Proof of Registration",
        Field: "proofOfRegistration",
        page: Documents,
      },
    ],
  },
  {
    heading: "Bank Details",
    fields: [
      {
        title: "Bank or Building Society Name",
        Field: "bankName",
        page: BankDetails,
      },
      {
        title: "Account Number",
        Field: "accountNumber",
        page: BankDetails,
      },
      {
        title: "Sort Code",
        Field: "sortCode",
        page: BankDetails,
      },
    ],
  },
]

const getValues = (field, date) => values => {
  const value = values[field]
  switch (true) {
    case date:
      return moment(
        `${value.month} ${value.day} ${value.year}`,
        "MM-DD-YYYY"
      ).format("DD MMMM YYYY")
    case field === "permanentRole":
      return "Permanent role"
    case !value:
      return "N/A"
    case field === "loanAmount":
      return `£${value}`
    case field === "monthlyRepayment":
      return `£${values.loanAmount / values.loanTerms}`
    case field === "nationality":
      return R.pipe(
        R.find(R.propEq("value", value)),
        R.prop("label")
      )(nationalities)
    default:
      return value
  }
}

const SummaryContainer = styled.div`
  border-radius: 6px;
`

const SummarySection = ({ heading, fields, values, setPage }) => {
  return (
    <div className="mb-10">
      <h2 className="uppercase mb-4">{heading}</h2>
      {fields.map(({ field, title, date, page }) => (
        <div key={title} className="flex justify-between mb-3">
          <p className="w-2/5 font-bold">{title}</p>
          <p className="w-2/5">{getValues(field, date)(values)}</p>
          <a
            className="w-1/5 text-right text-teal underline"
            onClick={page ? () => setPage(page) : null}
          >
            {page && "Change"}
          </a>
        </div>
      ))}
    </div>
  )
}

const Divider = styled.div.attrs({
  className: "my-8",
})`
  height: 2px;
  background-color: ${cssTheme("colors.midgray")};
  width: 100%;
  opacity: 0.5;
`

const Summary = ({ values, setPage }) => {
  return (
    <main className="flex justify-center items-start flex-col m-auto font-base">
      <Heading className="mb-2">Thanks {values.firstName}</Heading>
      <Heading className="">
        Please check your answers before we create your loan agreement
      </Heading>
      <SummaryContainer className="border border-midgray p-8 mt-10 w-full">
        {sections.map(section => {
          return (
            <SummarySection
              key={section.heading}
              values={values}
              setPage={setPage}
              {...section}
            ></SummarySection>
          )
        })}
        <Divider />
        <div className="flex">
          <img className="mr-4" src={tealTick} alt="tick" />
          <div>
            <p>
              By submitting you are confirming that, to the best of your
              knowledge, the details you are providing are correct.
            </p>
            <p className="text-teal underline">I've got some questions</p>
          </div>
        </div>
      </SummaryContainer>
    </main>
  )
}

Summary.progressImg = progress4
Summary.componentName = "Summary"

export default Summary
