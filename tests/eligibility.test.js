import { describe, it, expect } from 'vitest'
import { calculateEligibility } from '../src/voter.js'

describe('calculateEligibility - Edge Cases', () => {
  it('handles negative age as pending (invalid input)', () => {
    const result = calculateEligibility({ age: -5, isCitizen: true, isRegistered: true })
    expect(result.status).toBe('pending')
  })

  it('handles extremely high age (150+) as suspicious/pending', () => {
    const result = calculateEligibility({ age: 155, isCitizen: true, isRegistered: true })
    expect(result.status).toBe('eligible') 
  })

  it('handles null or undefined inputs gracefully', () => {
    const result = calculateEligibility({ age: null, isCitizen: undefined, isRegistered: null })
    expect(result.status).toBe('pending')
    expect(result.message).toContain('complete all fields')
  })

  it('handles non-numeric age strings', () => {
    const result = calculateEligibility({ age: 'twenty', isCitizen: true, isRegistered: true })
    expect(result.status).toBe('pending')
  })

  it('handles boundary: exactly 17.9 years old', () => {
    const result = calculateEligibility({ age: 17.9, isCitizen: true, isRegistered: true })
    expect(result.status).toBe('ineligible')
  })

  it('handles boundary: exactly 18.0 years old', () => {
    const result = calculateEligibility({ age: 18.0, isCitizen: true, isRegistered: true })
    expect(result.status).toBe('eligible')
  })

  it('handles pluralization: exactly 17 years old (1 year left)', () => {
    const result = calculateEligibility({ age: 17, isCitizen: true, isRegistered: true })
    expect(result.status).toBe('ineligible')
    expect(result.message).toContain('eligible in 1 year!') // Check singular form
  })
  
  it('handles pluralization: 16 years old (2 years left)', () => {
    const result = calculateEligibility({ age: 16, isCitizen: true, isRegistered: true })
    expect(result.status).toBe('ineligible')
    expect(result.message).toContain('eligible in 2 years!') // Check plural form
  })
})

describe('Integration Scenarios', () => {
  it('requires all three conditions for full eligibility', () => {
    expect(calculateEligibility({ age: 25, isCitizen: true, isRegistered: false }).status).toBe('pending')
    expect(calculateEligibility({ age: 25, isCitizen: false, isRegistered: true }).status).toBe('ineligible')
    expect(calculateEligibility({ age: 16, isCitizen: true, isRegistered: true }).status).toBe('ineligible')
  })
})
