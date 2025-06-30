export * from './OnLoad';
export * from './OnChange';
export * from './OnSave';

export function handleSomethingEntityGeneric(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const entityName = formContext.data.entity.getEntityName();
    console.debug('handleSomethingEntityGeneric', `Entity Name: ${entityName}`);
}
