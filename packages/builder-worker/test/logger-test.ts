import { Logger, debug, log, warn, error } from "../src/logger";

const { test } = QUnit;

QUnit.module("logger", function (hooks) {
  hooks.beforeEach(() => {
    Logger.reset();
  });

  test("can log a message", async function (assert) {
    Logger.setLogLevel("info");
    Logger.log("message");
    assert.equal(
      Logger.messages().length,
      1,
      "the number of messages is correct"
    );
    let [message] = Logger.messages();
    assert.equal(message.level, "info", "the log level is correct");
    assert.equal(message.message, "message", "the log message is correct");
    assert.ok(message.timestamp, "there is a timestamp");
    assert.notOk(message.error, "an error object was not logged");
  });

  test("can log a debug message", async function (assert) {
    Logger.setLogLevel("debug");
    debug("message");
    let [message] = Logger.messages();
    assert.equal(message.level, "debug", "the log level is correct");
  });

  test("can log a warning message", async function (assert) {
    Logger.setLogLevel("warn");
    warn("message");
    let [message] = Logger.messages();
    assert.equal(message.level, "warn", "the log level is correct");
  });

  test("can log an error  message", async function (assert) {
    Logger.setLogLevel("error");
    error("message");
    let [message] = Logger.messages();
    assert.equal(message.level, "error", "the log level is correct");
  });

  test("can log a message with an error object", async function (assert) {
    log("message", new Error("boom"));
    let [message] = Logger.messages();
    assert.equal(message.error?.name, "Error", "the error name is correct");
    assert.equal(message.error?.message, "boom", "the error name is correct");
    assert.equal(
      Boolean(message.error?.stack?.match(/at Object/)),
      true,
      "an error stack exists"
    );
  });

  test("does not log message at a lower log level that configured log level", async function (assert) {
    Logger.setLogLevel("warn");
    log("should not log this");
    assert.equal(Logger.messages().length, 0, "no messages where logged");
  });

  test("does log a message at a higher log level that configured log level", async function (assert) {
    Logger.setLogLevel("warn");
    error("should log this");
    let [message] = Logger.messages();
    assert.equal(
      message.message,
      "should log this",
      "the log message is correct"
    );
  });

  test("does log a message at the same log level that configured log level", async function (assert) {
    Logger.setLogLevel("warn");
    warn("should log this");
    let [message] = Logger.messages();
    assert.equal(
      message.message,
      "should log this",
      "the log message is correct"
    );
  });
});
