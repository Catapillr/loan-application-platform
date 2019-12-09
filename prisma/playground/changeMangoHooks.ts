import mango from '../../lib/mango'

const run = (): any => {
  mango.Hooks.getAll()
    .then(hooks =>
      hooks.map(hook =>
        mango.Hooks.update({
          ...hook,
          Url: 'https://69373a40.eu.ngrok.io/api/listen-mango',
          //@ts-ignore
          Status: 'ENABLED',
        }),
      ),
    )
    .then(hookPromises => Promise.all(hookPromises))
    .then(
      // eslint-disable-next-line
      console.log,
    )
}

run()
