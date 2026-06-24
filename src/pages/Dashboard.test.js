import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders key dashboard content', () => {
    const queryClient = new QueryClient()
    const html = renderToStaticMarkup(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(Dashboard)
      )
    )

    expect(html).toContain('Hospital Management')
    expect(html).toContain('Total Patients')
    expect(html).toContain('Add New Patient')
  })
})
