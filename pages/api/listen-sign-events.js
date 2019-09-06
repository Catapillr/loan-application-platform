import formidable from "formidable"

export default (req, res) => {
  const form = new formidable.IncomingForm()

  form.parse(req, function(err, fields) {
    if (err) {
      console.log("Listen for sign event error", err) //eslint-disable-line no-console
    }
    const signEvent = JSON.parse(fields.json)
    console.log("fields", JSON.stringify(signEvent, undefined, 2)) //eslint-disable-line no-console

    res.status(200).send("Hello API Event Received")
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
