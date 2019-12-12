import * as Yup from 'yup'

import Questions from '../Questions'
import { NumberInput } from '../../../components/Input'
import { formatToGBP } from '../../../utils/currencyFormatter'

import progress2 from '../../../static/images/progress2.svg'

const validation = Yup.object().shape({
  annualSalary: Yup.string('Please enter a valid salary').required('Required'),
})

const Salary = ({ setFieldValue }) => (
  <div>
    <Questions
      formWidth="60"
      title="Success! Let's start your loan application process."
      questions={[
        {
          text: 'Please enter your gross annual salary',
          name: 'annualSalary',
          component: NumberInput,
          currency: true,
          placeholder: 'e.g. £20,000',
          onBlur: e => {
            return setFieldValue('annualSalary', formatToGBP(e.target.value))
          },
        },
      ]}
    />
  </div>
)

Salary.validationSchema = validation
Salary.progressImg = progress2
Salary.componentName = 'Salary'

export default Salary
