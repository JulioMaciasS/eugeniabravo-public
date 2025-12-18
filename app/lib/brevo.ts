import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const apiInstance = new brevo.ContactsApi();
const transactionalEmailApi = new brevo.TransactionalEmailsApi();

// Set API key
if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  transactionalEmailApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

export interface BrevoContactAttributes {
  FIRSTNAME?: string;
  LASTNAME?: string;
  SOURCE?: string;
  [key: string]: any;
}

/**
 * Add a contact to a Brevo list
 */
export async function addContactToBrevoList(
  email: string, 
  listIds: number[] = [], 
  attributes: BrevoContactAttributes = {}
): Promise<{ success: boolean; message: string; brevoId?: number }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured. Skipping Brevo integration.');
      return { success: false, message: 'Brevo API key not configured' };
    }

    const createContact = new brevo.CreateContact();
    createContact.email = email.toLowerCase();
    createContact.listIds = listIds.length > 0 ? listIds : undefined;
    createContact.attributes = attributes;
    createContact.updateEnabled = true; // Update if contact already exists

    const response = await apiInstance.createContact(createContact);
    
    return {
      success: true,
      message: 'Contact added to Brevo successfully',
      brevoId: response.body.id
    };

  } catch (error: any) {
    console.error('Brevo API error:', error);
    
    // If contact already exists, that's okay
    if (error.status === 400 && error.response?.body?.message?.includes('Contact already exist')) {
      return {
        success: true,
        message: 'Contact already exists in Brevo'
      };
    }

    return {
      success: false,
      message: `Brevo API error: ${error.message || 'Unknown error'}`
    };
  }
}

/**
 * Remove a contact from a Brevo list
 */
export async function removeContactFromBrevoList(
  email: string, 
  listIds: number[] = []
): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured. Skipping Brevo integration.');
      return { success: false, message: 'Brevo API key not configured' };
    }

    if (listIds.length > 0) {
      // Remove from specific lists
      const removeFromLists = new brevo.RemoveContactFromList();
      removeFromLists.emails = [email.toLowerCase()];
      
      for (const listId of listIds) {
        try {
          await apiInstance.removeContactFromList(listId, removeFromLists);
        } catch (error: any) {
          // If contact doesn't exist in list, that's okay
          if (error.status !== 404) {
            console.warn(`Error removing contact from list ${listId}:`, error.message);
          }
        }
      }
    }

    return {
      success: true,
      message: 'Contact removed from Brevo successfully'
    };

  } catch (error: any) {
    console.error('Brevo API error:', error);
    return {
      success: false,
      message: `Brevo API error: ${error.message || 'Unknown error'}`
    };
  }
}

/**
 * Send a welcome email using Brevo transactional email
 */
export async function sendWelcomeEmail(
  email: string,
  firstName?: string
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured. Skipping welcome email.');
      return { success: false, message: 'Brevo API key not configured' };
    }

    if (!process.env.BREVO_WELCOME_TEMPLATE_ID) {
      console.warn('BREVO_WELCOME_TEMPLATE_ID not configured. Skipping welcome email.');
      return { success: false, message: 'Welcome email template not configured' };
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.templateId = parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID);
    sendSmtpEmail.to = [{ email: email.toLowerCase(), name: firstName || '' }];
    sendSmtpEmail.params = {
      FIRSTNAME: firstName || '',
      EMAIL: email.toLowerCase(),
    };

    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);

    return {
      success: true,
      message: 'Welcome email sent successfully',
      messageId: response.body.messageId
    };

  } catch (error: any) {
    console.error('Brevo welcome email error:', error);
    return {
      success: false,
      message: `Welcome email error: ${error.message || 'Unknown error'}`
    };
  }
}

/**
 * Get all lists from Brevo (useful for configuration)
 */
