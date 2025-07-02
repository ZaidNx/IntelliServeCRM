import { connectToDatabase } from './db';
import { storage } from './storage';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export async function createDemoAccount() {
  try {
    await connectToDatabase();
    
    // Check if demo account already exists
    const existingUser = await storage.getUserByEmail('demo@dentist.com');
    if (existingUser) {
      console.log('Demo account already exists');
      return existingUser;
    }

    // Create demo dentist user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await storage.createUser({
      name: 'Dr. Adeel Aslam',
      email: 'demo@dentist.com',
      password: hashedPassword,
      businessName: 'Adeel Dental Care',
      phone: '+92 300 1234567',
      location: 'F-8 Markaz, Islamabad, Pakistan',
      publicUrlSlug: 'adeel-dentist',
      workingHours: {
        monday: { enabled: true, start: '09:00', end: '17:00' },
        tuesday: { enabled: true, start: '09:00', end: '17:00' },
        wednesday: { enabled: true, start: '09:00', end: '17:00' },
        thursday: { enabled: true, start: '09:00', end: '17:00' },
        friday: { enabled: true, start: '09:00', end: '17:00' },
        saturday: { enabled: true, start: '10:00', end: '14:00' },
        sunday: { enabled: false, start: '', end: '' }
      }
    });

    console.log('Demo dentist account created:', demoUser._id);

    // Create demo services
    const services = [
      {
        name: 'Dental Cleaning',
        durationMinutes: 60,
        price: 150,
        description: 'Professional teeth cleaning and polishing',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Dental Filling',
        durationMinutes: 45,
        price: 200,
        description: 'Tooth cavity filling with composite material',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Root Canal Treatment',
        durationMinutes: 90,
        price: 800,
        description: 'Complete root canal therapy',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Teeth Whitening',
        durationMinutes: 60,
        price: 300,
        description: 'Professional teeth whitening treatment',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Dental Consultation',
        durationMinutes: 30,
        price: 100,
        description: 'Initial dental examination and consultation',
        userId: demoUser._id!.toString()
      }
    ];

    for (const service of services) {
      await storage.createService(service);
    }

    console.log('Demo services created');

    // Create demo customers
    const customers = [
      {
        name: 'Ahmed Khan',
        phone: '+92 300 1111111',
        email: 'ahmed.khan@email.com',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Fatima Shah',
        phone: '+92 300 2222222',
        email: 'fatima.shah@email.com',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Ali Hassan',
        phone: '+92 300 3333333',
        email: 'ali.hassan@email.com',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Sarah Ahmed',
        phone: '+92 300 4444444',
        email: 'sarah.ahmed@email.com',
        userId: demoUser._id!.toString()
      },
      {
        name: 'Omar Malik',
        phone: '+92 300 5555555',
        email: 'omar.malik@email.com',
        userId: demoUser._id!.toString()
      }
    ];

    const createdCustomers = [];
    for (const customer of customers) {
      const createdCustomer = await storage.findOrCreateCustomer(customer);
      createdCustomers.push(createdCustomer);
    }

    console.log('Demo customers created');

    // Create demo appointments (mix of completed, confirmed, and pending)
    const demoServices = await storage.getServicesByUserId(demoUser._id!.toString());
    const appointmentData = [
      // Past completed appointments
      {
        date: '2024-12-15',
        time: '10:00',
        status: 'Completed' as const,
        notes: 'Regular cleaning completed successfully',
        customerId: createdCustomers[0]._id,
        serviceId: demoServices[0]._id,
        userId: demoUser._id!.toString()
      },
      {
        date: '2024-12-18',
        time: '14:30',
        status: 'Completed' as const,
        notes: 'Filling completed on upper molar',
        customerId: createdCustomers[1]._id,
        serviceId: demoServices[1]._id,
        userId: demoUser._id!.toString()
      },
      {
        date: '2024-12-20',
        time: '09:00',
        status: 'Completed' as const,
        notes: 'Root canal treatment session 1 completed',
        customerId: createdCustomers[2]._id,
        serviceId: demoServices[2]._id,
        userId: demoUser._id!.toString()
      },
      // Today's appointments
      {
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        status: 'Confirmed' as const,
        notes: 'Regular consultation and checkup',
        customerId: createdCustomers[3]._id,
        serviceId: demoServices[4]._id,
        userId: demoUser._id!.toString()
      },
      {
        date: new Date().toISOString().split('T')[0],
        time: '15:00',
        status: 'Confirmed' as const,
        notes: 'Teeth whitening session',
        customerId: createdCustomers[4]._id,
        serviceId: demoServices[3]._id,
        userId: demoUser._id!.toString()
      },
      // Future appointments
      {
        date: '2025-01-02',
        time: '11:00',
        status: 'Pending' as const,
        notes: 'Follow-up appointment for root canal',
        customerId: createdCustomers[2]._id,
        serviceId: demoServices[2]._id,
        userId: demoUser._id!.toString()
      },
      {
        date: '2025-01-05',
        time: '16:00',
        status: 'Confirmed' as const,
        notes: 'New patient consultation',
        customerId: createdCustomers[0]._id,
        serviceId: demoServices[4]._id,
        userId: demoUser._id!.toString()
      }
    ];

    for (const appointment of appointmentData) {
      await storage.createAppointment(appointment);
    }

    console.log('Demo appointments created');
    console.log('Demo account setup complete!');
    console.log('Login with: demo@dentist.com / demo123');
    console.log('Public booking page: /book/adeel-dentist');

    return demoUser;
  } catch (error) {
    console.error('Error creating demo account:', error);
    throw error;
  }
}

// Manual demo account creation endpoint instead of auto-creation
// Auto-create demo account on server start (development only)
// Commented out to prevent conflicts - can be run manually via API endpoint