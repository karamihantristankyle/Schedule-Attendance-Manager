export const getStatusTone = (status: string): 'blue' | 'gold' | 'green' | 'slate' => {
  if (status === 'present' || status === 'open') {
    return 'green'
  }

  if (status === 'late') {
    return 'gold'
  }

  if (status === 'scheduled') {
    return 'blue'
  }

  return 'slate'
}

export const formatAttendanceRate = (rate: number) => `${rate}%`

export const formatTime = (value: string) => {
  const date = new Date(value)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
