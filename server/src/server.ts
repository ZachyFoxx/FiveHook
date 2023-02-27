const WEBHOOKS: Map<string, Webhook> = new Map<string, Webhook>();

// TODO: webhook url regex validation
// TODO: emitNet('FiveHook::RegistrationFail', _source, 'URI_EXISTS', `Webhook with URI ${webhookURI} already exists.`)
onNet('FiveHook::RegisterWebhook', (webhookURI: string, name: string) => {
  const _source = (global as any).source;

  if (WEBHOOKS.has(name)) {
    emitNet('FiveHook::RegistrationFail', _source, 'NAME_EXISTS', `Webhook with name ${name} already exists.`)
    return;
  }
  
  WEBHOOKS.set(name, {name, webhookURI})
  emitNet('FiveHook::RegistrationSuccess', _source, 'SUCCESS', `Webhook ${name} successfully registered.`)
})

onNet('FiveHook::SendHook', (webhook: string, json: string)=> {
  const _source = (global as any).source;
  if (!WEBHOOKS.has(webhook)) {
    emitNet('FiveHook::SendFail', _source, 'WEBHOOK_NOT_EXIST', `Webhook with name ${webhook} does not exist.`)
  }

  try {
    const message = JSON.parse(json);
    postWebhook(webhook, message);
  } catch (e) {
    emitNet('FiveHook::SendFail', _source, 'FATAL_ERROR', `Send failed with error ${e.message}`)
  }
})

function postWebhook(name: string, message: object) {
  
}
