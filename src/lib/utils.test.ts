// Simple test to verify Jest is working
describe('Basic Jest Setup', () => {
  it('should run a basic test', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle string operations', () => {
    expect('hello world').toContain('hello')
  })

  it('should handle arrays', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })
})