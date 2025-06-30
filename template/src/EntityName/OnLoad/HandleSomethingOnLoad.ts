export function handleSomethingOnLoad(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const entityName = formContext.data.entity.getEntityName();
    console.debug('handleSomethingOnLoad', `Entity Name: ${entityName}`);
}
