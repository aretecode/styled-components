// @flow
/**
 * @todo use the one in _forks ?
 * Creates a broadcast that can be listened to, i.e. simple event emitter
 * @see https://github.com/ReactTraining/react-broadcast
 */

export type Broadcast = {
  // $FlowFixme @todo
  publish: (value: any) => void
  subscribe: (listener: (currentValue: any) => void) => number
  unsubscribe(x: number): void
}

const createBroadcast = (initialState: any): Broadcast => {
  const listeners = {}
  let id = 0
  let state = initialState

  function publish(nextState: any) {
    state = nextState

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in listeners) {
      const listener = listeners[key]
      if (listener === undefined) {
        // eslint-disable-next-line no-continue
        continue
      }

      listener(state)
    }
  }

  function subscribe(listener) {
    const currentId = id
    listeners[currentId] = listener
    id += 1
    listener(state)
    return currentId
  }

  function unsubscribe(unsubID: number) {
    listeners[unsubID] = undefined
  }

  return { publish, subscribe, unsubscribe }
}

export { createBroadcast }
export default createBroadcast
