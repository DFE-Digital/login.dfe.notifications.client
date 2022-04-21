jest.mock('login.dfe.kue');


describe('when sending an invitation', () => {

  const connectionString = 'some-redis-connection';
  const email = 'user.one@unit.test';
  const firstName = 'User';
  const lastName = 'One';
  const invitationId = 'some-uuid';
  const code = 'ABC123';

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

    const kue = require('login.dfe.kue');
    kue.createQueue = createQueue;

    const NotificationClient = require('./../lib');
    client = new NotificationClient({connectionString: connectionString});
  });

  test('then it should create queue connecting to provided connection string', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(createQueue.mock.calls.length).toBe(1);
    expect(createQueue.mock.calls[0][0].redis).toBe(connectionString);
  });

  test('then it should create job with type of migrationinvite_v1', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(create.mock.calls.length).toBe(1);
    expect(create.mock.calls[0][0]).toBe('migrationinvite_v1');
  });

  test('then it should create job with data including email', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(create.mock.calls[0][1].email).toBe(email);
  });

  test('then it should create job with data including first name', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(create.mock.calls[0][1].firstName).toBe(firstName);
  });

  test('then it should create job with data including last name', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(create.mock.calls[0][1].lastName).toBe(lastName);
  });

  test('then it should create job with data including code', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(create.mock.calls[0][1].code).toBe(code);
  });

  test('then it should save the job', async () => {
    await client.sendMigrationInvitation(email, firstName, lastName, invitationId, code);

    expect(jobSave.mock.calls.length).toBe(1);
  });

  test('then it should resolve if there is no error', async () => {
    await expect(client.sendMigrationInvitation(email, firstName, lastName, invitationId, code)).resolves.toBeUndefined();
  });

  test('then it should reject if there is an error', async () => {
    invokeCallback = (callback) => {
      callback('Unit test error');
    };

    await expect(client.sendMigrationInvitation(email, firstName, lastName, invitationId, code)).rejects.toBeDefined();
  });

});