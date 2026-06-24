import { useQuery, useMutation } from '@tanstack/react-query'
import { patientAPI, appointmentAPI } from '../services/api'

export const usePatients = (params) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientAPI.getAll(params)
  })
}

export const usePatient = (id) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientAPI.getById(id),
    enabled: !!id
  })
}

export const useCreatePatient = () => {
  return useMutation({
    mutationFn: (data) => patientAPI.create(data)
  })
}

export const useUpdatePatient = () => {
  return useMutation({
    mutationFn: ({ id, data }) => patientAPI.update(id, data)
  })
}

export const useAppointments = (params) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentAPI.getAll(params)
  })
}

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: (data) => appointmentAPI.create(data)
  })
}
