import styled from "styled-components"
import * as moment from "moment"

import { Heading } from "./styles"

const sections = [
  {
    heading: "Personal Details",
    fields: [
      { title: "First name", field: "firstName", page: 6 },
      { title: "Last name", field: "lastName", page: 6 },
      { title: "Date of birth", field: "dob", date: true, page: 6 },
      { title: "Nationality", field: "nationality", page: 7 },
      { title: "Email", field: "email", page: 2 },
      { title: "Contact number", field: "phoneNumber", page: 7 },
    ],
  },
  {
    heading: "Employment Details",
    fields: [
      {
        title: "Start date",
        field: "employmentStartDate",
        date: true,
        page: 2,
      },
      { title: "Contract type", field: "permanentRole", page: 2 },
      { title: "Employee ID", field: "employeeID", page: 7 },
    ],
  },
  // {
  //   heading: "Your loan application details",
  //   fields: {
  //     loanAmount: { title: "Loan amount" },
  //     loanTerms: { title: "Repayment length" },
  //   },
  // },
]

const getValues = (field, date) => values => {
  switch (true) {
    case date:
      return moment(
        `${values[field].month} ${values[field].day} ${values[field].year}`,
        "MM-DD-YYYY"
      ).format("DD MMMM YYYY")
    case field === "permanentRole":
      return "Permanent role"
    default:
      return values[field]
  }
}

const SummaryContainer = styled.div`
  border-radius: 6px;
`

const SummarySection = ({ heading, fields, values, setPage }) => {
  return (
    <div className="mb-5">
      <h2 className="uppercase mb-4">{heading}</h2>
      {fields.map(({ field, title, date, page }) => (
        <div key={title} className="flex justify-between mb-3">
          <p className="w-2/6 font-bold">{title}</p>
          <p className="w-2/6">{getValues(field, date)(values)}</p>
          <a
            className="w-2/6 text-right text-teal underline"
            onClick={() => setPage(page)}
          >
            Change
          </a>
        </div>
      ))}
    </div>
  )
}

const Step8 = props => {
  const { values } = props
  // console.log("props", props)
  return (
    <main className="flex justify-center items-start flex-col m-auto font-base">
      <Heading className="mb-2">Thanks {values.firstName}</Heading>
      <Heading className="">
        Please check your answers before we create your loan agreement
      </Heading>
      <SummaryContainer className="border border-midgray p-8 mt-10 w-full">
        {sections.map(section => {
          // console.log("section", section)
          return (
            <SummarySection
              key={section.heading}
              {...section}
              values={values}
              setPage={props.setPage}
            ></SummarySection>
          )
        })}
      </SummaryContainer>
    </main>
  )
}

export default Step8
