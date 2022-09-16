import _ from 'lodash'

interface VariableType {
  typeName: string
  parse: (value: string) => any
  format: (value: any) => string
}

const variableTypes: VariableType[] = [
  {
    typeName: 'num',
    parse: Number,
    format: (value: any) => {
      if (value === undefined) {
        return '\u00A0'
      }
      return value.toPrecision(6).replace(/0+$/, '').replace(/\.$/, '')
    }
  },
  {
    typeName: 'str',
    parse: String,
    format: (value: any) => {
      if (value === undefined) {
        return '\u00A0'
      }
      return `"${value as string}"`
    }
  },
  {
    typeName: 'bool',
    parse: Boolean,
    format: (value: any) => {
      if (value === undefined) {
        return '\u00A0'
      }
      return value as boolean ? 'true' : 'false'
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
