import { Deferred } from "./deferred";
import { assertNever } from "shared/util";
import { ClientEvent } from "./client-event";

export type LogLevel = "debug" | "info" | "warn" | "error";

const levelValue = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const echoInConsole = false;

export interface LogMessagesClientEvent extends ClientEvent<LogMessage[]> {
  kind: "log-messages";
}
export interface LogMessage {
  level: LogLevel;
  message: string;
  error?: LogError;
  timestamp: number;
}

interface LogError {
  name: string;
  message: string;
  stack?: string;
}

export type LogListener = (messages: LogMessage[]) => void;

export class Logger {
  private static instance: Logger;

  static reset() {
    Logger.instance = new Logger(echoInConsole);
  }

  static error(message: string, error?: Error): void {
    Logger.log(message, "error", error);
  }

  static warn(message: string, error?: Error): void {
    Logger.log(message, "warn", error);
  }

  static debug(message: string, error?: Error): void {
    Logger.log(message, "debug", error);
  }

  static log(message: string): void;
  static log(message: string, level: LogLevel): void;
  static log(message: string, error: Error): void;
  static log(message: string, level: LogLevel, error?: Error): void;
  static log(
    message: string,
    levelOrError: LogLevel | Error = "info",
    error?: Error
  ): void {
    let logger = Logger.getInstance();

    let level: LogLevel;
    let logError: LogError | undefined;
    if (typeof levelOrError === "string") {
      level = levelOrError;
    } else {
      error = levelOrError;
      level = "error";
    }

    // need to turn this into a pojo so it can travel over postMessage
    if (error) {
      logError = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    if (levelValue[level] >= levelValue[logger.logLevel]) {
      let logMessage: LogMessage = {
        timestamp: Date.now(),
        message,
        level,
        error: logError,
      };

      logger._messages.push(logMessage);
      logger.dispatchMessage(logMessage);

      if (logger.echoInConsole) {
        switch (level) {
          case "debug":
            if (error !== undefined) {
              console.log(message, error);
            } else {
              console.log(message);
            }
            break;
          case "info":
            if (error !== undefined) {
              console.log(message, error);
            } else {
              console.log(message);
            }
            break;
          case "warn":
            if (error !== undefined) {
              console.warn(message, error);
            } else {
              console.warn(message);
            }
            break;
          case "error":
            if (error !== undefined) {
              console.error(message, error);
            } else {
              console.error(message);
            }
            break;
          default:
            assertNever(level);
        }
      }
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(echoInConsole);
    }
    return Logger.instance;
  }
  static messages(): LogMessage[] {
    return [...Logger.getInstance()._messages]; // prevent mutation of internal state
  }

  static addListener(fn: LogListener) {
    Logger.getInstance().listeners.add(fn);
  }

  static removeListener(fn: LogListener) {
    Logger.getInstance().listeners.delete(fn);
  }

  static removeAllListeners() {
    Logger.getInstance().listeners.clear();
  }

  static messagesFlushed(): Promise<void> {
    return Logger.getInstance().messagesFlushed();
  }

  static setLogLevel(level: LogLevel) {
    Logger.getInstance().logLevel = level;
  }

  logLevel: LogLevel = "debug";
  private _messages: LogMessage[] = [];
  private listeners: Set<LogListener> = new Set();
  private drainMessages?: Deferred<void>;
  private messageQueue: {
    message: LogMessage;
    listener: LogListener;
  }[] = [];

  private constructor(private echoInConsole: boolean = false) {}

  private messagesFlushed(): Promise<void> {
    // if you await this and no messages have been logged, we should resolve
    // immeidately instead of waiting for a message to occur.
    return this.drainMessages ? this.drainMessages.promise : Promise.resolve();
  }

  private dispatchMessage(message: LogMessage): void {
    if (this.listeners.size === 0) {
      return;
    }

    for (let listener of this.listeners) {
      this.messageQueue.push({ message, listener });
    }
    (async () => await this.drainMessageQueue())();
  }

  private async drainMessageQueue(): Promise<void> {
    await this.messagesFlushed();

    this.drainMessages = new Deferred();

    while (this.messageQueue.length > 0) {
      let eventArgs = this.messageQueue.shift();
      if (eventArgs) {
        let { message, listener } = eventArgs;
        let dispatched = new Deferred<void>();
        setTimeout(() => {
          listener([message]);
          dispatched.resolve();
        }, 0);
        await dispatched.promise;
      }
    }
    this.drainMessages.resolve();
  }
}

export function isLogMessagesClientEvent(
  data: any
): data is LogMessagesClientEvent {
  return (
    "kind" in data && data.kind === "log-messages" && "clientEvent" in data
  );
}
