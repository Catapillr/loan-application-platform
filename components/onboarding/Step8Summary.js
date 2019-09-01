import styled from "styled-components"
import * as moment from "moment"

import { Heading, Copy } from "./styles"

const sections = [
  {
    heading: "Personal Details",
    fields: [
      { title: "First name", field: "firstName" },
      { title: "Last name", field: "lastName" },
      { title: "Date of birth", field: "dob", date: true },
      { title: "Email", field: "email" },
      { title: "Contact number", field: "phoneNumber" },
    ],
  },
  {
    heading: "Employment Details",
    fields: [
      { title: "Start date", field: "employmentStartDate", date: true },
      { title: "Contract type", field: "permanentRole" },
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

const SummarySection = ({ heading, fields, values }) => {
  return (
    <div className="mb-5">
      <h2 className="uppercase mb-4">{heading}</h2>
      {fields.map(({ field, title, date }) => (
        <div key={title} className="flex justify-between mb-3">
          <p className="w-2/6 font-bold">{title}</p>
          <p className="w-2/6">{getValues(field, date)(values)}</p>
          <a className="w-2/6 text-right text-teal underline">Change</a>
        </div>
      ))}
    </div>
  )
}

const Step8 = props => {
  const { values } = props
  console.log(props)
  return (
    <main className="flex justify-center items-start flex-col m-auto font-base">
      <Heading className="mb-2">Thanks {values.firstName}</Heading>
      <Heading className="">
        Please check your answers before we create your loan agreement
      </Heading>
      <SummaryContainer className="border border-midgray p-8 mt-10 w-full">
        {sections.map(section => {
          console.log("section", section)
          return (
            <SummarySection
              key={section.heading}
              {...section}
              values={values}
            ></SummarySection>
          )
        })}
      </SummaryContainer>
    </main>
  )
}

export default Step8
