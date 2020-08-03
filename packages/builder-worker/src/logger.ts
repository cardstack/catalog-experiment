import { assertNever } from "shared/util";
import { dispatchEvent, Event } from "./event-bus";

export type LogLevel = "debug" | "info" | "warn" | "error";

export function error(message: string, error?: Error): void {
  Logger.log(message, "error", error);
}

export function warn(message: string, error?: Error): void {
  Logger.log(message, "warn", error);
}

export function debug(message: string, error?: Error): void {
  Logger.log(message, "debug", error);
}

export function log(message: string, error?: Error): void {
  Logger.log(message, "info", error);
}

const levelValue = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const echoInConsole = false;

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

export class Logger {
  private static instance: Logger;

  static reset() {
    Logger.instance = new Logger(echoInConsole);
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
      dispatchEvent({ logger: [logMessage] });

      if (logger.echoInConsole || level === "error") {
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
              console.error(message, error, error.stack);
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
    let instance = Logger.getInstance();
    return [
      ...instance._messages.filter(
        (m) => levelValue[m.level] >= levelValue[instance.logLevel]
      ),
    ]; // prevent mutation of internal state
  }

  static setLogLevel(level: LogLevel) {
    Logger.getInstance().logLevel = level;
  }

  static echoInConsole(echoInConsole: boolean) {
    Logger.getInstance().echoInConsole = echoInConsole;
  }

  logLevel: LogLevel = "info";
  echoInConsole: boolean;
  private _messages: LogMessage[] = [];

  private constructor(echoInConsole: boolean = false) {
    this.echoInConsole = echoInConsole;
  }
}

export function isLogMessagesEvent(event: any): event is Event {
  return (
    typeof event === "object" &&
    typeof event.logger === "object" &&
    Array.isArray(event.logger)
  );
}

declare module "./event" {
  interface Event {
    logger?: LogMessage[];
  }
}
