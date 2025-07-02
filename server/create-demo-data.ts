import { connectToDatabase } from './db';
import { storage } from './storage';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export async function createComprehensiveDemoData() {
  try {
    await connectToDatabase();
    console.log('🚀 Creating comprehensive demo account with realistic business data...');

    // Check if demo user already exists
    const existingUser = await storage.getUserByEmail('demo@luxebeauty.com');
    if (existingUser) {
      console.log('✅ Demo account already exists');
      return existingUser;
    }

    // Create demo user - Modern Beauty Salon Owner
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await storage.createUser({
      name: 'Sarah Johnson',
      email: 'demo@luxebeauty.com',
      password: hashedPassword,
      businessName: 'Luxe Beauty Studio',
      phone: '+1 (555) 123-4567',
      location: '123 Madison Avenue, New York, NY 10016',
      publicUrlSlug: 'luxe-beauty-studio',
      workingHours: {
        monday: { enabled: true, start: '09:00', end: '19:00' },
        tuesday: { enabled: true, start: '09:00', end: '19:00' },
        wednesday: { enabled: true, start: '09:00', end: '19:00' },
        thursday: { enabled: true, start: '09:00', end: '20:00' },
        friday: { enabled: true, start: '09:00', end: '20:00' },
        saturday: { enabled: true, start: '08:00', end: '18:00' },
        sunday: { enabled: true, start: '10:00', end: '16:00' }
      }
    });

    console.log('✅ Demo user created:', demoUser.name);

    // Create comprehensive service offerings
    const services = [
      {
        name: 'Signature Facial Treatment',
        durationMinutes: 90,
        price: 150,
        description: 'Deep cleansing facial with customized treatment for your skin type',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Classic Manicure & Pedicure',
        durationMinutes: 60,
        price: 85,
        description: 'Complete nail care with shape, cuticle care, and polish',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Gel Manicure',
        durationMinutes: 45,
        price: 65,
        description: 'Long-lasting gel polish manicure',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Hair Cut & Style',
        durationMinutes: 60,
        price: 120,
        description: 'Professional haircut with wash and styling',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Hair Color & Highlights',
        durationMinutes: 180,
        price: 250,
        description: 'Full color service with professional consultation',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Eyebrow Shaping & Tinting',
        durationMinutes: 30,
        price: 45,
        description: 'Professional eyebrow shaping and tinting service',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Relaxing Swedish Massage',
        durationMinutes: 60,
        price: 135,
        description: 'Full body relaxation massage with essential oils',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Bridal Makeup Package',
        durationMinutes: 120,
        price: 300,
        description: 'Complete bridal makeup with trial session',
        userId: new ObjectId(demoUser._id!.toString())
      }
    ];

    const createdServices = [];
    for (const service of services) {
      const createdService = await storage.createService(service);
      createdServices.push(createdService);
      console.log(`✅ Created service: ${service.name}`);
    }

    // Create diverse customer base
    const customers = [
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 234-5678',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Jessica Chen',
        email: 'j.chen@email.com',
        phone: '+1 (555) 345-6789',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Amanda Williams',
        email: 'amanda.w@email.com',
        phone: '+1 (555) 456-7890',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Rachel Thompson',
        email: 'rachel.thompson@email.com',
        phone: '+1 (555) 567-8901',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Lisa Park',
        email: 'lisa.park@email.com',
        phone: '+1 (555) 678-9012',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 (555) 789-0123',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Ashley Davis',
        email: 'ashley.davis@email.com',
        phone: '+1 (555) 890-1234',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Nicole Brown',
        email: 'nicole.brown@email.com',
        phone: '+1 (555) 901-2345',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Stephanie Miller',
        email: 'stephanie.miller@email.com',
        phone: '+1 (555) 012-3456',
        userId: new ObjectId(demoUser._id!.toString())
      },
      {
        name: 'Michelle Johnson',
        email: 'michelle.johnson@email.com',
        phone: '+1 (555) 123-4567',
        userId: new ObjectId(demoUser._id!.toString())
      }
    ];

    const createdCustomers = [];
    for (const customer of customers) {
      const createdCustomer = await storage.findOrCreateCustomer(customer);
      createdCustomers.push(createdCustomer);
      console.log(`✅ Created customer: ${customer.name}`);
    }

    // Create realistic appointment history for the past 30 days and upcoming appointments
    const appointments = [];
    const today = new Date();
    const statuses = ['Completed', 'Confirmed', 'Pending', 'Completed', 'Completed'];
    
    // Past appointments (last 30 days)
    for (let i = 30; i >= 1; i--) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() - i);
      
      // Skip Sundays for some variety (simulating business hours)
      if (appointmentDate.getDay() === 0 && Math.random() > 0.3) continue;
      
      // Create 2-4 appointments per day
      const dailyAppointments = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < dailyAppointments; j++) {
        const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const service = createdServices[Math.floor(Math.random() * createdServices.length)];
        
        // Generate realistic appointment times
        const hours = Math.floor(Math.random() * 9) + 9; // 9 AM to 6 PM
        const minutes = Math.random() > 0.5 ? '00' : '30';
        const time = `${hours.toString().padStart(2, '0')}:${minutes}`;
        
        const appointment = {
          date: appointmentDate.toISOString().split('T')[0],
          time: time,
          status: i <= 2 ? 'Completed' : statuses[Math.floor(Math.random() * statuses.length)],
          notes: [
            'Regular customer - prefers relaxing environment',
            'First time client - explained all procedures',
            'Birthday appointment - added special touches',
            'Loyal customer since 2022',
            'Referred by Jessica Chen',
            'Preparing for special event next week'
          ][Math.floor(Math.random() * 6)],
          customerId: new ObjectId(customer._id!.toString()),
          serviceId: new ObjectId(service._id!.toString()),
          userId: new ObjectId(demoUser._id!.toString())
        };
        
        appointments.push(appointment);
      }
    }
    
    // Future appointments (next 14 days)
    for (let i = 1; i <= 14; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + i);
      
      // Create 1-3 future appointments per day
      const dailyAppointments = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < dailyAppointments; j++) {
        const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const service = createdServices[Math.floor(Math.random() * createdServices.length)];
        
        const hours = Math.floor(Math.random() * 9) + 9;
        const minutes = Math.random() > 0.5 ? '00' : '30';
        const time = `${hours.toString().padStart(2, '0')}:${minutes}`;
        
        const appointment = {
          date: appointmentDate.toISOString().split('T')[0],
          time: time,
          status: i <= 3 ? 'Confirmed' : 'Pending',
          notes: [
            'Regular monthly appointment',
            'Special occasion - wedding guest',
            'Follow-up appointment',
            'New client consultation',
            'Seasonal treatment package'
          ][Math.floor(Math.random() * 5)],
          customerId: new ObjectId(customer._id!.toString()),
          serviceId: new ObjectId(service._id!.toString()),
          userId: new ObjectId(demoUser._id!.toString())
        };
        
        appointments.push(appointment);
      }
    }

    // Create all appointments
    for (const appointment of appointments) {
      try {
        await storage.createAppointment(appointment);
      } catch (error) {
        console.log(`⚠️ Skipped duplicate appointment for ${appointment.date} ${appointment.time}`);
      }
    }

    console.log(`✅ Created ${appointments.length} appointments`);
    console.log('🎉 Demo account setup complete!');
    console.log('📧 Login with: demo@luxebeauty.com');
    console.log('🔑 Password: demo123');
    console.log('🏪 Business: Luxe Beauty Studio');
    console.log('📊 Dashboard will show rich analytics and appointment data');

    return demoUser;

  } catch (error) {
    console.error('❌ Error creating demo data:', error);
    throw error;
  }
}

// Run this function to create demo data
createComprehensiveDemoData().catch(console.error);