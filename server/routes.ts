import type { Express } from "express";
import { createServer, type Server } from "http";
import { ObjectId } from "mongodb";
import { connectToDatabase, getDatabase } from "./db";
import { storage } from "./storage";
import { processChatbotMessage, checkAvailability } from "./openai";
import {
  insertUserSchema,
  loginSchema,
  insertServiceSchema,
  insertAppointmentSchema,
  bookingRequestSchema,
} from "@shared/schema";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

// Middleware to verify JWT token
const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database connection
  await connectToDatabase();

  // Initialize default professions if they don't exist
  const professions = await storage.getAllProfessions();
  if (professions.length === 0) {
    await storage.createProfession({
      name: "Barber",
      icon: "fas fa-cut",
      description: "Hair cutting & styling",
    });
    await storage.createProfession({
      name: "Dentist",
      icon: "fas fa-tooth",
      description: "Dental care & treatment",
    });
    await storage.createProfession({
      name: "Beautician",
      icon: "fas fa-spa",
      description: "Beauty & wellness",
    });
    await storage.createProfession({
      name: "Mechanic",
      icon: "fas fa-wrench",
      description: "Auto repair services",
    });
  }

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.authenticateUser(credentials);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUserById(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User routes
  app.put(
    "/api/users/profile",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const updates = req.body;
        const user = await storage.updateUser(req.userId!, updates);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  // Profession routes
  app.get("/api/professions", async (req, res) => {
    try {
      const professions = await storage.getAllProfessions();
      res.json(professions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Service routes
  app.get("/api/services", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const services = await storage.getServicesByUserId(req.userId!);
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post(
    "/api/services",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const serviceData = insertServiceSchema.parse({
          ...req.body,
          userId: new ObjectId(req.userId!),
        });

        const service = await storage.createService(serviceData);
        res.status(201).json(service);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  app.put(
    "/api/services/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const service = await storage.updateService(req.params.id, req.body);
        if (!service) {
          return res.status(404).json({ message: "Service not found" });
        }
        res.json(service);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  app.delete(
    "/api/services/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const deleted = await storage.deleteService(req.params.id);
        if (!deleted) {
          return res.status(404).json({ message: "Service not found" });
        }
        res.status(204).send();
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  // Customer routes
  app.get(
    "/api/customers",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const customers = await storage.getCustomersByUserId(req.userId!);
        res.json(customers);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
  );

  // Appointment routes
  app.get(
    "/api/appointments",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const appointments = await storage.getAppointmentsByUserId(req.userId!);
        res.json(appointments);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
  );

  app.post(
    "/api/appointments",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const appointmentData = insertAppointmentSchema.parse({
          ...req.body,
          userId: new ObjectId(req.userId!),
        });

        const appointment = await storage.createAppointment(appointmentData);
        res.status(201).json(appointment);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  app.put(
    "/api/appointments/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const appointment = await storage.updateAppointment(
          req.params.id,
          req.body,
        );
        if (!appointment) {
          return res.status(404).json({ message: "Appointment not found" });
        }
        res.json(appointment);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  app.delete(
    "/api/appointments/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const deleted = await storage.deleteAppointment(req.params.id);
        if (!deleted) {
          return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(204).send();
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
  );

  // Public booking routes
  app.get("/api/public/:slug", async (req, res) => {
    try {
      const user = await storage.getUserBySlug(req.params.slug);
      if (!user) {
        return res.status(404).json({ message: "Business not found" });
      }

      const services = await storage.getServicesByUserId(user._id!.toString());

      const { password, ...publicUser } = user;
      res.json({
        business: publicUser,
        services,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/public/:slug/book", async (req, res) => {
    try {
      const bookingData = bookingRequestSchema.parse(req.body);

      // Check availability
      const user = await storage.getUserBySlug(req.params.slug);
      if (!user) {
        return res.status(404).json({ message: "Business not found" });
      }

      const availability = await checkAvailability(
        user._id!.toString(),
        bookingData.serviceId,
        bookingData.date,
        bookingData.time,
      );

      if (!availability.available) {
        return res.status(400).json({ message: availability.message });
      }

      const appointment = await storage.createPublicBooking(
        req.params.slug,
        bookingData,
      );
      res.status(201).json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get available time slots for a service and date
  app.get("/api/public/:slug/available-slots", async (req, res) => {
    try {
      const { serviceId, date } = req.query;

      if (!serviceId || !date) {
        return res
          .status(400)
          .json({ message: "Service ID and date are required" });
      }

      const user = await storage.getUserBySlug(req.params.slug);
      if (!user) {
        return res.status(404).json({ message: "Business not found" });
      }

      const service = await storage.getServiceById(serviceId as string);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      // Generate all possible slots
      const allSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let min = 0; min < 60; min += 30) {
          const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
          allSlots.push(time);
        }
      }

      // Filter based on working hours (simplified - you can enhance this)
      const availableSlots = allSlots.filter((slot) => {
        // Basic filtering - can be enhanced with actual working hours logic
        const hour = parseInt(slot.split(":")[0]);
        return hour >= 9 && hour < 17; // Business hours 9 AM to 5 PM
      });

      res.json(availableSlots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chatbot routes
  app.post("/api/chatbot/:slug", async (req, res) => {
    try {
      const { message } = req.body;
      const user = await storage.getUserBySlug(req.params.slug);

      if (!user) {
        return res.status(404).json({ message: "Business not found" });
      }

      const services = await storage.getServicesByUserId(user._id!.toString());

      const context = {
        userId: user._id!.toString(),
        services,
        workingHours: user.workingHours || {},
        businessName: user.businessName || user.name,
      };

      const response = await processChatbotMessage(message, context);

      // If the action is to book an appointment, try to create it
      if (response.action === "book_appointment" && response.actionData) {
        try {
          const availability = await checkAvailability(
            context.userId,
            response.actionData.serviceId,
            response.actionData.date,
            response.actionData.time,
          );

          if (availability.available) {
            const appointment = await storage.createPublicBooking(
              req.params.slug,
              response.actionData,
            );
            response.response += ` Your appointment has been booked successfully! Appointment ID: ${appointment._id}`;
          } else {
            response.response += ` However, ${availability.message}. Please choose a different time.`;
          }
        } catch (bookingError) {
          response.response +=
            " However, there was an error processing your booking. Please try again.";
        }
      }

      res.json({ message: response.response });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      console.log(
        `Contact form submission from ${name} (${email}): ${message}`,
      );

      // Save to database for tracking
      const db = getDatabase();
      await db.collection("contact_messages").insertOne({
        name,
        email,
        message,
        timestamp: new Date(),
        destination: "zaid.ch20@gmail.com",
      });

      // Send email notification
      const { sendContactEmail } = await import("./emailService");
      const emailSent = await sendContactEmail({ name, email, message });

      if (emailSent) {
        res.json({
          message:
            "Message sent successfully! You will receive a copy in your email.",
        });
      } else {
        res.json({
          message:
            "Message received successfully. Email notification failed but your message is saved.",
        });
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Failed to process contact form" });
    }
  });

  // Dashboard statistics
  app.get(
    "/api/dashboard/stats",
    authenticateToken,
    async (req: AuthRequest, res) => {
      try {
        const appointments = await storage.getAppointmentsByUserId(req.userId!);
        const customers = await storage.getCustomersByUserId(req.userId!);
        const services = await storage.getServicesByUserId(req.userId!);

        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = appointments.filter((a) => a.date === today);

        const thisMonth = new Date();
        const startOfMonth = new Date(
          thisMonth.getFullYear(),
          thisMonth.getMonth(),
          1,
        )
          .toISOString()
          .split("T")[0];
        const newCustomers = customers.filter(
          (c) =>
            c.createdAt &&
            c.createdAt.toISOString().split("T")[0] >= startOfMonth,
        );

        const completedAppointments = appointments.filter(
          (a) => a.status === "Completed",
        );
        const revenue = completedAppointments.reduce((sum, appointment) => {
          const service = services.find(
            (s) => s._id?.toString() === appointment.serviceId.toString(),
          );
          return sum + (service ? service.price : 0);
        }, 0);

        res.json({
          totalAppointments: appointments.length,
          todayAppointments: todayAppointments.length,
          newCustomers: newCustomers.length,
          revenue,
          todaySchedule: todayAppointments,
        });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
  );

  const httpServer = createServer(app);
  return httpServer;
}
