const kue = require('kue');

const send = async (type, data, connectionString) => {
  return new Promise((resolve, reject) => {
    const queue = kue.createQueue({
      redis: connectionString
    });
    queue.create(type, data)
      .save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
      });
  });
};

class NotificationClient {
  constructor({ connectionString }) {
    this.connectionString = connectionString;
  }

  async sendPasswordReset(email, code, clientId, uid) {
    await send('passwordreset_v1', { email, code, clientId, uid }, this.connectionString);
  }

  async sendInvitation(email, firstName, lastName, invitationId, code, serviceName, requiresDigipass, selfInvoked, overrides, isMigrationInvite, approverEmail, orgName, isApprover) {
    await send('invitation_v2', {
      email,
      firstName,
      lastName,
      invitationId,
      code,
      serviceName,
      requiresDigipass,
      selfInvoked,
      overrides,
      isMigrationInvite,
      approverEmail,
      orgName,
      isApprover,
    }, this.connectionString);
  }

  async sendMigrationInvitation(email, firstName, lastName, invitationId, code) {
    await send('migrationinvite_v1', { email, firstName, lastName, invitationId, code }, this.connectionString);
  }

  async sendSupportRequest(name, email, phone, service, type, message, orgName, urn) {
    await send('supportrequest_v1', { name, email, phone, service, type, message, orgName, urn }, this.connectionString);
  }

  async sendSupportRequestConfirmation(name, email, service, reference) {
    await send('supportrequestconfirmation_v1', { name, email, service, reference }, this.connectionString);
  }

  async sendRegisterExistingUser(email, firstName, lastName, serviceName, returnUrl) {
    await send('registerexistinguser_v1', {
      email,
      firstName,
      lastName,
      serviceName,
      returnUrl
    }, this.connectionString);
  }

  async sendRegistrationComplete(email, firstName, lastName) {
    await send('registrationcomplete_v1', { email, firstName, lastName }, this.connectionString);
  }

  async sendConfirmMigratedEmail(email, code, clientId, uid) {
    await send('confirmmigratedemail_v1', { email, code, clientId, uid }, this.connectionString);
  }

  async sendVerifyChangeEmail(email, firstName, lastName, code, uid = undefined) {
    const data = { email, firstName, lastName, code };
    if (uid) {
      data.uid = uid;
    }
    await send('verifychangeemail_v1', data, this.connectionString);
  }

  async sendNotifyMigratedEmail(email, firstName, lastName, newEmail) {
    await send('notifychangeemail_v1', { email, firstName, lastName, newEmail }, this.connectionString);
  }

  async sendAccessRequest(email, name, orgName, approved, reason) {
    await send('accessrequest_v1', {email, name, orgName, approved, reason}, this.connectionString);
  }

  async sendApproverAccessRequest(name, orgName, recipients) {
    await send('approveraccessrequest_v1', {name, orgName, recipients}, this.connectionString);
  }

  async sendSecondFactorLoginCode(phoneNumber, code) {
    await send('secondfactorlogincode_v1', {phoneNumber, code}, this.connectionString);
  }

  async sendSAPasswordReset(email, firstName, lastName) {
    await send('sapasswordreset_v1', {email, firstName, lastName}, this.connectionString);
  }

  async sendUnmigratedSaUser(email, firstName, lastName) {
    await send('unmigratedsauser_v1', {email, firstName, lastName}, this.connectionString);
  }

  async sendServiceAdded(email, firstName, lastName) {
    await send('userserviceadded_v1', {email, firstName, lastName}, this.connectionString);
  }

  async sendUserOrganisationRequest(requestId) {
    await send('organisationrequest_v1', {requestId}, this.connectionString);
  }

  async sendUserAddedToOrganisation(email,firstName,lastName,orgName) {
    await send('useraddedtoorganisationrequest_v1', {email,firstName,lastName,orgName}, this.connectionString);
  }
  
  async sendUserRemovedFromOrganisation(email,firstName,lastName,orgName) {
    await send('userremovedfromorganisationrequest_v1', {email,firstName,lastName,orgName}, this.connectionString);
  }
  
  async sendUserServiceRemoved(email,firstName,lastName,serviceName,orgName) {
    await send('userserviceremoved_v1', {email,firstName,lastName,serviceName,orgName}, this.connectionString);
  }

  async sendUserPermissionChanged(email,firstName, lastName, orgName, permissionName){
    await send('changeuserpermissionlevelrequest_v1', {email,firstName,lastName,orgName, permissionName}, this.connectionString);
  }
  
  async sendSupportOverdueRequest(name, requestsCount, email) {
    await send('supportoverduerequest', { name, requestsCount, email }, this.connectionString);
  }
}

module.exports = NotificationClient;