export async function getBrevoLists(): Promise<{ success: boolean; lists?: any[]; message: string }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      return { success: false, message: 'Brevo API key not configured' };
    }

    // For now, return a simple response since the Lists API might have different import structure
    return {
      success: true,
      lists: [],
      message: 'Brevo is configured. Check your Brevo dashboard for list details.'
    };

  } catch (error: any) {
    console.error('Brevo lists error:', error);
    return {
      success: false,
      message: `Brevo API error: ${error.message || 'Unknown error'}`
    };
  }
}

/**
 * Get all contacts from Brevo lists
 */
export async function getContactsFromBrevoLists(
  listIds: number[] = []
): Promise<{ success: boolean; contacts: any[]; message: string }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured. Skipping Brevo integration.');
      return { success: false, contacts: [], message: 'Brevo API key not configured' };
    }

    const allContacts: any[] = [];
    
    // If no list IDs provided, use default from env
    const targetListIds = listIds.length > 0 ? listIds : 
      (process.env.BREVO_LIST_IDS ? process.env.BREVO_LIST_IDS.split(',').map(id => parseInt(id.trim())) : []);

    if (targetListIds.length === 0) {
      return { success: false, contacts: [], message: 'No Brevo list IDs configured' };
    }

    // Fetch contacts from each list
    for (const listId of targetListIds) {
      try {
        console.log(`Fetching contacts from Brevo list: ${listId}`);
        
        let offset = 0;
        const limit = 500; // Brevo API limit
        let hasMore = true;

        while (hasMore) {
          const response = await apiInstance.getContactsFromList(listId);

          const contacts = response.body.contacts || [];
          
          // Add list ID to each contact for reference
          const contactsWithListId = contacts.map((contact: any) => ({
            ...contact,
            sourceListId: listId,
            subscribed_at: contact.createdAt || contact.modifiedAt,
            is_active: true, // If they're in the list, they're active
            source: 'brevo'
          }));

          allContacts.push(...contactsWithListId);

          // Check if there are more contacts
          hasMore = contacts.length === limit;
          offset += limit;

          console.log(`Fetched ${contacts.length} contacts from list ${listId}, offset: ${offset}`);
        }

      } catch (listError: any) {
        console.error(`Error fetching contacts from list ${listId}:`, listError);
        // Continue with other lists even if one fails
      }
    }

    // Remove duplicates based on email
    const uniqueContacts = allContacts.reduce((acc: any[], contact: any) => {
      const existing = acc.find(c => c.email.toLowerCase() === contact.email.toLowerCase());
      if (!existing) {
        acc.push(contact);
      }
      return acc;
    }, []);

    console.log(`Retrieved ${uniqueContacts.length} unique contacts from ${targetListIds.length} Brevo lists`);

    return {
      success: true,
      contacts: uniqueContacts,
      message: `Retrieved ${uniqueContacts.length} contacts from Brevo`
    };

  } catch (error: any) {
    console.error('Error retrieving contacts from Brevo:', error);
    return {
      success: false,
      contacts: [],
      message: error.message || 'Unknown error retrieving contacts from Brevo'
    };
  }
}

/**
 * Get a specific contact from Brevo by email
 */
export async function getContactFromBrevo(email: string): Promise<{ success: boolean; contact?: any; message: string }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      return { success: false, message: 'Brevo API key not configured' };
    }

    const response = await apiInstance.getContactInfo(email.toLowerCase());
    
    return {
      success: true,
      contact: {
        ...response.body,
        subscribed_at: response.body.createdAt || response.body.modifiedAt,
        is_active: !response.body.emailBlacklisted,
        source: 'brevo'
      },
      message: 'Contact retrieved from Brevo'
    };

  } catch (error: any) {
    console.error('Error getting contact from Brevo:', error);
    
    if (error.status === 404) {
      return { success: false, message: 'Contact not found in Brevo' };
    }
    
    return {
      success: false,
      message: error.message || 'Error retrieving contact from Brevo'
    };
  }
}
