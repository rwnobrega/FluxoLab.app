import _ from 'lodash'

import { VarType } from './types'

interface VariableType {
  typeName: 'number' | 'string' | 'boolean'
  stringIsValid: (str: string) => boolean
  stringToValue: (str: string) => VarType
  valueToString: (value: VarType) => string
}

export const variableTypes: VariableType[] = [
  {
    typeName: 'number',
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
    typeName: 'string',
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
    typeName: 'boolean',
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
  return _.find(variableTypes, { typeName }) as VariableType
}
