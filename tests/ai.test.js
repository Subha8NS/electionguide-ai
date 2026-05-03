import { describe, it, expect } from 'vitest'
import { getDemoResponse, formatMarkdown } from '../src/ai.js'

describe('getDemoResponse', () => {
  it('returns registration info for voter registration query', async () => {
    const response = await getDemoResponse('How do I register to vote?')
    expect(response).toContain('National Voters')
  })

  it('returns EVM info for EVM-related query', async () => {
    const response = await getDemoResponse('What is an EVM and how does it work?')
    expect(response).toContain('Electronic Voting Machine')
  })

  it('returns NOTA info for NOTA query', async () => {
    const response = await getDemoResponse('Tell me about NOTA and when to use it')
    expect(response).toContain('None of the Above')
  })

  it('returns default response for unrelated query', async () => {
    const response = await getDemoResponse('what is the weather today?')
    expect(response).toContain('world\'s largest democracy')
  })

  it('returns types of elections for elections query', async () => {
    const response = await getDemoResponse('What types of elections happen in India?')
    expect(response).toContain('Lok Sabha')
  })
})

describe('formatMarkdown', () => {
  it('formats bold text correctly', () => {
    const input = 'This is **bold** text'
    expect(formatMarkdown(input)).toBe('This is <strong>bold</strong> text')
  })

  it('formats italic text correctly', () => {
    const input = 'This is *italic* text'
    expect(formatMarkdown(input)).toBe('This is <em>italic</em> text')
  })

  it('formats inline code correctly', () => {
    const input = 'Use `console.log` here'
    expect(formatMarkdown(input)).toBe('Use <code>console.log</code> here')
  })

  it('formats unordered lists correctly', () => {
    const input = '- Item 1\n- Item 2'
    const output = formatMarkdown(input)
    expect(output).toContain('<ul>')
    expect(output).toContain('<li>Item 1</li>')
    expect(output).toContain('<li>Item 2</li>')
  })

  it('formats line breaks correctly', () => {
    const input = 'Line 1\nLine 2'
    expect(formatMarkdown(input)).toBe('Line 1<br>Line 2')
  })

  it('formats double line breaks as paragraph breaks', () => {
    const input = 'Para 1\n\nPara 2'
    expect(formatMarkdown(input)).toBe('Para 1<br><br>Para 2')
  })
})
