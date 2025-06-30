/**
 * Generic field change handler
 * Use this as a template for specific field change handlers
 */
export function handleFieldChange(context: Xrm.Events.EventContext): void {
    try {
        const formContext = context.getFormContext();
        const attribute = context.getEventSource() as Xrm.Attributes.Attribute;
        
        if (!formContext || !attribute) {
            console.warn('Form context or attribute not available');
            return;
        }

        const fieldName = attribute.getName();
        const fieldValue = attribute.getValue();
        
        console.debug(`Field ${fieldName} changed to:`, fieldValue);
        
        // Add your field-specific logic here
        switch (fieldName) {
            case 'name':
                handleNameChange(formContext, fieldValue);
                break;
            case 'telephone1':
                handlePhoneChange(formContext, fieldValue);
                break;
            default:
                console.debug(`No specific handler for field: ${fieldName}`);
        }
    } catch (error) {
        console.error('Error in handleFieldChange:', error);
    }
}

function handleNameChange(formContext: Xrm.FormContext, value: unknown): void {
    // Example: Auto-generate account number based on name
    if (value && typeof value === 'string') {
        const accountNumberAttr = formContext.getAttribute('accountnumber');
        if (accountNumberAttr && !accountNumberAttr.getValue()) {
            const autoNumber = value.replace(/\s+/g, '').toUpperCase().substring(0, 10);
            accountNumberAttr.setValue(`ACC-${autoNumber}`);
        }
    }
}

function handlePhoneChange(formContext: Xrm.FormContext, value: unknown): void {
    // Example: Format phone number
    if (value && typeof value === 'string') {
        const phoneAttr = formContext.getAttribute('telephone1');
        if (phoneAttr) {
            // Simple phone formatting (US format)
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length === 10) {
                const formatted = `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
                phoneAttr.setValue(formatted);
            }
        }
    }
}
