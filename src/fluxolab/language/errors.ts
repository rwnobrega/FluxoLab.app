import * as ohm from 'ohm-js'

export function evalError (message: string): Error {
  return new Error(message)
}

function escape (str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/`/g, '\\`')
}

export function syntaxError (matchResult: ohm.MatchResult, source: string): Error {
  const charIndex = matchResult.getInterval().endIdx
  // @ts-expect-error  // TODO: Why is this necessary?
  const failures = matchResult.getRightmostFailures()
  let failuresText = ''
  for (let i = 0; i < failures.length; i++) {
    if (i > 0) {
      if (i === failures.length - 1) {
        failuresText += ' ou '
      } else {
        failuresText += ', '
      }
    }
    let failure = failures[i].text as string
    if (failure === 'a digit') {
      failure = 'um dígito'
    } else if (failure === 'a letter') {
      failure = 'uma letra'
    } else if (failure === 'any character') {
      failure = 'qualquer caractere'
    } else if (failure === 'an alpha-numeric character') {
      failure = 'um caractere alfanumérico'
    } else if (failure === 'end of input') {
      failure = 'fim'
    } else if (failure === 'not a keyword') {
      failure = 'uma não-palavra-chave'
    } else {
      failure = `\`${failure}\``
    }
    failuresText += failure
  }
  return new Error(`Erro de sintaxe em \`${escape(source)}\` na posição ${charIndex}:\nEsperado ${failuresText}`)
}
