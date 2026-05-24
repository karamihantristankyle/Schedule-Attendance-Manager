import { describe, expect, it } from 'vitest'
import { formatAttendanceRate, getStatusTone } from './attendance'

describe('attendance helpers', () => {
  it('formats rates as percentages', () => {
    expect(formatAttendanceRate(94)).toBe('94%')
  })

  it('maps late status to gold tone', () => {
    expect(getStatusTone('late')).toBe('gold')
  })

  it('maps open status to green tone', () => {
    expect(getStatusTone('open')).toBe('green')
  })
})
