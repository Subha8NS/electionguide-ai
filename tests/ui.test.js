import { describe, it, expect, beforeEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'

describe('UI Integration Tests', () => {
  let dom
  let document
  let window

  beforeEach(async () => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="eligibility-result"></div><input id="elig-age" value="25"><select id="elig-citizen"><option value="yes" selected>Yes</option></select><select id="elig-registered"><option value="yes" selected>Yes</option></select></body></html>')
    window = dom.window
    document = window.document
    global.document = document
    global.window = window
  })

  it('updates the DOM with eligibility results', async () => {
    const { calculateEligibility } = await import('../src/voter.js')
    const resultEl = document.getElementById('eligibility-result')
    
    const age = parseInt(document.getElementById('elig-age').value, 10)
    const isCitizen = document.getElementById('elig-citizen').value === 'yes'
    const isRegistered = document.getElementById('elig-registered').value === 'yes'

    const result = calculateEligibility({ age, isCitizen, isRegistered })
    
    resultEl.innerHTML = `<div class="result-title">${result.title}</div>`
    
    expect(resultEl.innerHTML).toContain('You\'re Eligible!')
  })

  it('shows error for underage in DOM', async () => {
    const { calculateEligibility } = await import('../src/voter.js')
    const resultEl = document.getElementById('eligibility-result')
    
    const result = calculateEligibility({ age: 16, isCitizen: true, isRegistered: true })
    resultEl.innerHTML = `<div class="result-title">${result.title}</div>`
    
    expect(resultEl.innerHTML).toContain('Not Yet Eligible')
  })
})
