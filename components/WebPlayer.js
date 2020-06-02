import React from 'react'
import styled from 'styled-components'
import ReactNativeWebPlayer from 'react-native-web-player'

import isMobile from '../utils/isMobile'
import { param } from 'change-case'

const playerStyles = {
  tab: {
    backgroundColor: 'rgb(250,250,250)',
  },
  header: {
    backgroundColor: 'rgb(250,250,250)',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 1px',
    zIndex: 9,
  },
  headerText: {
    color: '#AAA',
    fontWeight: 'normal',
  },
  transpilerHeader: {
    backgroundColor: 'rgb(240,240,240)',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 1px',
    zIndex: 9,
  },
  transpilerHeaderText: {
    color: '#888',
    fontWeight: 'normal',
  },
  tabText: {
    color: '#AAA',
  },
  tabTextActive: {
    color: '#000',
  },
  editorPane: {
    backgroundColor: 'teal',
  },
  playerPane: {
    // backgroundColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden',
    // paddingLeft: 10,
    // paddingRight: 10,
    // marginLeft: 0,
    // marginRight: 0,
    background: 'white',
  },
  consolePane: {
    backgroundColor: 'white',
  },
  workspacesPane: {
    width: '25%',
  },
}

playerStyles.playerHeader = playerStyles.header
playerStyles.playerHeaderText = playerStyles.headerText

playerStyles.workspacesHeader = playerStyles.header
playerStyles.workspacesHeaderText = playerStyles.headerText

const Container = styled.div({
  display: 'flex',
  marginBottom: '15px',
  flex: '1',
})

const styles = {
  player: {
    flex: '1',
    minWidth: '0',
    minHeight: '0',
    marginRight: '-10px',
  },
}

export default class WebPlayer extends React.Component {
  static defaultProps = {
    height: 700,
    width: 260,
    scale: 0.75,
    showTranspiler: false,
    showConsole: false,
    fullscreen: true,
    workspaces: [],
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    let {
      showTranspiler,
      showConsole,

      // Passthrough
      code,
      files,
      entry,
      title,
      height,
      flex,
      width,
      scale,
      fullscreen,
      transpilerTitle,
      playerTitle,
      platform,
      vendorComponents,
      workspaces,
      workspacesTitle,
      statusBarHeight,
      playground,
      typescript,
      panes, // Should be used sparingly to override
      sharedEnvironment = true,
      workspaceCSS,
    } = this.props

    code =
      typeof code === 'string' ? code.replace('export {}', '').trim() : code

    const params = {
      code,
      files,
      entry,
      title,
      width,
      scale,
      fullscreen,
      transpilerTitle,
      playerTitle,
      vendorComponents,
      platform,
      workspaces,
      workspacesTitle,
      statusBarHeight,
      styles: playerStyles,
      playground,
      typescript,
      sharedEnvironment,
      workspaceCSS,
    }

    if (isMobile) {
      params.panes = ['editor']
    } else {
      if (showTranspiler) {
        params.panes = ['editor', 'transpiler']
      } else {
        params.panes = ['editor', 'player']
      }

      if (showConsole) {
        params.console = {
          enabled: true,
          visible: true,
          maximized: true,
          collapsible: false,
        }
        params.styles = {
          ...playerStyles,
          playerPane: {
            ...playerStyles.playerPane,
            marginLeft: 0,
            marginRight: 0,
          },
        }
      }
    }

    if (workspaces.length > 0) {
      params.panes = ['workspaces', ...params.panes]
    }

    if (panes) {
      params.panes = panes
    }

    return (
      <Container>
        <ReactNativeWebPlayer
          style={{ ...styles.player, ...(flex ? { flex } : { height }) }}
          {...params}
        />
      </Container>
    )
  }
}
