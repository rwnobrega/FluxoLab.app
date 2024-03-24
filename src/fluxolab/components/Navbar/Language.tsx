import _ from 'lodash'

import React from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import Tooltip from 'components/General/Tooltip'

import useStoreStrings from 'stores/useStoreStrings'

export default function (): JSX.Element {
  const { getString, language: currentLanguage, setLanguage } = useStoreStrings()

  const languages: Record<string, string> = {
    en: 'English',
    'pt-BR': 'Português (BR)'
  }

  return (
    <Dropdown align='end'>
      <Tooltip text={getString('Change language')}>
        <Dropdown.Toggle>
          <i className='bi bi-globe' />
        </Dropdown.Toggle>
      </Tooltip>
      <Dropdown.Menu>
        {_.map(languages, (label, language) => (
          <Dropdown.Item key={language} onClick={() => setLanguage(language)}>
            {language === currentLanguage ? <i className='bi bi-check2' /> : null} {label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
