export * from './EntityName';

export function handleSomethingGeneric(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const entityName = formContext.data.entity.getEntityName();
    console.debug('handleSomethingGeneric', `Entity Name: ${entityName}`);
}
