interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(contactData: ContactMessage): Promise<boolean> {
  try {
    // Use FormSubmit.co - a free form backend service that forwards to email
    const formSubmitResponse = await fetch('https://formsubmit.co/ajax/zaid.ch20@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
        _subject: `IntelliServe CRM - New Contact from ${contactData.name}`,
        _template: 'table',
        _captcha: 'false'
      })
    });

    const result = await formSubmitResponse.json();
    
    if (formSubmitResponse.ok && result.success) {
      console.log('✅ Email sent successfully to zaid.ch20@gmail.com via FormSubmit');
      return true;
    } else {
      console.log('⚠️ FormSubmit response:', result);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}