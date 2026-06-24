import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useQueryMock: vi.fn((options) => options),
  useMutationMock: vi.fn((options) => options),
  patientAPI: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  appointmentAPI: {
    getAll: vi.fn(),
    create: vi.fn()
  }
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQueryMock,
  useMutation: mocks.useMutationMock
}))

vi.mock('../services/api', () => ({
  patientAPI: mocks.patientAPI,
  appointmentAPI: mocks.appointmentAPI
}))

import {
  useAppointments,
  useCreateAppointment,
  useCreatePatient,
  usePatient,
  usePatients,
  useUpdatePatient
} from './useAPI'

describe('useAPI hooks', () => {
  beforeEach(() => {
    mocks.useQueryMock.mockClear()
    mocks.useMutationMock.mockClear()
    Object.values(mocks.patientAPI).forEach((fn) => fn.mockReset())
    Object.values(mocks.appointmentAPI).forEach((fn) => fn.mockReset())
  })

  it('builds patients query and executes expected API function', async () => {
    mocks.patientAPI.getAll.mockResolvedValue([{ id: 'p-1' }])
    const params = { page: 1 }

    const query = usePatients(params)
    const result = await query.queryFn()

    expect(mocks.useQueryMock).toHaveBeenCalledWith({
      queryKey: ['patients', params],
      queryFn: expect.any(Function)
    })
    expect(result).toEqual([{ id: 'p-1' }])
    expect(mocks.patientAPI.getAll).toHaveBeenCalledWith(params)
  })

  it('enables single patient query only when id exists', () => {
    usePatient('p-1')
    usePatient('')

    expect(mocks.useQueryMock).toHaveBeenNthCalledWith(1, {
      queryKey: ['patient', 'p-1'],
      queryFn: expect.any(Function),
      enabled: true
    })
    expect(mocks.useQueryMock).toHaveBeenNthCalledWith(2, {
      queryKey: ['patient', ''],
      queryFn: expect.any(Function),
      enabled: false
    })
  })

  it('builds mutation hooks with expected API methods', async () => {
    mocks.patientAPI.create.mockResolvedValue({ id: 'p-1' })
    mocks.patientAPI.update.mockResolvedValue({ id: 'p-1', name: 'Updated' })
    mocks.appointmentAPI.create.mockResolvedValue({ id: 'a-1' })

    const createPatient = useCreatePatient()
    const updatePatient = useUpdatePatient()
    const createAppointment = useCreateAppointment()

    await createPatient.mutationFn({ name: 'Alice' })
    await updatePatient.mutationFn({ id: 'p-1', data: { name: 'Updated' } })
    await createAppointment.mutationFn({ patientId: 'p-1' })

    expect(mocks.patientAPI.create).toHaveBeenCalledWith({ name: 'Alice' })
    expect(mocks.patientAPI.update).toHaveBeenCalledWith('p-1', { name: 'Updated' })
    expect(mocks.appointmentAPI.create).toHaveBeenCalledWith({ patientId: 'p-1' })
  })

  it('builds appointments query and executes expected API function', async () => {
    mocks.appointmentAPI.getAll.mockResolvedValue([{ id: 'a-1' }])
    const params = { date: '2026-02-11' }

    const query = useAppointments(params)
    const result = await query.queryFn()

    expect(mocks.useQueryMock).toHaveBeenCalledWith({
      queryKey: ['appointments', params],
      queryFn: expect.any(Function)
    })
    expect(result).toEqual([{ id: 'a-1' }])
    expect(mocks.appointmentAPI.getAll).toHaveBeenCalledWith(params)
  })
})
