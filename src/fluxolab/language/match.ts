import * as ohm from 'ohm-js'

import grammar from './grammar'
import { syntaxError } from './errors'

export default function (source: string, startRule: string): ohm.MatchResult | Error {
  const matchResult = grammar.match(source, startRule)
  if (matchResult.failed()) {
    return syntaxError(matchResult, source)
  }
  return matchResult
}
