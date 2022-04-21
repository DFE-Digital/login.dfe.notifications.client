jest.mock('kue');


describe('when sending a 2FA login code', () => {

  const connectionString = 'some-redis-connection';
  const phoneNumber = '07700900000';
  const code = '123456';

  let invokeCallback;
  let jobSave;
  let create;
  let createQueue;
  let client;

  beforeEach(() => {
    invokeCallback = (callback) => {
      callback();
    };

    jobSave = jest.fn().mockImplementation((callback) => {
      invokeCallback(callback);
    });

    create = jest.fn().mockImplementation(() => {
      return {
        save: jobSave
      };
    });

    createQueue = jest.fn().mockReturnValue({
      create
    });

    const kue = require('dfe.login.kue');
    kue.createQueue = createQueue;

    const NotificationClient = require('./../lib');
    client = new NotificationClient({connectionString: connectionString});
  });

  test('then it should create queue connecting to provided connection string', async () => {
    await client.sendSecondFactorLoginCode(phoneNumber, code);

    expect(createQueue.mock.calls.length).toBe(1);
    expect(createQueue.mock.calls[0][0].redis).toBe(connectionString);
  });

  test('then it should create job with type of secondfactorlogincode_v1', async () => {
    await client.sendSecondFactorLoginCode(phoneNumber, code);

    expect(create.mock.calls.length).toBe(1);
    expect(create.mock.calls[0][0]).toBe('secondfactorlogincode_v1');
  });

  test('then it should create job with data including phone number', async () => {
    await client.sendSecondFactorLoginCode(phoneNumber, code);

    expect(create.mock.calls[0][1].phoneNumber).toBe(phoneNumber);
  });

  test('then it should create job with data including code', async () => {
    await client.sendSecondFactorLoginCode(phoneNumber, code);

    expect(create.mock.calls[0][1].code).toBe(code);
  });

  test('then it should save the job', async () => {
    await client.sendSecondFactorLoginCode(phoneNumber, code);

    expect(jobSave.mock.calls.length).toBe(1);
  });

  test('then it should resolve if there is no error', async () => {
    await expect(client.sendSecondFactorLoginCode(phoneNumber, code)).resolves.toBeUndefined();
  });

  test('then it should reject if there is an error', async () => {
    invokeCallback = (callback) => {
      callback('Unit test error');
    };

    await expect(client.sendSecondFactorLoginCode(phoneNumber, code)).rejects.toBeDefined();
  });

});