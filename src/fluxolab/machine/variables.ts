import _ from 'lodash'

import { VarType } from './types'

interface VariableType {
  typeName: string
  jsName: string
  stringIsValid: (str: string) => boolean
  stringToValue: (str: string) => VarType
  valueToString: (value: VarType) => string
}

export const variableTypes: VariableType[] = [
  {
    typeName: 'num',
    jsName: 'number',
    stringIsValid (str: string): boolean {
      const floatRegex = /^-?\d+(?:[.]\d*?)?$/
      return floatRegex.test(str)
    },
    stringToValue: (str: string): number => {
      return parseFloat(str)
    },
    valueToString: (value: number): string => {
      const p: string = value.toPrecision(6)
      if (p.includes('e')) {
        const [mantissa, signal, exponent] = p.split(/e([+-])/)
        return mantissa.replace(/0+$/, '').replace(/\.$/, '') + 'e' + signal + exponent.padStart(2, '0')
      }
      if (p.includes('.')) {
        return p.replace(/0+$/, '').replace(/\.$/, '')
      }
      return p
    }
  },
  {
    typeName: 'str',
    jsName: 'string',
    stringIsValid: (str: string): boolean => {
      return true
    },
    stringToValue: (str: string): string => {
      return str
    },
    valueToString: (value: string): string => {
      return value
    }
  },
  {
    typeName: 'bool',
    jsName: 'boolean',
    stringIsValid: (str: string): boolean => {
      return str === 'true' || str === 'false'
    },
    stringToValue: (str: string): boolean => {
      return str === 'true'
    },
    valueToString: (value: boolean): string => {
      return value ? 'true' : 'false'
    }
  }
]

export function getVariableType (typeName: string): VariableType {
  const variableType = _.find(variableTypes, { typeName })
  if (variableType === undefined) {
    throw new Error(`Tipo de variável "${typeName}" não existe.`)
  }
  return variableType
}
