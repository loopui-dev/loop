// import { createContainer, type Dispatched, listenWith } from "@remix-run/interaction";

// // import type { TypedEventTarget } from "./index.ts";

// export type EnsureEvent<TEvent, Target extends EventTarget> = TEvent extends Event
//     ? Dispatched<TEvent, Target>
//     : never;
// export type EventType<Target extends EventTarget> = Target extends {
//     __eventMap?: infer TEventMap;
// }
//     ? keyof TEventMap
//     : keyof EventMap<Target>;

// // prettier-ignore
// export type EventMap<Target extends EventTarget> = (
//   // TypedEventTarget
//   Target extends { __eventMap?: infer TypedEventMap } ? TypedEventMap :

//   // elements
//   Target extends HTMLElement ? HTMLElementEventMap :
//   Target extends Element ? ElementEventMap :
//   Target extends Window ? WindowEventMap :
//   Target extends Document ? DocumentEventMap :

//   // everything else
//   Target extends AbortSignal ? AbortSignalEventMap :
//   Target extends Animation ? AnimationEventMap :
//   Target extends AudioDecoder ? AudioDecoderEventMap :
//   Target extends AudioEncoder ? AudioEncoderEventMap :
//   Target extends AudioNode ? GlobalEventHandlersEventMap :
//   Target extends BaseAudioContext ? BaseAudioContextEventMap :
//   Target extends BroadcastChannel ? BroadcastChannelEventMap :
//   Target extends Clipboard ? GlobalEventHandlersEventMap :
//   Target extends EventSource ? EventSourceEventMap :
//   Target extends FileReader ? FileReaderEventMap :
//   Target extends FontFaceSet ? FontFaceSetEventMap :
//   Target extends IDBDatabase ? IDBDatabaseEventMap :
//   Target extends IDBTransaction ? IDBTransactionEventMap :
//   Target extends MediaDevices ? MediaDevicesEventMap :
//   Target extends MediaKeySession ? MediaKeySessionEventMap :
//   Target extends MediaQueryList ? MediaQueryListEventMap :
//   Target extends MediaRecorder ? MediaRecorderEventMap :
//   Target extends MediaSource ? MediaSourceEventMap :
//   Target extends MediaStream ? MediaStreamEventMap :
//   Target extends MediaStreamTrack ? MediaStreamTrackEventMap :
//   Target extends MessagePort ? MessagePortEventMap :
//   Target extends MIDIAccess ? MIDIAccessEventMap :
//   Target extends MIDIPort ? MIDIPortEventMap :
//   Target extends Node ? GlobalEventHandlersEventMap :
//   Target extends Notification ? NotificationEventMap :
//   Target extends OffscreenCanvas ? OffscreenCanvasEventMap :
//   Target extends PaymentRequest ? PaymentRequestEventMap :
//   Target extends PaymentResponse ? PaymentResponseEventMap :
//   Target extends Performance ? PerformanceEventMap :
//   Target extends PermissionStatus ? PermissionStatusEventMap :
//   Target extends PictureInPictureWindow ? PictureInPictureWindowEventMap :
//   Target extends RemotePlayback ? RemotePlaybackEventMap :
//   Target extends RTCDataChannel ? RTCDataChannelEventMap :
//   Target extends RTCDtlsTransport ? RTCDtlsTransportEventMap :
//   Target extends RTCDTMFSender ? RTCDTMFSenderEventMap :
//   Target extends RTCIceTransport ? RTCIceTransportEventMap :
//   Target extends RTCPeerConnection ? RTCPeerConnectionEventMap :
//   Target extends RTCSctpTransport ? RTCSctpTransportEventMap :
//   Target extends ScreenOrientation ? ScreenOrientationEventMap :
//   Target extends ServiceWorker ? AbstractWorkerEventMap :
//   Target extends ServiceWorkerContainer ? ServiceWorkerContainerEventMap :
//   Target extends ServiceWorkerGlobalScope ? ServiceWorkerGlobalScopeEventMap :
//   Target extends ServiceWorkerRegistration ? ServiceWorkerRegistrationEventMap :
//   Target extends SharedWorker ? AbstractWorkerEventMap :
//   Target extends SourceBuffer ? SourceBufferEventMap :
//   Target extends SourceBufferList ? SourceBufferListEventMap :
//   Target extends SpeechSynthesis ? SpeechSynthesisEventMap :
//   Target extends SpeechSynthesisUtterance ? SpeechSynthesisUtteranceEventMap :
//   Target extends TextTrack ? TextTrackEventMap :
//   Target extends TextTrackCue ? TextTrackCueEventMap :
//   Target extends TextTrackList ? TextTrackListEventMap :
//   Target extends VideoDecoder ? VideoDecoderEventMap :
//   Target extends VideoEncoder ? VideoEncoderEventMap :
//   Target extends VisualViewport ? VisualViewportEventMap :
//   Target extends WakeLockSentinel ? WakeLockSentinelEventMap :
//   Target extends WebSocket ? WebSocketEventMap :
//   Target extends Window ? (WindowEventMap & GlobalEventHandlersEventMap) :
//   Target extends Worker ? AbstractWorkerEventMap :
//   Target extends XMLHttpRequestEventTarget ? XMLHttpRequestEventTargetEventMap :
//   // default
//   GlobalEventHandlersEventMap & Record<string, Event>
// );

// // One entry can be called OR iterated directly
// type Stream<E> = ((options?: AddEventListenerOptions) => AsyncIterable<E>) & AsyncIterable<E>;

// // Every event name maps to a Stream<…>
// export type EventStreams<Target extends EventTarget> = {
//     [K in EventType<Target>]: Stream<EnsureEvent<EventMap<Target>[K], Target>>;
// };

