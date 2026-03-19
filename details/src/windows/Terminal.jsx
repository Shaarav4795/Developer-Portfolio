import { WindowControls } from '#components'
import { socials } from '#constants'
import { PROJECTS } from '#constants/projects'
import WindowWrapper from '#hoc/WindowWrapper'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const createLine = (type, content, href = null) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  type,
  content,
  href,
})

const WELCOME_LINES = [
  createLine('system', 'Portfolio Terminal v2.0'),
  createLine('text', 'Type "help" to list commands.')
]

const parseCommandInput = (value) => {
  const trimmed = value.trim()
  if (!trimmed) return { name: '', args: [], raw: '' }

  const matches = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || []
  const normalized = matches.map((token) => token.replace(/^"|"$/g, ''))
  const [name = '', ...args] = normalized

  return {
    name: name.toLowerCase(),
    args,
    raw: trimmed,
  }
}

const Terminal = ({ onMinimize, onClose }) => {
  const [output, setOutput] = useState(WELCOME_LINES)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [draftInput, setDraftInput] = useState('')
  const outputRef = useRef(null)
  const shouldAutoScrollRef = useRef(true)
  const inputRef = useRef(null)

  const focusInput = useCallback(() => {
    if (!inputRef.current) return
    try {
      inputRef.current.focus({ preventScroll: true })
    } catch {
      inputRef.current.focus()
    }
  }, [])

  const appendLines = useCallback((lines) => {
    setOutput((prev) => [...prev, ...lines])
  }, [])

  const projectLinkByType = useCallback((project, type) => {
    if (!Array.isArray(project?.files)) return null
    if (type === 'repo') return project.files.find((f) => f.type === 'github')?.href || null
    if (type === 'live') {
      return project.files.find((f) => f.type === 'url' || f.name?.toLowerCase().includes('website'))?.href || null
    }
    return null
  }, [])

  const commandRegistry = useMemo(() => ({
    descriptions: {
      help: 'Show available commands',
      about: 'Display developer background',
      projects: 'List projects or show one project',
      contact: 'Display contact methods',
      socials: 'Show social links',
      open: 'Open a social or project link',
      history: 'Show command history',
      date: 'Show local date and time',
      whoami: 'Show terminal user',
      pwd: 'Print current location',
      echo: 'Print text to terminal',
      clear: 'Clear all output',
      shaarav4795: 'Display Shadow logo',
    },
    aliases: {
      ls: 'projects',
      cls: 'clear',
      dir: 'projects',
    },
  }), [])

  const scrollToBottom = useCallback(() => {
    if (!outputRef.current || !shouldAutoScrollRef.current) return
    outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [])

  useEffect(() => {
    requestAnimationFrame(scrollToBottom)
  }, [output, scrollToBottom])

  useEffect(() => {
    const timeout = setTimeout(() => focusInput(), 250)
    return () => clearTimeout(timeout)
  }, [focusInput])

  const handleOutputScroll = useCallback(() => {
    if (!outputRef.current) return
    const node = outputRef.current
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom <= 20
  }, [])

  const renderProjectSummary = useCallback(() => {
    const lines = [createLine('text', `Projects (${PROJECTS.length}):`)]
    PROJECTS.forEach((project, index) => {
      lines.push(createLine('text', `${index + 1}. ${project.name}`))
      if (project.description) lines.push(createLine('muted', `   ${project.description}`))
    })
    lines.push(createLine('muted', 'Tip: run "projects 1" or "projects project-name" for details.'))
    return lines
  }, [])

  const renderProjectDetail = useCallback((query) => {
    if (!query) return renderProjectSummary()

    const number = Number(query)
    const normalizedQuery = query.toLowerCase()

    const matched = Number.isFinite(number) && number > 0
      ? PROJECTS[number - 1]
      : PROJECTS.find((project) => project.name.toLowerCase().includes(normalizedQuery))

    if (!matched) return [createLine('error', `No project found for "${query}".`)]

    const lines = [
      createLine('text', matched.name),
      createLine('muted', matched.description || 'No description available.'),
    ]

    const liveUrl = projectLinkByType(matched, 'live')
    const repoUrl = projectLinkByType(matched, 'repo')

    if (liveUrl) lines.push(createLine('link', `Live: ${liveUrl}`, liveUrl))
    if (repoUrl) lines.push(createLine('link', `Repo: ${repoUrl}`, repoUrl))
    if (!liveUrl && !repoUrl) lines.push(createLine('muted', 'No public links available for this project.'))

    return lines
  }, [projectLinkByType, renderProjectSummary])

  const renderSocials = useCallback(() => {
    const lines = [createLine('text', 'Socials:')]
    socials.forEach((social) => lines.push(createLine('link', `${social.text}: ${social.link}`, social.link)))
    return lines
  }, [])

  const openTarget = useCallback((target) => {
    if (!target) return [createLine('error', 'Usage: open <social | project-name | project-number>')]

    const normalizedTarget = target.toLowerCase()
    const socialMatch = socials.find((social) => social.text.toLowerCase() === normalizedTarget)

    if (socialMatch?.link) {
      window.open(socialMatch.link, '_blank', 'noopener,noreferrer')
      return [createLine('success', `Opened ${socialMatch.text}.`)]
    }

    const projectLines = renderProjectDetail(target)
    const projectLink = projectLines.find((line) => line.href)?.href

    if (projectLink) {
      window.open(projectLink, '_blank', 'noopener,noreferrer')
      return [createLine('success', `Opened project link for ${target}.`)]
    }

    return [createLine('error', `Nothing to open for "${target}".`)]
  }, [renderProjectDetail])

  const executeCommand = useCallback((cmd) => {
    const parsed = parseCommandInput(cmd)
    const resolvedCommand = commandRegistry.aliases[parsed.name] || parsed.name

    if (resolvedCommand === 'clear') {
      setInput('')
      setDraftInput('')
      setOutput([])
      setHistory((prev) => [...prev, cmd])
      setHistoryIndex(-1)
      return
    }

    const response = []

    if (!parsed.name) {
      response.push(createLine('muted', ''))
    } else if (resolvedCommand === 'help') {
      response.push(createLine('text', 'Available commands:'))
      Object.entries(commandRegistry.descriptions).forEach(([name, description]) => {
        response.push(createLine('muted', `  ${name.padEnd(12, ' ')} ${description}`))
      })
      response.push(createLine('muted', 'Aliases: ls, dir, cls'))
    } else if (resolvedCommand === 'about') {
      response.push(createLine('text', "Hi, I'm Shaarav — a developer from Australia."))
      response.push(createLine('text', 'I build practical, high-performance experiences with strong UX.'))
      response.push(createLine('muted', 'Stack: Python, Swift, React, JavaScript, HTML, CSS.'))
    } else if (resolvedCommand === 'projects') {
      response.push(...renderProjectDetail(parsed.args.join(' ').trim()))
    } else if (resolvedCommand === 'contact' || resolvedCommand === 'socials') {
      response.push(...renderSocials())
    } else if (resolvedCommand === 'open') {
      response.push(...openTarget(parsed.args.join(' ').trim()))
    } else if (resolvedCommand === 'history') {
      if (!history.length) {
        response.push(createLine('muted', 'No command history yet.'))
      } else {
        history.forEach((entry, index) => {
          response.push(createLine('muted', `${String(index + 1).padStart(2, '0')}. ${entry}`))
        })
      }
    } else if (resolvedCommand === 'date') {
      response.push(createLine('text', new Date().toLocaleString()))
    } else if (resolvedCommand === 'whoami') {
      response.push(createLine('text', 'shaarav@portfolio'))
    } else if (resolvedCommand === 'pwd') {
      response.push(createLine('text', '~/Portfolio'))
    } else if (resolvedCommand === 'echo') {
      response.push(createLine('text', parsed.args.join(' ')))
    } else if (resolvedCommand === 'shaarav4795') {
      response.push(createLine('text', 'SHADOW LOGO'))
      response.push(createLine('ascii', ' ███████╗██╗  ██╗ █████╗  █████╗ ██████╗  █████╗ ██╗   ██╗██╗  ██╗███████╗ █████╗ ███████╗'))
      response.push(createLine('ascii', ' ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║   ██║██║  ██║╚════██║██╔══██╗██╔════╝'))
      response.push(createLine('ascii', ' ███████╗███████║███████║███████║██████╔╝███████║██║   ██║███████║   ██╔╝ ╚██████║███████╗'))
      response.push(createLine('ascii', ' ╚════██║██╔══██║██╔══██║██╔══██║██╔══██╗██╔══██║╚██╗ ██╔╝╚════██║  ██╔╝   ╚═══██║╚════██║'))
      response.push(createLine('ascii', ' ███████║██║  ██║██║  ██║██║  ██║██║  ██║██║  ██║ ╚████╔╝      ██║  ██║    █████╔╝███████║'))
      response.push(createLine('ascii', ' ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝       ╚═╝  ╚═╝    ╚════╝ ╚══════╝'))
    } else {
      response.push(createLine('error', `Command not found: ${parsed.raw}`))
      response.push(createLine('muted', 'Run "help" to list supported commands.'))
    }

    appendLines([createLine('command', `$ ${cmd}`), ...response, createLine('muted', '')])
    setInput('')
    setDraftInput('')
    setHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)
    requestAnimationFrame(() => focusInput())
  }, [appendLines, commandRegistry, focusInput, history, openTarget, renderProjectDetail, renderSocials])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      if (historyIndex === -1) setDraftInput(input)

      const newIndex = Math.min(historyIndex + 1, history.length - 1)
      if (newIndex !== historyIndex) {
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput(draftInput)
      }
      return
    }

    if (e.key.toLowerCase() === 'l' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOutput([])
    }
  }

  const handleShellClick = () => {
    focusInput()
  }

  return (
    <>
      <div id='window-header' className='window-drag-handle'>
        <div>
          <WindowControls target='terminal' onMinimize={onMinimize} onClose={onClose} />
        </div>
        <h2>Terminal</h2>
        <p className='terminal-header-note'>zsh • portfolio</p>
      </div>

      <div className='terminal-container' onClick={handleShellClick}>
        <div className='terminal-meta'>
          <span>Use ↑/↓ for history</span>
        </div>

        <div className='terminal-output' ref={outputRef} onScroll={handleOutputScroll}>
          {output.map((line) => (
            <div key={line.id} className={`terminal-line terminal-${line.type}`}>
              {line.href ? (
                <a
                  href={line.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='terminal-link'
                  onClick={(e) => e.stopPropagation()}
                >
                  {line.content}
                </a>
              ) : line.content}
            </div>
          ))}
        </div>

        <div className='terminal-input-area'>
          <span className='terminal-prompt'>$ </span>
          <input
            ref={inputRef}
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className='terminal-input'
            spellCheck={false}
          />
        </div>
      </div>
    </>
  )
}

const TerminalWindow = WindowWrapper(Terminal, 'terminal')

export default TerminalWindow