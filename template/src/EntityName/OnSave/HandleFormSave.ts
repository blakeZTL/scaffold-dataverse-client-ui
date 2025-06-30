/**
 * Form save handler
 * This handler runs before the form is saved to the server
 */
export function handleFormSave(context: Xrm.Events.SaveEventContext): void {
    try {
        const formContext = context.getFormContext();
        
        if (!formContext) {
            console.warn('Form context not available');
            return;
        }

        // Perform validation before save
        const isValid = validateForm(formContext);
        
        if (!isValid) {
            // Prevent save if validation fails
            context.getEventArgs().preventDefault();
            return;
        }

        // Perform any pre-save operations
        performPreSaveOperations(formContext);
        
        console.debug('Form save validation completed successfully');
    } catch (error) {
        console.error('Error in handleFormSave:', error);
        
        // Show error to user and prevent save
        Xrm.Navigation.openAlertDialog({
            text: "An error occurred while saving. Please try again.",
            title: "Save Error"
        });
        
        context.getEventArgs().preventDefault();
    }
}

/**
 * Validate form data before save
 */
function validateForm(formContext: Xrm.FormContext): boolean {
    const errors: string[] = [];
    
    // Example validation: Check required fields
    const nameAttr = formContext.getAttribute('name');
    if (nameAttr && !nameAttr.getValue()) {
        errors.push('Name is required');
        nameAttr.controls.forEach(control => {
            control.setNotification('Name is required', 'name_required');
        });
    }
    
    // Example validation: Check email format
    const emailAttr = formContext.getAttribute('emailaddress1');
    if (emailAttr && emailAttr.getValue()) {
        const email = emailAttr.getValue() as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
            emailAttr.controls.forEach(control => {
                control.setNotification('Please enter a valid email address', 'email_invalid');
            });
        }
    }
    
    // Example validation: Check phone number format
    const phoneAttr = formContext.getAttribute('telephone1');
    if (phoneAttr && phoneAttr.getValue()) {
        const phone = phoneAttr.getValue() as string;
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            errors.push('Phone number must be in format (123) 456-7890');
            phoneAttr.controls.forEach(control => {
                control.setNotification('Phone number must be in format (123) 456-7890', 'phone_invalid');
            });
        }
    }
    
    if (errors.length > 0) {
        // Show summary of errors
        Xrm.Navigation.openAlertDialog({
            text: `Please fix the following errors:\n${errors.join('\n')}`,
            title: "Validation Errors"
        });
        return false;
    }
    
    // Clear any existing notifications if validation passes
    clearFieldNotifications(formContext);
    return true;
}

/**
 * Perform operations before the form is saved
 */
function performPreSaveOperations(formContext: Xrm.FormContext): void {
    // Example: Set modified timestamp
    const modifiedOnAttr = formContext.getAttribute('modifiedon');
    if (modifiedOnAttr) {
        // This is typically handled by the system, but you could set custom fields
        console.debug('Form being saved at:', new Date().toISOString());
    }
    
    // Example: Auto-populate fields based on other field values
    const nameAttr = formContext.getAttribute('name');
    const descriptionAttr = formContext.getAttribute('description');
    
    if (nameAttr && descriptionAttr && nameAttr.getValue() && !descriptionAttr.getValue()) {
        descriptionAttr.setValue(`Auto-generated description for ${nameAttr.getValue()}`);
    }
}

/**
 * Clear field notifications
 */
function clearFieldNotifications(formContext: Xrm.FormContext): void {
    const fieldsToCheck = ['name', 'emailaddress1', 'telephone1'];
    
    fieldsToCheck.forEach(fieldName => {
        const attr = formContext.getAttribute(fieldName);
        if (attr) {
            attr.controls.forEach(control => {
                control.clearNotification();
            });
        }
    });
}