// // Async generator per event type — honors AddEventListenerOptions
// async function* streamFor<Target extends EventTarget, K extends EventType<Target>>(
//     target: Target,
//     type: K,
//     options: AddEventListenerOptions = {},
//     externalSignal?: AbortSignal,
// ): AsyncIterable<EnsureEvent<EventMap<Target>[K], Target>> {
//     let queue: Event[] = [];
//     let notify: (() => void) | null = null;
//     let aborted = false;
//     let { signal, ...listenerOptions } = options;

//     // Combine both signals if both are provided
//     let signals = [signal, externalSignal].filter(Boolean) as AbortSignal[];

//     let listener = (ev: Event, _signal?: AbortSignal) => {
//         // Check if aborted before queueing
//         if (aborted) return;
//         queue.push(ev);
//         if (notify) {
//             let n = notify;
//             notify = null;
//             n();
//         }
//     };

//     let onAbort = (_event?: Event, _signal?: AbortSignal) => {
//         aborted = true;
//         // wake the consumer so it can exit
//         if (notify) {
//             let n = notify;
//             notify = null;
//             n();
//         }
//     };

//     let cleanups: (() => void)[] = [];

//     // Listen to all signals
//     for (let _signal of signals) {
//         if (_signal.aborted) {
//             // Already aborted, exit immediately
//             aborted = true;
//             return;
//         }

//         let container = createContainer(_signal);
//         container.set({
//             abort: onAbort,
//         });
//         cleanups.push(container.dispose);
//     }

//     // Attach with all provided options
//     let container = createContainer(target);
//     let wrappedListener =
//         Object.keys(listenerOptions).length > 0
//             ? listenWith(listenerOptions, listener as any)
//             : (listener as any);
//     container.set({
//         [type]: wrappedListener,
//     } as any);
//     cleanups.push(container.dispose);

//     try {
//         // If caller asked for once, we'll end the generator after the first yield
//         let endAfterOne = !!options.once;

//         while (!aborted) {
//             if (queue.length === 0) {
//                 await new Promise<void>(r => (notify = r));
//                 if (aborted) break;
//             }
//             // Check signal before emitting
//             if (aborted) break;
//             let ev = queue.shift()!;
//             yield ev as any;
//             if (endAfterOne) break;
//         }
//     } finally {
//         for (let clean of cleanups) {
//             clean();
//         }
//     }
// }

// // Make a stream that's both callable and iterable
// function makeStream<Target extends EventTarget, K extends EventType<Target>>(
//     target: Target,
//     type: K,
//     externalSignal?: AbortSignal,
// ): Stream<EnsureEvent<EventMap<Target>[K], Target>> {
//     // callable part: options -> AsyncIterable
//     let fn = (options?: AddEventListenerOptions) =>
//         streamFor<Target, K>(target, type, options, externalSignal);

//     // iterable part: for-await without options
//     (fn as Stream<any>)[Symbol.asyncIterator] = () =>
//         streamFor(target, type, undefined, externalSignal)[Symbol.asyncIterator]();

//     return fn as Stream<EnsureEvent<EventMap<Target>[K], Target>>;
// }

// // Build a proxy that returns a typed factory per event name
// function createEventStreams<Target extends EventTarget>(
//     target: Target,
//     signal?: AbortSignal,
// ): EventStreams<Target> {
//     return new Proxy({} as EventStreams<Target>, {
//         get: (_obj, key) => {
//             if (typeof key !== "string") return undefined;
//             return makeStream(target, key as any, signal);
//         },
//     });
// }

// export type ListenerFor<target extends EventTarget, k extends EventType<target>> = SignaledListener<
//     EnsureEvent<EventMap<target>[k], target>
// >;
// export type SignaledListener<event extends Event> = (
//     event: event,
//     signal?: AbortSignal,
// ) => void | Promise<void>;

// export type ListenerOrDescriptor<Listener> = Listener | Descriptor<Listener>;

// export interface Descriptor<L> {
//     options: AddEventListenerOptions;
//     listener: L;
// }

// export type EventListeners<target extends EventTarget = EventTarget> = Partial<{
//     [k in EventType<target>]:
//         | ListenerOrDescriptor<ListenerFor<target, k>>
//         | ListenerOrDescriptor<ListenerFor<target, k>>[];
// }>;

// export function on<Target extends EventTarget>(
//     target: Target,
//     listeners: EventListeners<Target>,
// ): () => void;
// export function on<Target extends EventTarget>(
//     target: Target,
//     signal: AbortSignal,
//     listeners: EventListeners<Target>,
// ): () => void;
// export function on<Target extends EventTarget>(
//     target: Target,
//     signal?: AbortSignal,
// ): EventStreams<Target>;
// export function on(
//     target: EventTarget,
//     listenersOrSignal?: EventListeners<any> | AbortSignal,
//     listeners?: EventListeners<any>,
// ): (() => void) | EventStreams<any> {
//     // Check if second parameter is an AbortSignal
//     const isSignal = listenersOrSignal instanceof AbortSignal;

//     if (isSignal && listeners) {
//         // on(target, signal, listeners)
//         let container = createContainer(target, listenersOrSignal);
//         container.set(listeners);
//         return container.dispose;
//     }

//     if (!isSignal && listenersOrSignal) {
//         // on(target, listeners)
//         let container = createContainer(target);
//         container.set(listenersOrSignal as EventListeners<any>);
//         return container.dispose;
//     }

//     // on(target) or on(target, signal) - return EventStreams
//     let signal = isSignal ? listenersOrSignal : undefined;
//     return createEventStreams(target, signal);
// }
