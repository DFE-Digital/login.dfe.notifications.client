jest.mock('kue');

describe('when sending an service approved email', () => {

  const connectionString = 'some-redis-connection';
  const email = 'user.one@unit.test';
  const firstName = 'User';
  const lastName = 'One';
  const orgName = 'testOrg';
  const serviceName = 'testServiceName';
  const requestedSubServices = ["test-sub-service"];

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

    const kue = require('kue');
    kue.createQueue = createQueue;

    const NotificationClient = require('./../lib');
    client = new NotificationClient({connectionString: connectionString});
  });

  test('then it should create queue connecting to provided connection string', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);

    expect(createQueue.mock.calls.length).toBe(1);
    expect(createQueue.mock.calls[0][0].redis).toBe(connectionString);
  });

  test('then it should create job with type of userserviceadded_v2', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);

    expect(create.mock.calls.length).toBe(1);
    expect(create.mock.calls[0][0]).toBe('userserviceadded_v2');
  });


  test('then it should create job with data including email', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);

    expect(create.mock.calls[0][1].email).toBe(email);
  });

  test('then it should create job with data including firstName', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);

    expect(create.mock.calls[0][1].firstName).toBe(firstName);
  });

  test('then it should create job with data including lastName', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);

    expect(create.mock.calls[0][1].lastName).toBe(lastName);
  });

  test('then it should save the job', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);

    expect(jobSave.mock.calls.length).toBe(1);
  });

  test('then it should resolve if there is no error', async () => {
    await client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices);
  });

  test('then it should reject if there is an error', async () => {
    invokeCallback = (callback) => {
      callback('Unit test error');
    };

    await expect(client.sendServiceRequestApproved(email, firstName, lastName, orgName, serviceName, requestedSubServices)).rejects.toBeDefined();
  });

});
