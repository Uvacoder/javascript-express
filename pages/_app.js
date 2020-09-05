import 'reset-css'
import '../styles/main.css'

import ReactGA from 'react-ga'
import React from 'react'
import Helmet from 'react-helmet'
import { MDXProvider } from '@mdx-js/react'
import { ThemeProvider } from 'styled-components'
import App from 'next/app'
import Router from 'next/router'
import {
  Page,
  PageComponents,
  NotFound,
  findNodeBySlug,
  initializeAnalytics,
  trackPageView,
} from 'react-guidebook'
import theme from '../styles/theme'
import slidesTheme from '../styles/slidesTheme'
import EditorConsole from '../components/EditorConsole'
import logo from '../images/logo.svg'
import guidebook from '../guidebook'
import { searchPages, searchTextMatch } from '../utils/search'

const Components = {
  ...PageComponents,
  Example: EditorConsole,
  Details: ({ children, condition }) => condition !== false && children,
  LanguageName: () => (IS_JAVASCRIPT ? 'JavaScript' : 'TypeScript'),
}

const github = {
  user: 'dabbott',
  repo: 'javascript-express',
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props

    const slug = router.pathname.slice(1)

    if (slug.endsWith('slides')) {
      return (
        <ThemeProvider theme={slidesTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      )
    }

    // if (slug.endsWith('playgrounds')) {
    //   return (
    //     <ThemeProvider theme={theme}>
    //       <Component {...pageProps} />
    //     </ThemeProvider>
    //   )
    // }

    const node = findNodeBySlug(guidebook, slug)

    if (!node) {
      return (
        <ThemeProvider theme={theme}>
          <NotFound />
        </ThemeProvider>
      )
    }

    return (
      <ThemeProvider theme={theme}>
        {/* Fragment needed for React.Children.only */}
        <>
          <Helmet title={guidebook.title}>
            <html lang="en" />
          </Helmet>
          <MDXProvider components={Components}>
            <Page
              rootNode={guidebook}
              logo={logo}
              github={github}
              searchPages={searchPages}
              searchTextMatch={searchTextMatch}
            >
              <Component {...pageProps} />
            </Page>
          </MDXProvider>
        </>
      </ThemeProvider>
    )
  }
}

if (typeof document !== 'undefined') {
  const pageView = () => trackPageView(ReactGA)

  initializeAnalytics(ReactGA, 'UA-77053427-4')
  pageView()
  Router.onRouteChangeComplete = pageView
}
