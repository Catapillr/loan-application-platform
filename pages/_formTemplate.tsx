import * as React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

interface MyFormValues {
  firstName: string
}

export const MultiStepForm: React.SFC<{}> = () => {
  return (
    <main>
      <h1>My Example</h1>
      <Formik
        initialValues={{ firstName: "" }}
        onSubmit={(
          values: MyFormValues,
          actions: FormikActions<MyFormValues>
        ) => {
          console.log({ values, actions })
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }}
        render={(formikBag: FormikProps<MyFormValues>) => (
          <Form>
            <Field
              name="firstName"
              render={({ field, form }: FieldProps<MyFormValues>) => (
                <div>
                  <input type="text" {...field} placeholder="First Name" />
                  {form.touched.firstName &&
                    form.errors.firstName &&
                    form.errors.firstName}
                </div>
              )}
            />
          </Form>
        )}
      />
    </main>
  )
}
