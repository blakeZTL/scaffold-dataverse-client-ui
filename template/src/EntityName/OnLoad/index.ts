export * from './HandleSomethingOnLoad';

export function handleSomethingOnLoadGeneric(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const entityName = formContext.data.entity.getEntityName();
    console.debug('handleSomethingOnLoadGeneric', `Entity Name: ${entityName}`);
}
