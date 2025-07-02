import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Users Schema
export const userSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  professionId: z.instanceof(ObjectId).optional(),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  workingHours: z.record(z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string()
  })).optional(),
  publicUrlSlug: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const insertUserSchema = userSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;

// Professions Schema
export const professionSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string().min(1, "Profession name is required"),
  icon: z.string().optional(),
  description: z.string().optional()
});

export const insertProfessionSchema = professionSchema.omit({ _id: true });
export type Profession = z.infer<typeof professionSchema>;
export type InsertProfession = z.infer<typeof insertProfessionSchema>;

// Services Schema
export const serviceSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId),
  name: z.string().min(1, "Service name is required"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const insertServiceSchema = serviceSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export type Service = z.infer<typeof serviceSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;

// Customers Schema
export const customerSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email().optional(),
  phone: z.string().min(1, "Phone is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const insertCustomerSchema = customerSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export type Customer = z.infer<typeof customerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// Appointments Schema
export const appointmentSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId),
  customerId: z.instanceof(ObjectId),
  serviceId: z.instanceof(ObjectId),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.enum(['Pending', 'Confirmed', 'Rejected', 'Completed']).default('Pending'),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const insertAppointmentSchema = appointmentSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export type Appointment = z.infer<typeof appointmentSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Booking request schema for public bookings
export const bookingRequestSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(1, "Phone is required"),
  serviceId: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional()
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
