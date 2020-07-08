const decoratorValidator = (fn, schema, argsType) => {
  return async function (event) {

    const data = JSON.parse(event[argsType])

    // abortEarly = mostrar todos os erros de uma vez
    const { error, value } = await schema.validate(
      data,
      { abortEarly: true }
    );

    if (error) {
      return {
        statusCode: 422, // unprocessable entity
        body: error.message
      }
    }

    // isso altera a instancia de arguments
    event[argsType] = value

    return fn.apply(this, arguments)
  }
}

module.exports = decoratorValidator;
