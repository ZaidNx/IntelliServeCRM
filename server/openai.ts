import OpenAI from "openai";
import { getDatabase } from "./db";
import { ObjectId } from "mongodb";
import { Service, User } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY_ENV_VAR ||
    "default_key",
});

interface ChatbotContext {
  userId: string;
  services: Service[];
  workingHours: Record<
    string,
    { enabled: boolean; start: string; end: string }
  >;
  businessName: string;
}

export async function processChatbotMessage(
  message: string,
  context: ChatbotContext,
): Promise<{ response: string; action?: string; actionData?: any }> {
  try {
    const systemPrompt = `You are an AI assistant for ${context.businessName}, a service business. 
    
Available services:
${context.services.map((s) => `- ${s.name}: ${s.durationMinutes} minutes, $${s.price}`).join("\n")}

Working hours:
${Object.entries(context.workingHours)
  .filter(([_, hours]) => hours.enabled)
  .map(([day, hours]) => `${day}: ${hours.start} - ${hours.end}`)
  .join("\n")}

You can help customers with:
1. Information about services and pricing
2. Checking availability
3. Booking appointments (collect name, phone, email, preferred service, date, and time)

When a customer wants to book an appointment, gather all required information and respond with JSON format:
{
  "response": "your response to the customer",
  "action": "book_appointment",
  "actionData": {
    "customerName": "name",
    "customerPhone": "phone", 
    "customerEmail": "email",
    "serviceId": "service_id",
    "date": "YYYY-MM-DD",
    "time": "HH:MM"
  }
}

For other queries, respond normally with helpful information.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      response.choices[0].message.content ||
        '{"response": "I apologize, but I encountered an error processing your request."}',
    );

    return {
      response: result.response,
      action: result.action,
      actionData: result.actionData,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      response:
        "I apologize, but I'm having trouble processing your request right now. Please try again later or contact us directly.",
    };
  }
}

export async function checkAvailability(
  userId: string,
  serviceId: string,
  date: string,
  time: string,
): Promise<{ available: boolean; message: string }> {
  try {
    const db = getDatabase();

    // Validate ObjectId format
    if (!ObjectId.isValid(serviceId)) {
      return { available: false, message: "Invalid service ID" };
    }

    if (!ObjectId.isValid(userId)) {
      return { available: false, message: "Invalid user ID" };
    }

    // Get service details
    const service = await db.collection("services").findOne({
      _id: new ObjectId(serviceId),
      userId: new ObjectId(userId),
    });

    if (!service) {
      return { available: false, message: "Service not found" };
    }

    // Check if time slot is within working hours
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayOfWeek = dayNames[new Date(date).getDay()];
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user?.workingHours?.[dayOfWeek]?.enabled) {
      return { available: false, message: "We're closed on this day" };
    }

    // Check for existing appointments
    const existingAppointment = await db.collection("appointments").findOne({
      userId: new ObjectId(userId),
      date,
      time,
      status: { $in: ["Pending", "Confirmed"] },
    });

    if (existingAppointment) {
      return { available: false, message: "This time slot is already booked" };
    }

    return { available: true, message: "Time slot is available" };
  } catch (error) {
    console.error("Availability check error:", error);
    return { available: false, message: "Error checking availability" };
  }
}
