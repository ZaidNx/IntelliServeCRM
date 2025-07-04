import { ObjectId } from "mongodb";
import { getDatabase } from "./db";
import bcrypt from "bcrypt";
import {
  User,
  InsertUser,
  LoginUser,
  Profession,
  InsertProfession,
  Service,
  InsertService,
  Customer,
  InsertCustomer,
  Appointment,
  InsertAppointment,
  BookingRequest,
} from "@shared/schema";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  authenticateUser(credentials: LoginUser): Promise<User | null>;

  // Professions
  getAllProfessions(): Promise<Profession[]>;
  createProfession(profession: InsertProfession): Promise<Profession>;

  // Services
  getServicesByUserId(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | null>;
  deleteService(id: string): Promise<boolean>;
  getServiceById(id: string): Promise<Service | null>;

  // Customers
  findOrCreateCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomersByUserId(userId: string): Promise<Customer[]>;

  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByUserId(userId: string): Promise<Appointment[]>;
  updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ): Promise<Appointment | null>;
  deleteAppointment(id: string): Promise<boolean>;

  // Public booking
  getUserBySlug(slug: string): Promise<User | null>;
  createPublicBooking(
    slug: string,
    booking: BookingRequest,
  ): Promise<Appointment>;
}

export class MongoStorage implements IStorage {
  // Users
  async createUser(userData: InsertUser): Promise<User> {
    const db = getDatabase();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Generate unique public URL slug
    const baseSlug = userData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    let publicUrlSlug = baseSlug;
    let counter = 1;

    while (await this.getUserBySlug(publicUrlSlug)) {
      publicUrlSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const user = {
      ...userData,
      password: hashedPassword,
      publicUrlSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    return await db.collection("users").findOne({ email });
  }

  async getUserById(id: string): Promise<User | null> {
    const db = getDatabase();
    return await db.collection("users").findOne({ _id: new ObjectId(id) });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const db = getDatabase();
    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" },
      );
    return result;
  }

  async authenticateUser(credentials: LoginUser): Promise<User | null> {
    const user = await this.getUserByEmail(credentials.email);
    if (!user) return null;

    const isValid = await bcrypt.compare(credentials.password, user.password);
    return isValid ? user : null;
  }

  async getUserBySlug(slug: string): Promise<User | null> {
    const db = getDatabase();
    return await db.collection("users").findOne({ publicUrlSlug: slug });
  }

  // Professions
  async getAllProfessions(): Promise<Profession[]> {
    const db = getDatabase();
    return await db.collection("professions").find({}).toArray();
  }

  async createProfession(profession: InsertProfession): Promise<Profession> {
    const db = getDatabase();
    const result = await db.collection("professions").insertOne(profession);
    return { ...profession, _id: result.insertedId };
  }

  // Services
  async getServicesByUserId(userId: string): Promise<Service[]> {
    const db = getDatabase();
    return await db
      .collection("services")
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const db = getDatabase();
    const service = {
      ...serviceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("services").insertOne(service);
    return { ...service, _id: result.insertedId };
  }

  async updateService(
    id: string,
    updates: Partial<Service>,
  ): Promise<Service | null> {
    const db = getDatabase();
    const result = await db
      .collection("services")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" },
      );
    return result;
  }

  async deleteService(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db
      .collection("services")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async getServiceById(id: string): Promise<Service | null> {
    const db = getDatabase();
    return await db.collection("services").findOne({ _id: new ObjectId(id) });
  }

  // Customers
  async findOrCreateCustomer(customerData: InsertCustomer): Promise<Customer> {
    const db = getDatabase();

    // Try to find existing customer by phone and email
    let customer = await db.collection("customers").findOne({
      $or: [
        { phone: customerData.phone },
        ...(customerData.email ? [{ email: customerData.email }] : []),
      ],
    });

    if (!customer) {
      const newCustomer = {
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("customers").insertOne(newCustomer);
      customer = { ...newCustomer, _id: result.insertedId };
    }

    return customer;
  }

  async getCustomersByUserId(userId: string): Promise<Customer[]> {
    const db = getDatabase();
    // Get customers who have appointments with this user
    const appointments = await db
      .collection("appointments")
      .find({ userId: new ObjectId(userId) })
      .toArray();
    const customerIds = [...new Set(appointments.map((a) => a.customerId))];

    if (customerIds.length === 0) return [];

    return await db
      .collection("customers")
      .find({
        _id: { $in: customerIds },
      })
      .toArray();
  }

  // Appointments
  async createAppointment(
    appointmentData: InsertAppointment,
  ): Promise<Appointment> {
    const db = getDatabase();
    const appointment = {
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("appointments").insertOne(appointment);
    return { ...appointment, _id: result.insertedId };
  }

  async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    const db = getDatabase();
    return await db
      .collection("appointments")
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  async updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ): Promise<Appointment | null> {
    const db = getDatabase();
    const result = await db
      .collection("appointments")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" },
      );
    return result;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db
      .collection("appointments")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Public booking
  async createPublicBooking(
    slug: string,
    booking: BookingRequest,
  ): Promise<Appointment> {
    const user = await this.getUserBySlug(slug);
    if (!user) throw new Error("Business not found");

    // Find or create customer
    const customer = await this.findOrCreateCustomer({
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
    });

    // Create appointment
    return await this.createAppointment({
      userId: user._id!,
      customerId: customer._id!,
      serviceId: new ObjectId(booking.serviceId),
      date: booking.date,
      time: booking.time,
      status: "Pending",
      notes: booking.notes,
    });
  }
}

export const storage = new MongoStorage();
