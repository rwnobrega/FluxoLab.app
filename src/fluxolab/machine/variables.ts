import _ from 'lodash'

import { VarType } from './types'

interface VariableType {
  typeName: string
  stringIsValid: (str: string) => boolean
  stringToValue: (str: string) => VarType
  valueToString: (value: VarType) => string
}

const variableTypes: VariableType[] = [
  {
    typeName: 'num',
    stringIsValid (str: string): boolean {
      const floatRegex = /^-?\d+(?:[.,]\d*?)?$/
      return floatRegex.test(str)
    },
    stringToValue: (str: string): number => {
      return parseFloat(str)
    },
    valueToString: (value: number): string => {
      return value.toPrecision(6).replace(/0+$/, '').replace(/\.$/, '')
    }
  },
  {
    typeName: 'str',
    stringIsValid: (str: string): boolean => {
      return true
    },
    stringToValue: (str: string): string => {
      return str
    },
    valueToString: (value: string): string => {
      return `"${value}"`
    }
  },
  {
    typeName: 'bool',
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
