import * as ohm from 'ohm-js'

export function evalError (message: string): Error {
  return new Error(message)
}

function escape (str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/`/g, '\\`')
}

export function syntaxError (matchResult: ohm.MatchResult, source: string): Error {
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
    const failure = failures[i]
    if (failure.type === 'description') {
      failuresText += (failure.text as string).replace(/end of input/g, 'fim-de-entrada')
    } else {
      failuresText += `\`${failure.text as string}\``
    }
  }
  const charIndex = matchResult.getInterval().endIdx
  return new Error(`Erro de sintaxe em \`${escape(source)}\` na posição ${charIndex}:\nEsperado ${failuresText}.`)
}
