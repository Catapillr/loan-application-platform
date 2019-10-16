import * as Yup from "yup"
import styled from "styled-components"

import { Heading, Copy } from "../styles"
import Questions from "../Questions"
import { FileInput } from "../../Input"

import progress4 from "../../../static/images/progress4.svg"
import checkFileType from "../../../utils/checkFileType"

const validation = Yup.object().shape({
  proofOfId: Yup.mixed()
    .test(
      "Check file exists",
      "You need to upload a Proof of ID for us to be able to continue",
      value => !!value.name
    )
    .test(
      "Check file format is supported",
      "The file format of your Proof of ID is not supported",
      checkFileType(["application/pdf", "image/jpeg", "image/gif", "image/png"])
    )
    .test(
      "Check file format is large enough",
      "Please upload a file larger than 1Kb!",
      value => value.size > 1000
    )
    .test(
      "Check file format isn't too big",
      "That file is too big! Please upload a file smaller than 7Mb!",
      value => value.size < 7000000
    ),
  articlesOfAssociation: Yup.mixed()
    .test(
      "Check file exists",
      "You need to upload your Articles of Association for us to be able to continue",
      value => !!value.name
    )
    .test(
      "Check file format is supported",
      "The file format of your Articles of Association is not supported",
      checkFileType(["application/pdf", "image/jpeg", "image/gif", "image/png"])
    )
    .test(
      "Check file format is large enough",
      "Please upload a file larger than 1Kb!",
      value => value.size > 1000
    )
    .test(
      "Check file format isn't too big",
      "That file is too big! Please upload a file smaller than 7Mb!",
      value => value.size < 7000000
    ),
  proofOfRegistration: Yup.mixed()
    .test(
      "Check file exists",
      "You need to upload a Proof of Registration for us to be able to continue",
      value => !!value.name
    )
    .test(
      "Check file format is supported",
      "The file format of your Proof of Registration is not supported",
      checkFileType(["application/pdf", "image/jpeg", "image/gif", "image/png"])
    )
    .test(
      "Check file format is large enough",
      "Please upload a file larger than 1Kb!",
      value => value.size > 1000
    )
    .test(
      "Check file format isn't too big",
      "That file is too big! Please upload a file smaller than 7Mb!",
      value => value.size < 7000000
    ),
})

const Container = styled.main.attrs({
  className: "flex flex-col",
})`
  width: 65%;
`
const Documents = ({
  setFieldValue,
  values: { proofOfId, articlesOfAssociation, proofOfRegistration },
}) => {
  return (
    <Container>
      <Heading className="mb-5">
        We need a few details from you to verify you as an eligible provider.
      </Heading>
      <Copy className="mb-5">
        In order to procceed with this verification and set you up on our
        system, we need you to upload an number of required documents.
      </Copy>
      <Copy className="mb-5">
        To make this process as easy as possible, where possible, we have pre
        populated some of the fields from Companies House. If these are already
        filled in, please check that they are correct.
      </Copy>
      <Copy className="mb-10">
        Check out the FAQs if you would like to find out more or you are having
        any diffuclties with this section.
      </Copy>
      <Questions
        formWidth="100"
        title="2.1 Your documents"
        questions={[
          {
            text: "Proof of Identity (Passport or Driving license)",
            name: "proofOfId",
            component: FileInput,
            file: proofOfId,
            onChange: e => setFieldValue("proofOfId", e.currentTarget.files[0]),
          },
          {
            text: "Articles of Association",
            name: "articlesOfAssociation",
            component: FileInput,
            file: articlesOfAssociation,
            onChange: e =>
              setFieldValue("articlesOfAssociation", e.currentTarget.files[0]),
          },
          {
            text: "Proof of Registration",
            name: "proofOfRegistration",
            component: FileInput,
            file: proofOfRegistration,
            onChange: e =>
              setFieldValue("proofOfRegistration", e.currentTarget.files[0]),
          },
        ]}
      />
    </Container>
  )
}

Documents.validationSchema = validation
Documents.progressImg = progress4
Documents.componentName = "Documents"

export default Documents
