/// <reference types="node" />
declare module 'kalm-j' {
	export = KalmJ;
}
declare namespace KalmJ {
    type Reply = (payload) => void;
    type Handler = (payload, reply: Reply, channel: Channel) => void;
    export class Server implements NodeJS.EventEmitter {
        constructor(options: {
            port: number,
            adapter: string,
            encoder: string,
            channels?: {
                [channel: string]: Handler;
            }
        });
        broadcast(channel: string, payload): void;
        stop(cb: Function): void;
        on(event: 'connection', listener: (client: Client) => void): this;
        subscribe(channel: string, handler: Handler): void;
        unsubscribe(channel: string, handler: Handler): void;
        whisper(channel: string, payload): void;

        addListener(event: string, listener: Function): this;
        on(event: string, listener: Function): this;
        once(event: string, listener: Function): this;
        prependListener(event: string, listener: Function): this;
        prependOnceListener(event: string, listener: Function): this;
        removeListener(event: string, listener: Function): this;
        removeAllListeners(event?: string): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
        eventNames(): string[];
        listenerCount(type: string): number;
    }
    export class Client implements NodeJS.EventEmitter {
        constructor(options: {
            hostname: string,
            port: number,
            adapter: string,
            encoder: string,
            channels?: {
                [channel: string]: Handler;
            }
        });
        destroy(): void;
        send(channel: string, payload): void;
        sendOnce(channel: string, payload): void;
        subscribe(channel: string, handler: Handler): void;
        unsubscribe(channel: string, handler: Handler): void;

		addListener(event: string, listener: Function): this;
        on(event: string, listener: Function): this;
        once(event: string, listener: Function): this;
        prependListener(event: string, listener: Function): this;
        prependOnceListener(event: string, listener: Function): this;
        removeListener(event: string, listener: Function): this;
        removeAllListeners(event?: string): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
        eventNames(): string[];
        listenerCount(type: string): number;
    }
    export class Channel {
        public id: string;
        public name: string;
        send(channel: string, payload): void;
        sendOnce(channel: string, payload): void;
        destroy(): void;
    }
}
